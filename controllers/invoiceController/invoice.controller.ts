import { Request, Response } from "express";
import { InvoiceModel } from "../../models/companyIncomes/Invoice.model";
export const createInvoices = async (req: Request, res: Response) => {
  try {
    const { customerName, companyName, invoiceNumber, date, invoiceDueDate, customerAddress } =
      req.body;

      // Create a new invoice
    const newInvoice = new InvoiceModel({
      customerName,
      companyName,
      invoiceNumber,
      date,
      invoiceDueDate,
      customerAddress,
    });
    // Save the invoice bill in the database
    await newInvoice.save();
    res.status(201).json({
      message: "Invoice Bill created successfully",
      data: newInvoice,
  });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const allInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await InvoiceModel.find();
    res.send(invoices);
  } catch (error) {
    res.status(500).send(error);
  }
};
