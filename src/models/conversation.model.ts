import mongoose, { Schema } from "mongoose";

interface Conversation {
  members: string[];
  lastMessageAt: Date;
  name?: string;
  profilePicture?: string;
}

const conversationSchema: Schema<Conversation> = new Schema<Conversation>(
  {
    members: [{ type: Schema.Types.String, ref: "User", required: true }],
    lastMessageAt: { type: Date, required: true, default: Date.now() },
    name: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ConversationModel =
  (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
  mongoose.model("Conversation", conversationSchema);
