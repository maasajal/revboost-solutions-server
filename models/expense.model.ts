import mongoose from "mongoose";


const ExpenseSchema = new mongoose.Schema({
    companyName: {
        type: String
    },
    create: {
        type: String
    },
    no: {
        type: Number
    },
    item: {
        type: String
    },
    quantity: {
        type: Number
    },
    unitPrice: {
        type: Number
    },

});


export const RegisterModel = mongoose.model(
    "expenseCollections",
    ExpenseSchema
);