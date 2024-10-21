import { Request, Response } from "express";
import { RevenueModel } from "../../models/revenueGrowth/revenueGrowthCollection";
import {
  IIncomeEntry,
  IncomesModel,
} from "../../models/companyIncomes/incomesModel";

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
      growth: growth.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("Error calculating revenue growth:", error);
    res.status(500).send({ message: "Server error" });
  }
};
