import mongoose, { Model, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface Message {
  conversationId: Schema.Types.ObjectId;
  content: string;
  sender: string;
  recipient: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Message> = new Schema<Message>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.plugin(mongooseAggregatePaginate);

export const MessageModel =
  (mongoose.models.Message as Model<Message>) ||
  mongoose.model<Message>("Message", messageSchema);
