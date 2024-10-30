import { Request, Response } from "express";
import PaymentsModel from "../../models/paymentModel/payment.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export const getPayments = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const userPaymentCollection = await PaymentsModel.findOne({ userId });

    if (!userPaymentCollection) {
      return res.status(404).send({ message: "Payment collection not found." });
    }

    res.status(200).send(userPaymentCollection.paymentEntries);
  } catch (error) {
    console.error("Error retrieving payment entries: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not retrieve payment entries." });
  }
};

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
    const existingPayment = await PaymentsModel.findOne({ userId });
    if (existingPayment) {
      for (let entry of paymentEntries) {
        const existingEntryIndex = existingPayment.paymentEntries.findIndex(
          (payment) => payment.transactionId === entry.transactionId
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
        message: "Payment updated successfully",
        paymentCollection: updatedPaymentCollection,
      });
    } else {
      const newPaymentCollection = new PaymentsModel({
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
        message: "New payment collection created",
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

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const err = error as Error;
    res.status(500).send({ error: err.message });
  }
};
