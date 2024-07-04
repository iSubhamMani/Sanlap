import { connectDB } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { ConversationModel } from "@/models/conversation.model";
import { InvitationModel } from "@/models/invitation.model";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";
import mongoose from "mongoose";

export async function POST(req: CustomRequest) {
  await connectDB();

  try {
    const { sender, recipient } = (await req.json()) as InvitationRequest;

    if (!sender || !recipient) {
      return Response.json(
        new ApiError(400, "Sender and receiver is required"),
        { status: 400 }
      );
    }

    const updatedInvitation = await InvitationModel.findOneAndUpdate(
      { sender, recipient },
      { status: "accepted" }
    );

    if (!updatedInvitation) {
      return Response.json(new ApiError(500, "Error accepting invitation"), {
        status: 500,
      });
    }

    const newConversation = new ConversationModel({
      members: [sender, recipient],
    });

    await newConversation.save();

    if (!newConversation) {
      return Response.json(new ApiError(500, "Error creating conversation"), {
        status: 500,
      });
    }

    const conversationNotification = await ConversationModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(newConversation._id) },
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

    pusherServer.trigger(
      `conversations-${newConversation.members[0]}`,
      "new-conversation",
      conversationNotification[0]
    );
    pusherServer.trigger(
      `conversations-${newConversation.members[1]}`,
      "new-conversation",
      conversationNotification[0]
    );

    return Response.json(
      new ApiSuccess(200, "Conversation created", newConversation),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
