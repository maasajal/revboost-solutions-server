import { Request, Response } from "express";
import { InvoiceModel } from "../../models/companyIncomes/Invoice.model";
import { ExpenseModel } from "../../models/expense.model";
import { RevenueGrowthModel } from "../../models/revenueGrowth.model";
import mongoose from "mongoose"; // Ensure to import mongoose for ObjectId

export const revenueGrowth = async (req: Request, res: Response) => {
  try {
    const userId  = req.params.id;

    // Validate the userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }

    // Calculate total income for the user
    const totalIncome = await InvoiceModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalIncome: { $sum: "$total" } } },
    ]);

    // Calculate total expenses for the user
    const totalExpenses = await ExpenseModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalExpenses: { $sum: "$total" } } },
    ]);

    // Fallback to zero if no income or expenses exist for the user
    const totalIncomeValue = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;
    const totalExpensesValue = totalExpenses.length > 0 ? totalExpenses[0].totalExpenses : 0;

    // Calculate growth percentage
    let growthPercentage = 0;
    if (totalExpensesValue > 0) {
      growthPercentage =
        ((totalIncomeValue - totalExpensesValue) / totalExpensesValue) * 100;
    }

    // Forecast example (assuming 10% projected income growth)
    const forecast = totalIncomeValue * 1.1;

    // Create or update the revenue growth for the user
    const revenueGrowth = await RevenueGrowthModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          totalIncome: totalIncomeValue,
          totalExpenses: totalExpensesValue,
          growthPercentage,
          forecast,
        },
      },
      { new: true, upsert: true } // Create new if not exist
    );

    res.status(200).send({
      message: "Revenue growth data calculated successfully",
      revenueGrowth,
      totalIncome: totalIncomeValue,
      totalExpenses: totalExpensesValue,
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server Error" });
  }
};
