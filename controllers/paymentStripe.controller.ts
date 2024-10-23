import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../models/paymentStripe.model';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

// Create a payment intent
export const createPaymentIntent = async (req: Request, res: Response) => {
  const { email, amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

// Save payment details
export const savePaymentDetails = async (req: Request, res: Response) => {
  const { email, amount } = req.body;

  try {
    const newPayment = new Payment({
      email,
      amount,
    });

    await newPayment.save();

    res.status(200).json({ message: 'Payment saved successfully' });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
