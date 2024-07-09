import mongoose, { Schema } from "mongoose";

interface Conversation {
  members: UserPref[];
  lastMessageAt: Date;
}

interface UserPref {
  _id: string;
  type_in_lang: string;
  receive_in_lang: string;
}

const userPrefSchema: Schema<UserPref> = new Schema<UserPref>(
  {
    _id: { type: String, ref: "User", required: true },
    type_in_lang: { type: String, required: true, default: "english" },
    receive_in_lang: { type: String, required: true, default: "english" },
  },
  { _id: false }
);

const conversationSchema: Schema<Conversation> = new Schema<Conversation>(
  {
    members: { type: [userPrefSchema], required: true },
    lastMessageAt: { type: Date, required: true, default: Date.now() },
  },
  { timestamps: true }
);

export const ConversationModel =
  (mongoose.models.Conversation as mongoose.Model<Conversation>) ||
  mongoose.model("Conversation", conversationSchema);
