import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    customerName: String,
    companyName: String,
    invoiceNumber: String,
    date: String,
    customerAddress: String,
    // items: [{
    //   no: Number,
    //   item: String,
    //   quantity: Number,
    //   unitPrice: Number,
    //   totalAmount: Number
    // }]
  });

export  const InvoiceModel = mongoose.model('Invoice', invoiceSchema);