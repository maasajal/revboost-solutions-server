import { Request, Response } from "express";
import { InvoiceModel } from "../../models/companyIncomes/Invoice.model";
export const createInvoices = async (req: Request, res: Response) => {
  try {
    const { customerName, companyName, invoiceNumber, date, invoiceDueDate, customerAddress,items, no,quantity,unitPrice ,totalPrice} =
      req.body;

      // Create a new invoice
    const newInvoice = new InvoiceModel({
      customerName,
      companyName,
      invoiceNumber,
      date,
      invoiceDueDate,
      customerAddress,
      items: [{
        no: items.no,
        item: items.item,
        quantity: items.quantity,
        unitPrice: items.unitPrice,
        totalAmount: items.totalAmount
      }],
      no,
      quantity,
      unitPrice,
      totalPrice,

    });
    console.log(newInvoice)
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

export const getIndividualInvoice = async (req: Request, res: Response) => {
  try {

    const incomeId = req.params.id;
    const invoice = await InvoiceModel.findById(incomeId);
    if (!invoice) {
        return res.status(404).json({ message: "invoice not found" });
    }
    res.status(200).json({
        message: "invoice retrieved successfully",
        data: invoice,
    });
} catch (error: unknown) {
    if (error instanceof Error) {
        res.status(500).json({
            message: "Error retrieving invoice",
            error: error.message,
        });
    } else {
        res.status(500).json({
            message: "An unknown error occurred",
        });
    }
}

}

export const deleteIndividualInvoice = async (req: Request, res: Response) => {
  try {
      const incomeId = req.params.id;
      const deletedInvoice = await InvoiceModel.findByIdAndDelete(incomeId);
      if (!deletedInvoice) {
          return res.status(404).json({ message: "invoice not found" });
      }

      res.status(200).json({
          message: "invoice deleted successfully",
          data: deletedInvoice,
        });
  } catch (error: unknown) {
      if (error instanceof Error) {
          res.status(500).json({
              message: "Error deleting individual invoice",
              error: error.message,
          });
      } else {
          res.status(500).json({
              message: "An unknown error occurred",
          });
      }
  }
};