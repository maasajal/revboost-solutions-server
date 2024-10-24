import { Router } from 'express';
import { initiatePayment, handlePaymentSuccess, handlePaymentFail, handlePaymentCancel, createPayment } from '../../controllers/pricing/payment/payment.controller';
import { getPayments, savePaymentDetails } from '../../controllers/paymentController/paymentStripe.controller';

const router = Router();

router.get("/:userId", getPayments);
router.post("/add-payment", savePaymentDetails);
// Route to initiate payment
router.post('/initiate', initiatePayment);

// route to create method
router.post('/create', createPayment);
// Route for payment success callback
router.post('/success', handlePaymentSuccess);

// Route for payment fail callback
router.post('/fail', handlePaymentFail);

// Route for payment cancel callback
router.post('/cancel', handlePaymentCancel);

export default router;
