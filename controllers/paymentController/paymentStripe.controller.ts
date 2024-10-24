import { Request, Response } from "express";
import PaymentModel from "../../models/paymentModel/payment.model";
import { ExpensesModel } from "../../models/expenses/expenses.model";

// Save payment details
export const savePaymentDetails = async (req: Request, res: Response) => {
  const { userId, userEmail, paymentEntries } = req.body;
  if (
    !userId ||
    !userEmail ||
    !paymentEntries ||
    !Array.isArray(paymentEntries)
  ) {
    return res
      .status(400)
      .send({ message: "Invalid data. Please provide all required fields." });
  }

  try {
    const existingPayment = await PaymentModel.findOne({ userId });

    if (existingPayment) {
      for (let entry of paymentEntries) {
        const existingEntryIndex = existingPayment.paymentEntries.findIndex(
          (expense) => expense.transactionId === entry.transactionId
        );

        if (existingEntryIndex !== -1) {
          existingPayment.paymentEntries[existingEntryIndex] = {
            ...existingPayment.paymentEntries[existingEntryIndex],
            transactionId: entry.transactionId,
            payment_status: entry.payment_status,
            paymentDate: entry.paymentDate,
            due_date: entry.due_date,
            amount: entry.amount,
          };
        } else {
          // If entry doesn't exist, add it
          existingPayment.paymentEntries.push({
            transactionId: entry.transactionId,
            payment_status: entry.payment_status,
            paymentDate: entry.paymentDate,
            due_date: entry.due_date,
            amount: entry.amount,
          });
        }
      }

      const updatedPaymentCollection = await existingPayment.save();

      return res.status(200).send({
        message: "Expenses updated successfully",
        paymentCollection: updatedPaymentCollection,
      });
    } else {
      const newPaymentCollection = new ExpensesModel({
        userId,
        userEmail,
        paymentEntries: paymentEntries.map((entry) => ({
          transactionId: entry.transactionId,
          payment_status: entry.payment_status,
          paymentDate: entry.paymentDate,
          due_date: entry.due_date,
          amount: entry.amount,
        })),
      });

      const savedPaymentCollection = await newPaymentCollection.save();

      return res.status(201).send({
        message: "New expense collection created",
        paymentCollection: savedPaymentCollection,
      });
    }
  } catch (error: any) {
    console.error("Error adding/updating payment entries: ", error);
    return res.status(500).send({
      message: "Failed to add or update payment entries",
      error: error.message,
    });
  }
};
