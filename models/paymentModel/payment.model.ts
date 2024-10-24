import { Schema, model, Document } from "mongoose";

interface IPaymentEntry {
  transactionId: string;
  payment_status: string;
  paymentDate: Date;
  due_date: Date;
  amount: number;
}
// Payment Document Interface
interface PaymentDocument extends Document {
  userId: string;
  userEmail: string;
  paymentEntries: IPaymentEntry[];
}

// Mongoose Payment Schema
const paymentEntrySchema = new Schema<IPaymentEntry>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    payment_status: {
      type: String,
      required: true,
      default: "pending",
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    due_date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentSchema = new Schema<PaymentDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    paymentEntries: [paymentEntrySchema],
  },
  {
    timestamps: true,
  }
);

// Create the Payment model from the schema
const PaymentsModel = model<PaymentDocument>(
  "paymentCollections",
  PaymentSchema
);

export default PaymentsModel;
