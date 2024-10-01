import mongoose from "mongoose";

const ExpenseAddressSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    create: {
        type: String,
        required: true,
    },
});

export const ExpenseAddressModel = mongoose.model("ExpenseAddressModel",ExpenseAddressSchema);