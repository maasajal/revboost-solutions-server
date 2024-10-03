import mongoose from "mongoose";


const ExpenseSchema = new mongoose.Schema({

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
    total: {
        type: Number,
    }

});


export const ExpenseModel = mongoose.model(
    "ExpenseModel",
    ExpenseSchema
);