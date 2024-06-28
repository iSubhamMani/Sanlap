import mongoose, { Schema } from "mongoose";

export interface Conversation {
  participants: string[];
}

const conversationSchema: Schema<Conversation> = new Schema<Conversation>(
  {
    participants: [{ type: Schema.Types.String, ref: "User", required: true }],
  },
  { timestamps: true }
);

export const ConversationModel =
  (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
  mongoose.model("Conversation", conversationSchema);
