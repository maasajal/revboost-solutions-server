import { Request, Response } from "express";
import { ExpenseModel } from "../models/expense.model"
export const createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const { no, item, quantity, unitPrice } = req.body;
        console.log(req.body);
        let { total } = req.body;
        total = quantity * unitPrice;
        const newExpense = new ExpenseModel({
            no,
            item,
            quantity,
            unitPrice,
            total
        });

        
        await newExpense.save();

        
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
        return res.status(200).json({ message: "Information updated successfully", expense });

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


export const getIndividualExpense = async (req: Request, res: Response) => {
    try {

        const expenseId = req.params.id;
        const expense = await ExpenseModel.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.status(200).json({
            message: "Expense retrieved successfully",
            data: expense,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error retrieving expense",
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
};


export const getAllExpense = async (req: Request, res: Response): Promise<void> => {
    try {
        const expenses = await ExpenseModel.find();
        res.status(200).json({
            message: "Expenses retrieved successfully",
            data: expenses,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error retrieving expenses",
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
};


export const deleteIndividualExpense = async (req: Request, res: Response) => {
    try {
        const expenseId = req.params.id;
        const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);
        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            data: deletedExpense,
          });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error deleting individual expense",
                error: error.message,
            });
        } else {
            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
};


export const deleteExpense = async (req:Request, res: Response) =>{
    try {
        const deleteExpense = await ExpenseModel.deleteMany({});
        res.status(200).json({
            message : `${deleteExpense.deletedCount} all expense deleted successfully`
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error deleting expense  entry",
                error: error.message,
            });
        } else {

            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
}