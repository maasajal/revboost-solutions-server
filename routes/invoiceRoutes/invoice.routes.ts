import express from "express";
import { allInvoices, createInvoices } from "../../controllers/invoiceController/invoice.controller";
const router = express.Router();

router.post("/api/invoices", createInvoices)
router.get("/api/invoices", allInvoices)

export default router