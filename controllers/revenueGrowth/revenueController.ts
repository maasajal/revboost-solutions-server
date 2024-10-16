import { Request, Response } from "express";
import { RevenueModel } from "../../models/revenueGrowth/revenueGrowthCollection";

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
    res
      .status(500)
      .send({
        message: "Server error. Could not add or update revenue entries.",
      });
  }
};
