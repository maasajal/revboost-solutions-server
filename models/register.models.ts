import mongoose from "mongoose";

const today = new Date();
const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  photo: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  companyName: {
    type: String,
  },
  date: {
    type: String,
    default: today,
  },
  subscriptionStatus: {
    type: String,
    default: "inactive",
  },
  selectedPackage: {
    type: String,
    default: null,
  },
});

export const RegisterModel = mongoose.model(
  "registerCollections",
  RegisterSchema
);
