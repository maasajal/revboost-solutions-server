import { Request, Response } from 'express';
import { ExpenseModel } from '../models/expense.model';

export const address = async (req: Request, res: Response) => {
    try {
        const { companyName, create } = req.body;

        // Basic Validation
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required" });
        }

        if (!create) {
            return res.status(400).json({ message: "Create month is required" });
        }

        // Create a new Expense
        const expense = new ExpenseModel({
            companyName,
            create,
        });

        // Save the Expense to the database
        await expense.save();

        // Respond with the created Expense
        res.status(201).json(expense);
    } catch (error) {
        const err = error as Error;
        console.error("Error in address function: ", err); // Use console.error for error logs
        res.status(500).json({ error: "Internal Server Error" });
    }
};
