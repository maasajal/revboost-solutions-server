import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  photo: string;
  mobile: string;
  role: string;
  subscriptionStatus: string;
  subscriptionPlan: string;
  features: string[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
    },
    mobile: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    subscriptionStatus: {
      type: String,
      default: "inactive",
    },
    subscriptionPlan: {
      type: String,
      default: "basic",
    },
    features: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>("userCollections", userSchema);
