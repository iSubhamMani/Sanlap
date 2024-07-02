import { connectDB } from "@/lib/db";
import { MessageModel } from "@/models/message.model";
import { MessageRequest } from "@/types/MessageRequest";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";
import { CustomRequest } from "@/utils/CustomRequest";

export async function POST(req: CustomRequest) {
  await connectDB();

  try {
    const { sender, recipient, content, conversationId } =
      (await req.json()) as MessageRequest;

    if (!sender || !recipient || !content || !conversationId) {
      return Response.json(new ApiError(400, "Invalid request body"), {
        status: 400,
      });
    }

    const message = new MessageModel({
      sender,
      recipient,
      content,
      conversationId,
    });

    const newMessage = await message.save();

    if (!newMessage) {
      return Response.json(new ApiError(500, "Failed to send message"));
    }

    return Response.json(
      new ApiSuccess(201, "Message sent successfully", newMessage),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}
