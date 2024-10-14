import { Request, Response } from "express";
import { ExpenseAddressModel } from "../models/expense.address.model";

export const createExpenseAddress = async (req: Request, res: Response) => {
    try {
        const { companyName, create } = req.body;
        console.log(req.body);
        if (!companyName) {
            return res.status(400).json({ message: "Company name is required" });
        }
        if (!create) {
            return res.status(400).json({ message: "Creation month is required" });
        }

        const expenseAddress = new ExpenseAddressModel({
            companyName,
            create
        });

        await expenseAddress.save();
        res.status(201).json({
            message: "Expense address created successfully",
            data: expenseAddress,
        });

        

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error creating expense address entry",
                error: error.message,
            });
        } else {

            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
}

export const getExpenseAddress = async (req:Request, res: Response) =>{
    try {
        const address = await ExpenseAddressModel.find();
        res.status(200).json({
            message: "Expense address retrieved successfully",
            data: address
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error getting expense address entry",
                error: error.message,
            });
        } else {

            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
};


export const deleteExpenseAddress = async (req:Request, res:Response) =>{
    try {
        const deletedAddresses = await ExpenseAddressModel.deleteMany({}); 
        res.status(200).json({
            message: ` ${deletedAddresses.deletedCount}All expense addresses deleted successfully`,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Error deleting expense address entry",
                error: error.message,
            });
        } else {

            res.status(500).json({
                message: "An unknown error occurred",
            });
        }
    }
}