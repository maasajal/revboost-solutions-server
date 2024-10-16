import mongoose, { Schema } from "mongoose";

interface IExpenseEntry {
  expenseId: string;
  item: string;
  quantity: number;
  unitPrice: Number;
  total: number;
}

interface IExpenseCollection extends Document {
  userId: string; // Reference to User
  userEmail: string;
  expenseEntries: IExpenseEntry[];
}

const expenseEntrySchema: Schema<IExpenseEntry> = new Schema(
  {
    expenseId: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const expenseCollectionSchema: Schema<IExpenseCollection> = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    expenseEntries: [expenseEntrySchema], // Array of income entries
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);
export const ExpensesModel = mongoose.model<IExpenseCollection>(
  "expenseCollections",
  expenseCollectionSchema
);
