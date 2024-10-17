// server
import mongoose from "mongoose";

const incomeEntrySchema = new mongoose.Schema({
  incomeId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const incomeCollectionSchema = new mongoose.Schema({
  userId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref:"User",
    type: String,
    required: true,
    unique: true, // Assuming one income collection per user
  },
  userEmail: {
    type: String,
    required: true,
  },
  incomeEntries: [incomeEntrySchema],
});

export const IncomeModel = mongoose.model('IncomeCollection', incomeCollectionSchema);
