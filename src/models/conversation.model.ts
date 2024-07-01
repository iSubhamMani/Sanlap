import mongoose, { Schema } from "mongoose";

interface Conversation {
  members: string[];
  lastMessageAt: Date;
}

const conversationSchema: Schema<Conversation> = new Schema<Conversation>(
  {
    members: [{ type: Schema.Types.String, ref: "User", required: true }],
    lastMessageAt: { type: Date, required: true, default: Date.now() },
  },
  { timestamps: true }
);

export const ConversationModel =
  (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
  mongoose.model("Conversation", conversationSchema);
