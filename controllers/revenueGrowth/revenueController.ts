import { Request, Response } from "express";
import { RevenueModel } from "../../models/revenueGrowth/revenueGrowthCollection";
import {
  IIncomeEntry,
  IncomesModel,
} from "../../models/companyIncomes/incomesModel";
import mongoose from "mongoose";
import { ExpensesModel } from "../../models/expenses/expenses.model";

export const getRevenueData = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const revenueCollection = await RevenueModel.findOne({ userId });

    if (!revenueCollection) {
      return res.status(404).send({ message: "No revenue data found." });
    }

    return res.status(200).send(revenueCollection.revenueEntries);
  } catch (error) {
    console.error("Error fetching revenue data: ", error);
    res.status(500).send({ message: "Server error" });
  }
};

export const addOrUpdateRevenue = async (req: Request, res: Response) => {
  const { userId, userEmail, revenueEntries } = req.body;

  // Validate request data
  if (!userId || !userEmail || !Array.isArray(revenueEntries)) {
    return res
      .status(400)
      .send({ message: "Invalid data. Please provide all required fields." });
  }

  try {
    // Check if the user already has a revenue collection
    const existingRevenueCollection = await RevenueModel.findOne({ userId });

    if (existingRevenueCollection) {
      // If a revenue collection exists, update it by adding new revenue entries or updating existing ones
      const updatedRevenueCollection = await RevenueModel.findOneAndUpdate(
        { userId }, // Find revenue by userId
        {
          $set: {
            revenueEntries: revenueEntries.map((entry) => ({
              period: entry.period,
              revenue: entry.revenue,
            })),
          },
        },
        { new: true, upsert: true } // Upsert will create the entry if it doesn't exist
      );

      return res.status(200).send({
        message: "Revenue entries added or updated successfully",
        revenueCollection: updatedRevenueCollection,
      });
    } else {
      // If no revenue collection exists, create a new one
      const newRevenueCollection = new RevenueModel({
        userId,
        userEmail,
        revenueEntries,
      });

      const savedRevenueCollection = await newRevenueCollection.save();

      return res.status(201).send({
        message: "New revenue collection created successfully",
        revenueCollection: savedRevenueCollection,
      });
    }
  } catch (error) {
    console.error("Error adding or updating revenue entries: ", error);
    res.status(500).send({
      message: "Server error. Could not add or update revenue entries.",
    });
  }
};

export const calculateMonthlyRevenue = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userIncome = await IncomesModel.findOne({ userId });
    if (!userIncome) {
      return res
        .status(404)
        .send({ message: "No income data found for the user." });
    }

    const incomeByMonth = userIncome.incomeEntries.reduce(
      (acc: { [key: string]: number }, entry: IIncomeEntry) => {
        const yearMonth = new Date(entry.date).toISOString().slice(0, 7);

        if (!acc[yearMonth]) {
          acc[yearMonth] = 0;
        }
        acc[yearMonth] += entry.amount;
        return acc;
      },
      {}
    );

    const months = Object.keys(incomeByMonth).sort();
    if (months.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough data to calculate growth." });
    }

    const currentMonthRevenue = incomeByMonth[months[months.length - 1]];
    const previousMonthRevenue = incomeByMonth[months[months.length - 2]];

    const growth =
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100;

    return res.status(200).send({
      currentMonthRevenue,
      previousMonthRevenue,
      monthlyGrowth: growth.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server error" });
  }
};

export const calculateQuarterlyRevenue = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;
    const userIncome = await IncomesModel.findOne({ userId });
    if (!userIncome) {
      return res
        .status(404)
        .send({ message: "No income data found for the user." });
    }

    const getQuarter = (date: Date): string => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (month >= 1 && month <= 3) return `${year} January to March`;
      if (month >= 4 && month <= 6) return `${year} April to June`;
      if (month >= 7 && month <= 9) return `${year} July to September`;
      return `${year} October to December`;
    };

    const incomeByQuarter = userIncome.incomeEntries.reduce(
      (acc: { [key: string]: number }, entry: IIncomeEntry) => {
        const quarter = getQuarter(new Date(entry.date));

        if (!acc[quarter]) {
          acc[quarter] = 0;
        }

        acc[quarter] += entry.amount;

        return acc;
      },
      {}
    );

    const quarters = Object.keys(incomeByQuarter).sort();
    if (quarters.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough data to calculate growth." });
    }

    const currentQuarterRevenue =
      incomeByQuarter[quarters[quarters.length - 1]];
    const previousQuarterRevenue =
      incomeByQuarter[quarters[quarters.length - 2]];

    const growth =
      ((currentQuarterRevenue - previousQuarterRevenue) /
        previousQuarterRevenue) *
      100;

    return res.status(200).send({
      currentQuarter: quarters[quarters.length - 1],
      previousQuarter: quarters[quarters.length - 2],
      currentQuarterRevenue,
      previousQuarterRevenue,
      quarterlyGrowth: growth.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server error" });
  }
};

