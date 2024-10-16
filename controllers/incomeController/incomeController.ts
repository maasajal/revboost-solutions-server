import { Request, Response } from "express";
import { IncomesModel } from "../../models/companyIncomes/incomesModel";

export const getIncomes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    // Find the income collection for the specified user
    const userIncomeCollection = await IncomesModel.findOne({ userId });

    if (!userIncomeCollection) {
      return res.status(404).send({ message: "Income collection not found." });
    }

    // Return the income entries
    res.status(200).send(userIncomeCollection.incomeEntries);
  } catch (error) {
    console.error("Error retrieving income entries: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not retrieve income entries." });
  }
};

export const addOrUpdateIncome = async (req: Request, res: Response) => {
  const { userId, userEmail, incomeEntries } = req.body;
  if (
    !userId ||
    !userEmail ||
    !incomeEntries ||
    !Array.isArray(incomeEntries)
  ) {
    return res
      .status(400)
      .send({ message: "Invalid data. Please provide all required fields." });
  }

  try {
    const existingIncomeCollection = await IncomesModel.findOne({
      userId,
      userEmail,
    });

    if (existingIncomeCollection) {
      const updatedIncomeCollection = await IncomesModel.findOneAndUpdate(
        { userId }, // Find the income collection by userId
        { $push: { incomeEntries: { $each: incomeEntries } } }, // Use $push to add new entries to the array
        { new: true } // Return the updated document
      );

      if (!updatedIncomeCollection) {
        return res
          .status(404)
          .send({ message: "Income collection not found." });
      }
      return res.status(200).send({
        message: "Income entry added to existing collection",
        incomeCollection: updatedIncomeCollection,
      });
    } else {
      const newIncomeCollection = new IncomesModel({
        userId,
        userEmail,
        incomeEntries,
      });
      const savedIncomeCollection = await newIncomeCollection.save();

      res.status(201).send({
        message: "New income collection created",
        incomeCollection: savedIncomeCollection,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Failed to add or update income entry",
    });
  }
};

export const updateIncomeEntries = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters
    const { incomeEntries } = req.body; // Get the income entries from the request body

    // Validate request body
    if (!incomeEntries || !Array.isArray(incomeEntries)) {
      return res.status(400).send({
        message: "Invalid data. Please provide valid income entries.",
      });
    }

    // Update the incomeEntries array by adding new entries (without replacing the existing ones)
    const updatedIncomeCollection = await IncomesModel.findOneAndUpdate(
      { userId }, // Find the income collection by userId
      { $push: { incomeEntries: { $each: incomeEntries } } }, // Use $push to add new entries to the array
      { new: true } // Return the updated document
    );

    if (!updatedIncomeCollection) {
      return res.status(404).send({ message: "Income collection not found." });
    }

    // Respond with the updated income collection
    res.status(200).send(updatedIncomeCollection);
  } catch (error) {
    console.error("Error updating income entries: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not update income entries." });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { userId, incomeId } = req.params; // Get the userId and incomeId from the request parameters

    // Find the income collection and remove the specific income entry
    const updatedIncomeCollection = await IncomesModel.findOneAndUpdate(
      { userId }, // Find by userId
      { $pull: { incomeEntries: { incomeId } } }, // Use $pull to remove the income entry with the given incomeId
      { new: true } // Return the updated document
    );

    if (!updatedIncomeCollection) {
      return res.status(404).send({
        message: "Income collection not found or incomeId doesn't exist.",
      });
    }

    // Return the updated incomeEntries array
    res.status(200).send(updatedIncomeCollection.incomeEntries);
  } catch (error) {
    console.error("Error deleting income entry: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not delete income entry." });
  }
};
