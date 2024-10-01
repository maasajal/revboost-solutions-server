import { Request, Response } from "express";
import { ExpenseModel } from "../models/expense.model"
export const createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { no, item, quantity, unitPrice } = req.body;

        // Create a new expense entry using the model
        const newExpense = new ExpenseModel({
            no,
            item,
            quantity,
            unitPrice,
        });

        // Save the expense entry in the database
        await newExpense.save();

        // Send success response
        res.status(201).json({
            message: "Expense entry created successfully",
            data: newExpense,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error creating expense entry",
                error: error.message,
            });
        } else {
            // Fallback for cases where error is not an instance of Error
            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }

};

export const updateExpense = async (req: Request, res: Response) => {
    try {

        const { no, item, quantity, unitPrice } = req.body;

        const updatedData = { no, item, quantity, unitPrice };
        const expense = await ExpenseModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!expense) {
            return res.status(404).json({ message: "Company not found" })
        }
        return res.status(200).json({message: "Information updated successfully",expense});
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error updating expense entry",
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
};