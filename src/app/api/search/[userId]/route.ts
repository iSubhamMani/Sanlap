import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { ApiSuccess } from "@/utils/ApiSuccess";

export async function GET(req: Request, res: Response) {
  await connectDB();

  try {
    const url = new URL(req.url);
    const userId = url.pathname.split("/")[3];
    const searchQuery = url.searchParams.get("q");

    if (!searchQuery) {
      return Response.json(new ApiError(400, "Missing search query"), {
        status: 400,
      });
    }

    // search for users

    const searchResult = await UserModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { displayName: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
              ],
            },
            {
              _id: { $ne: userId },
            },
          ],
        },
      },
    ]);

    return Response.json(new ApiSuccess(200, "Search results", searchResult), {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(new ApiError(500, error.message), {
      status: 500,
    });
  }
}
