import mongoose, { Schema } from "mongoose";

interface IRevenueEntry {
  period: string; // e.g., "2023-Q1", "2023-Q2", "2024-Q1"
  revenue: number;
}

interface IRevenueCollection {
  userId: string; // Reference to User
  userEmail: string;
  revenueEntries: IRevenueEntry[];
}

const revenueEntrySchema: Schema<IRevenueEntry> = new Schema({
  period: { type: String, required: true },
  revenue: { type: Number, required: true },
});

const revenueCollectionSchema: Schema<IRevenueCollection> = new Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    revenueEntries: [revenueEntrySchema],
  },
  { timestamps: true }
);

export const RevenueModel = mongoose.model<IRevenueCollection>(
  "revenueCollections",
  revenueCollectionSchema
);