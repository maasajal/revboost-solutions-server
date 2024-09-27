import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    create: {
        type: String,
        required: true,
    },
    no: {
        type: Number
    },
    item: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },

});


export const ExpenseModel = mongoose.model(
    "ExpenseModel",
    ExpenseSchema
);