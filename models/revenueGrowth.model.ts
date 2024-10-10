import mongoose, { Schema } from "mongoose";

export interface RevenueGrowth {
  userId: Schema.Types.ObjectId;
  totalIncome: number;
  totalExpenses: number;
  growthPercentage: number;
  forecast: number;
}

const revenueGrowthSchema: Schema<RevenueGrowth> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "userCollections",
    required: true,
  },
  totalIncome: {
    type: Number,
    required: true,
  },
  totalExpenses: {
    type: Number,
    required: true,
  },
  growthPercentage: {
    type: Number,
    required: true,
  },
  forecast: {
    type: Number,
  },
});

export const RevenueGrowthModel = mongoose.model<RevenueGrowth>(
  "RevenueGrowthCollections",
  revenueGrowthSchema
);