export const calculateHalfYearRevenue = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userIncome = await IncomesModel.findOne({ userId });
    if (!userIncome) {
      return res
        .status(404)
        .send({ message: "No income data found for the user." });
    }
    const getHalfYear = (date: Date): string => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (month >= 1 && month <= 6) return `${year} January to June`;
      return `${year} July to December`;
    };

    const incomeByHalfYear = userIncome.incomeEntries.reduce(
      (acc: { [key: string]: number }, entry: IIncomeEntry) => {
        const halfYear = getHalfYear(new Date(entry.date));

        if (!acc[halfYear]) {
          acc[halfYear] = 0;
        }

        acc[halfYear] += entry.amount;

        return acc;
      },
      {}
    );

    const halfYears = Object.keys(incomeByHalfYear).sort();

    if (halfYears.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough data to calculate growth." });
    }

    const currentHalfYearRevenue =
      incomeByHalfYear[halfYears[halfYears.length - 1]];
    const previousHalfYearRevenue =
      incomeByHalfYear[halfYears[halfYears.length - 2]];

    const growth =
      ((currentHalfYearRevenue - previousHalfYearRevenue) /
        previousHalfYearRevenue) *
      100;

    return res.status(200).send({
      currentHalfYear: halfYears[halfYears.length - 1],
      previousHalfYear: halfYears[halfYears.length - 2],
      currentHalfYearRevenue,
      previousHalfYearRevenue,
      halfYearlyGrowth: growth.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server error" });
  }
};

export const calculateYearlyRevenue = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userIncome = await IncomesModel.findOne({ userId });
    if (!userIncome) {
      return res
        .status(404)
        .send({ message: "No income data found for the user." });
    }
    const getYear = (date: Date): string => {
      const year = date.getFullYear();
      return `${year}`;
    };

    const incomeByYear = userIncome.incomeEntries.reduce(
      (acc: { [key: string]: number }, entry: IIncomeEntry) => {
        const year = getYear(new Date(entry.date));

        if (!acc[year]) {
          acc[year] = 0;
        }

        acc[year] += entry.amount;

        return acc;
      },
      {}
    );

    const years = Object.keys(incomeByYear).sort();

    if (years.length < 2) {
      return res
        .status(400)
        .send({ message: "Not enough data to calculate growth." });
    }

    const currentYearRevenue = incomeByYear[years[years.length - 1]];
    const previousYearRevenue = incomeByYear[years[years.length - 2]];

    const growth =
      ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100;

    return res.status(200).send({
      currentYear: years[years.length - 1],
      previousYear: years[years.length - 2],
      currentYearRevenue,
      previousYearRevenue,
      yearlyGrowth: growth.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server error" });
  }
};

export const calculateTotalRevenueGrowth = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid User ID" });
    }

    const userIncome = await IncomesModel.findOne({ userId });
    console.log("total", userIncome)
    if (!userIncome) {
      return res
        .status(404)
        .send({ message: "No income data found for the user." });
    }

    const totalIncome = await IncomesModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } }, // Ensure $amount is correct
    ]);

    const totalExpenses = await ExpensesModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalExpenses: { $sum: "$total" } } }, // Ensure $total is correct
    ]);

    const totalIncomeValue =
      totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;
    const totalExpensesValue =
      totalExpenses.length > 0 ? totalExpenses[0].totalExpenses : 0;

    let growthPercentage = 0;
    if (totalExpensesValue > 0) {
      growthPercentage =
        ((totalIncomeValue - totalExpensesValue) / totalExpensesValue) * 100;
    }

    const forecast = totalIncomeValue * 1.1;

    res.status(200).send({
      totalIncome: totalIncomeValue,
      totalExpenses: totalExpensesValue,
      growthPercentage,
      forecast,
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server Error" });
  }
};
