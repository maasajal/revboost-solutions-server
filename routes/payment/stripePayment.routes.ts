import express from 'express';
import { createPaymentIntent, savePaymentDetails } from '../../controllers/paymentStripe.controller';
const router = express.Router();

// Route for creating payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Route for saving payment details after successful payment
router.post('/save-payment', savePaymentDetails);

export default router;
