import { connectDB } from "@/lib/db";
import { InvitationModel } from "@/models/invitation.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";

type InvitationRequest = {
  sender?: string;
  recipient?: string;
  status?: string;
};

// create a new invitation
export async function POST(req: Request) {
  await connectDB();

  try {
    const { sender, recipient } = (await req.json()) as InvitationRequest;

    if (!sender || !recipient) {
      return Response.json(
        new ApiError(400, "Sender and receiver is required"),
        { status: 400 }
      );
    }

    const newInvitation = new InvitationModel({
      sender,
      recipient,
      status: "pending",
    });

    const createdInvitation = await newInvitation.save();

    if (!createdInvitation) {
      return Response.json(new ApiError(500, "Error creating invitation"), {
        status: 500,
      });
    }

    return Response.json(
      new ApiSuccess(201, "Invitation Created", createdInvitation),
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json(new ApiError(400, "User ID is required"), {
        status: 400,
      });
    }

    const invitations = await InvitationModel.aggregate([
      {
        $match: { recipient: userId },
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
        $unwind: "$sender",
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return Response.json(new ApiSuccess(200, "Invitations", invitations), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
