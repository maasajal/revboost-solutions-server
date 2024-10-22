import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  companyName: string;
  name: string;
  phone: string;
  details: string;
  readStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMessages extends Document {
  email: string;
  messages: IMessage[];
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    companyName: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    details: { type: String, required: true },
    readStatus: { type: String, default: "unread" },
  },
  {
    timestamps: true,
  }
);

const userMessagesSchema: Schema<IUserMessages> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// Create models
const UserMessages = mongoose.model<IUserMessages>(
  "customerMessage",
  userMessagesSchema
);

export default UserMessages;
