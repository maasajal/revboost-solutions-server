import express from "express";
import { allInvoices, createInvoices } from "../../controllers/invoiceController/invoice.controller";
const router = express.Router();

router.post("/invoices", createInvoices)
router.get("/invoices", allInvoices)

export default router