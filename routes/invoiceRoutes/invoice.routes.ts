import express from "express";
import { allInvoices, createInvoices, deleteIndividualInvoice, getIndividualInvoice } from "../../controllers/invoiceController/invoice.controller";
const router = express.Router();

router.post("/create", createInvoices)
router.get("/all", allInvoices)

router.get("/create/:id", getIndividualInvoice);
router.delete("/create/:id", deleteIndividualInvoice);

export default router