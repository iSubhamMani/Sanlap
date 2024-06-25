import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user.model";
import { Document } from "mongoose";

type CustomRequest = {
  _id?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
};

export async function POST(req: Request) {
  await connectDB();

  try {
    const { _id, email, displayName, photoURL } =
      (await req.json()) as CustomRequest;

    if (!email || !displayName || !_id || !photoURL) {
      return Response.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const exisitingUser = await UserModel.findOne({ email });

    if (exisitingUser) {
      return Response.json(
        {
          success: true,
          message: "User already exists",
          data: exisitingUser,
        },
        {
          status: 200,
        }
      );
    }

    // new user, save to db

    const user: Document = new UserModel({
      email,
      displayName,
      _id,
      photoURL,
    });

    const createdUser: Document = await user.save();

    if (!createdUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to create user",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      message: "User created successfully",
      success: true,
      data: createdUser,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Error creating user",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
