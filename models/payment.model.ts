import { Schema, model, Document } from 'mongoose';

interface IPaymentEntry {
  transactionId: string;
  paymentDate: Date;
  paymentTime: string;
  amount: number;
}
// Payment Document Interface
interface PaymentDocument extends Document {
  userId: string;
  userEmail: string;
  paymentEntries: IPaymentEntry[]
}

// Mongoose Payment Schema
const paymentEntrySchema = new Schema<IPaymentEntry>({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentTime: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});


const PaymentSchema = new Schema<PaymentDocument>({
  userId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  paymentEntries:[paymentEntrySchema]
});

// Create the Payment model from the schema
const PaymentModel = model<PaymentDocument>('paymentCollections', PaymentSchema);

export default PaymentModel;
