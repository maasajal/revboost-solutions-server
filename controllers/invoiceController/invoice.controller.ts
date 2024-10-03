import { Request, Response } from "express";
import { InvoiceModel } from "../../models/companyIncomes/Invoice.model";
export const createInvoices = async (req: Request, res: Response) => {
  try {
    const newInvoice = new InvoiceModel(req.body);
    await newInvoice.save();
    res.status(201).send(newInvoice);
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
