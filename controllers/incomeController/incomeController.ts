import { Request, Response } from "express";
import { IncomesModel } from "../../models/companyIncomes/incomesModel";

export const getIncomes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userIncomeCollection = await IncomesModel.findOne({ userId });

    if (!userIncomeCollection) {
      return res.status(404).send({ message: "Income collection not found." });
    }

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
    const existingIncomeCollection = await IncomesModel.findOne({ userId });

    if (existingIncomeCollection) {
      for (let entry of incomeEntries) {
        const existingEntryIndex =
          existingIncomeCollection.incomeEntries.findIndex(
            (expense) => expense.incomeId === entry.incomeId
          );

        if (existingEntryIndex !== -1) {
          existingIncomeCollection.incomeEntries[existingEntryIndex] = {
            ...existingIncomeCollection.incomeEntries[existingEntryIndex],
            amount: entry.amount,
            source: entry.source,
            date: entry.date,
            vat_status: "pending",
            tax_status: "pending",
          };
        } else {
          existingIncomeCollection.incomeEntries.push({
            incomeId: entry.incomeId,
            amount: entry.amount,
            source: entry.source,
            date: entry.date,
            vat_status: "pending",
            tax_status: "pending",
          });
        }
      }

      const updatedIncomeCollection = await existingIncomeCollection.save();

      return res.status(200).send({
        message: "Expenses updated successfully",
        incomeCollection: updatedIncomeCollection,
      });
    } else {
      const newIncomeCollection = new IncomesModel({
        userId,
        userEmail,
        incomeEntries: incomeEntries.map((entry) => ({
          incomeId: entry.incomeId,
          amount: entry.amount,
          source: entry.source,
          date: entry.date,
          vat_status: "pending",
          tax_status: "pending",
        })),
      });

      const savedIncomeCollection = await newIncomeCollection.save();

      return res.status(201).send({
        message: "New expense collection created",
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
