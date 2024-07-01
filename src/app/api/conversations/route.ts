import { connectDB } from "@/lib/db";
import { ConversationModel } from "@/models/conversation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function GET(req: CustomRequest) {
  await connectDB();

  try {
    const userId = req.headers.get("userId");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    const allConversations = await ConversationModel.find({
      members: { $in: [userId] },
    })
      .sort({ lastMessageAt: -1 })
      .populate("members")
      .exec();

    return Response.json(new ApiSuccess(200, "Invitations", allConversations), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
