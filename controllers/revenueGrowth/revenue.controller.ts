import { Request, Response } from "express";
import { InvoiceModel } from "../../models/companyIncomes/Invoice.model";
import { ExpenseModel } from "../../models/expense.model";

export const revenueGrowth = async (req: Request, res: Response) => {
  try {
    const allIncome = await InvoiceModel.find();
    const allExpense = await ExpenseModel.find();
    console.log(allIncome, allExpense);
    res.send({ allIncome, allExpense });
  } catch (error) {
    res.status(500).send(error);
  }
};
