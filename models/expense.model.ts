import mongoose, { Schema } from "mongoose";

export interface Expense {
    no: number;
    item: string;
    quantity: number;
    unitPrice: Number;
    total: number
}

const ExpenseSchema : Schema<Expense> = new Schema({

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


export const ExpenseModel = mongoose.model<Expense>(
    "ExpenseModel",
    ExpenseSchema
);