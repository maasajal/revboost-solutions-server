import mongoose, { Schema, Types, ObjectId, model } from "mongoose";

interface IIncomeEntry {
  incomeId: string;
  amount: number;
  source: string;
  date: Date;
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
