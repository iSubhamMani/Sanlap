import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { MessageModel } from "@/models/message.model";
import { MessageRequest } from "@/types/MessageRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";
import axios from "axios";

export async function POST(req: CustomRequest) {
  await connectDB();

  try {
    const {
      sender,
      recipient,
      content,
      conversationId,
      source_lang,
      target_lang,
    } = (await req.json()) as MessageRequest;

    if (
      !sender ||
      !recipient ||
      !content ||
      !conversationId ||
      !source_lang ||
      !target_lang
    ) {
      return Response.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    let translated_content = content;

    if (source_lang !== target_lang) {
      const response = await axios.post(
        `http://localhost:3000/api/translate-content`,
        {
          source_lang,
          target_lang,
          text: content,
        }
      );

      if (response.status !== 200) {
        return Response.json(new ApiError(500, response.data?.message), {
          status: 500,
        });
      }
      translated_content = response.data.data;
    }

    const message = new MessageModel({
      sender,
      recipient,
      content,
      conversationId,
      translated_content,
    });

    const createdMessage = await message.save();

    if (!createdMessage) {
      return Response.json(new ApiError(500, "Failed to send message"));
    }

    const newMessage = await MessageModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(createdMessage._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipient",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $unwind: "$recipient",
      },
    ]);

    await pusherServer.trigger(
      `messages-${conversationId}`,
      "new-message",
      newMessage[0]
    );

    return Response.json(
      new ApiSuccess(201, "Message sent successfully", createdMessage),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
