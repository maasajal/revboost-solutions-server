import express from "express";
import { allInvoices, createInvoices, getIndividualInvoice } from "../../controllers/invoiceController/invoice.controller";
const router = express.Router();

router.post("/create", createInvoices)
router.get("/all", allInvoices)

router.get("/create/:id", getIndividualInvoice);

export default router