import express from "express";
import { allInvoices, createInvoices } from "../../controllers/invoiceController/invoice.controller";
const router = express.Router();

router.post("/create", createInvoices)
router.get("/all", allInvoices)

export default router