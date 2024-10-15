import { Request, Response } from 'express';
import PaymentModel from '../../../models/payment.model';
import SSLCommerz from 'ssl-commerz-node';
const SSLCommerzPayment = require('sslcommerz-lts')
// import SSLCommerzPayment from "sslcommerz-lts"

// SSLCommerz Credentials
const storeId = process.env.SSLCOM_STORE_ID;
const storePassword = process.env.SSLCOM_STORE_PASSWORD;
const isLive = false; // true for live, false for sandbox

// Create an instance of the SSLCommerz Payment Gateway
const sslcz =new SSLCommerzPayment(storeId, storePassword, isLive);

// Initiate Payment
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const {userEmail , amount, userId } = req.body;

    // SSLCommerz Payment Data
    const data = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: `tran_${new Date().getTime()}`, // Unique transaction ID
      success_url: 'http://yourdomain.com/payment/success',
      fail_url: 'http://yourdomain.com/payment/fail',
      cancel_url: 'http://yourdomain.com/payment/cancel',
      cus_name: 'Customer Name',
      cus_email: userEmail,
      cus_add1: 'Customer Address',
      cus_phone: 'Customer Phone',
      shipping_method: 'NO',
      product_name: 'Product Name',
      product_category: 'Product Category',
      product_profile: 'general',
    };

    // Initiate SSLCommerz payment
    const paymentResponse = await sslcz.init(data);

    if (paymentResponse.GatewayPageURL) {
      // Return the payment redirect URL to the frontend
      res.status(200).json({
        redirectUrl: paymentResponse.GatewayPageURL,
        transactionId: data.tran_id,
      });
    } else {
      res.status(500).json({ error: 'Payment initiation failed!' });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error!' });
  }
};

// Handle Payment Success
export const handlePaymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tran_id, val_id } = req.body; // Retrieve from SSLCommerz response

    // Payment details from SSLCommerz
    const paymentDetails = await sslcz.validate({ val_id, tran_id });

    if (paymentDetails.status === 'VALID') {
      // Save payment details in MongoDB
      const newPayment = new PaymentModel({
        email: paymentDetails.cus_email,
        transactionId: tran_id,
        paymentDate: new Date(),
        paymentTime: new Date().toLocaleTimeString(),
        amount: paymentDetails.amount,
      });

      await newPayment.save();

      // Redirect or respond to frontend
      res.status(200).json({ message: 'Payment successful!', paymentDetails });
    } else {
      res.status(400).json({ message: 'Payment validation failed!' });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error!' });
  }
};

// Handle Payment Fail
export const handlePaymentFail = (req: Request, res: Response) => {
  res.status(400).json({ message: 'Payment failed!' });
};

// Handle Payment Cancel
export const handlePaymentCancel = (req: Request, res: Response) => {
  res.status(400).json({ message: 'Payment cancelled by user!' });
};





export const createPayment = async (req: Request, res: Response) => {
  try {
    const { userId, userEmail, paymentEntries } = req.body;

    // Validate the required fields
    if (!userId || !userEmail || !paymentEntries || !Array.isArray(paymentEntries)) {
      return res.status(400).json({ message: 'Missing required fields or invalid data' });
    }
    console.log("message" , userId, userEmail, paymentEntries)

    // Check if all payment entries have required fields
    for (const entry of paymentEntries) {
      const { transactionId, paymentDate, paymentTime, amount } = entry;

      if (!transactionId || !paymentTime || !amount) {
        return res.status(400).json({ message: 'Invalid payment entry data' });
      }
    }

    // Create a new payment record
    const newPayment = new PaymentModel({
      userId,
      userEmail,
      paymentEntries,
    });

    // Save to the database
    const savedPayment = await newPayment.save();

    // Send success response
    res.status(201).send({ message: 'Payment record created successfully', payment: savedPayment });
  } catch (error) {
    console.error('Error creating payment record:', error);
    // res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};