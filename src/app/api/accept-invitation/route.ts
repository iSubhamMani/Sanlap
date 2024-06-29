import { connectDB } from "@/lib/db";
import { CustomRequest } from "@/middleware";
import { ConversationModel } from "@/models/conversation.model";
import { InvitationModel } from "@/models/invitation.model";
import { InvitationRequest } from "@/types/InvitationRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";

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

    const newConversation = await ConversationModel.create({
      participants: [sender, recipient],
    });

    if (!newConversation) {
      return Response.json(new ApiError(500, "Error creating conversation"), {
        status: 500,
      });
    }

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
