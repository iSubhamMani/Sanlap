import { connectDB } from "@/lib/db";
import { ConversationModel } from "@/models/conversation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

export async function GET(req: CustomRequest) {
  await connectDB();

  try {
    const { pathname } = new URL(req.url);
    const chatId = pathname.split("/")[3];
    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    if (!chatId) {
      return Response.json(new ApiError(400, "Chat ID is required"), {
        status: 400,
      });
    }

    const chatDetails = await ConversationModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(chatId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
    ]);

    if (!chatDetails) {
      return Response.json(new ApiError(404, "Chat not found"), {
        status: 404,
      });
    }

    return Response.json(
      new ApiSuccess(200, "Chat Details fetched successfully", chatDetails[0]),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
