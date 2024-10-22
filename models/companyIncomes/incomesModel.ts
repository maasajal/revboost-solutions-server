import mongoose, { Schema, Types, ObjectId, model } from "mongoose";

export interface IIncomeEntry {
  incomeId: string;
  amount: number;
  source: string;
  date: Date;
  vat_status: string;
  tax_status: string;
}

interface IIncomeCollection extends Document {
  userId: string; // Reference to User
  userEmail: string;
  incomeEntries: IIncomeEntry[];
}

const incomeEntrySchema: Schema<IIncomeEntry> = new Schema(
  {
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
    vat_status: {
      type: String,
    },
    tax_status: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const incomeCollectionSchema: Schema<IIncomeCollection> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    incomeEntries: [incomeEntrySchema], // Array of income entries
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);
export const IncomesModel = mongoose.model<IIncomeCollection>(
  "incomeCollections",
  incomeCollectionSchema
);
