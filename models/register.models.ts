import mongoose from "mongoose";


const today = new Date();
const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String, 
    default:'user',  
  },
  companyName: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
    default:today, 
  },
});

export const RegisterModel = mongoose.model(
  "registerCollections",
  RegisterSchema
);
