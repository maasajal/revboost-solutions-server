import express from "express";
import { createInvoices } from "../../controllers/invoiceController/invoice.controller";
const router = express.Router();

router.post("/api/invoices", createInvoices)

export default router