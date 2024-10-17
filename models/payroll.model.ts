import { Schema, Document, model } from "mongoose";

interface IPayrollEntry {
  employeeName: string;
  position: string;
  salary: number;
  bonus: number;
  taxDeduction: number;
  month: string;
}

interface IPayrollCollection extends Document {
  userId: string; // Reference to User
  userEmail: string;
  payrollEntries: IPayrollEntry[];
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const payrollEntrySchema = new Schema<IPayrollEntry>(
  {
    employeeName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    bonus: {
      type: Number,
      min: 0,
      default: 0,
    },
    taxDeduction: {
      type: Number,
      min: 0,
      default: 0,
    },
    month: {
      type: String,
      enum: MONTHS,
      default: () => {
        const currentMonthIndex = new Date().getMonth();
        return MONTHS[currentMonthIndex];
      },
    },
  },
  {
    timestamps: true,
  }
);

const payrollCollectionSchema = new Schema<IPayrollCollection>(
  {
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    payrollEntries: [payrollEntrySchema], // Array of payroll entries
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export const PayrollModel = model<IPayrollCollection>(
  "payrollCollections",
  payrollCollectionSchema
);
