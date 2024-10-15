import { Request, Response } from "express";
import { ExpensesModel } from "../../models/expenses/expenses.model";

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    // Find the income collection for the specified user
    const userExpenseCollection = await ExpensesModel.findOne({ userId });

    if (!userExpenseCollection) {
      return res.status(404).send({ message: "Income collection not found." });
    }

    // Return the income entries
    res.status(200).send(userExpenseCollection.expenseEntries);
  } catch (error) {
    console.error("Error retrieving income entries: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not retrieve income entries." });
  }
};

export const addOrUpdateExpense = async (req: Request, res: Response) => {
  const { userId, userEmail, expenseEntries } = req.body;
  if (
    !userId ||
    !userEmail ||
    !expenseEntries ||
    !Array.isArray(expenseEntries)
  ) {
    return res
      .status(400)
      .send({ message: "Invalid data. Please provide all required fields." });
  }

  try {
    const existingExpenseCollection = await ExpensesModel.findOne({
      userId,
      userEmail,
    });

    if (existingExpenseCollection) {
      const updatedExpenseCollection = await ExpensesModel.findOneAndUpdate(
        { userId }, // Find the income collection by userId
        { $push: { expenseEntries: { $each: expenseEntries } } }, // Use $push to add new entries to the array
        { new: true } // Return the updated document
      );

      if (!updatedExpenseCollection) {
        return res
          .status(404)
          .send({ message: "Income collection not found." });
      }
      return res.status(200).send({
        message: "Income entry added to existing collection",
        expenseCollection: updatedExpenseCollection,
      });
    } else {
      const newExpenseCollection = new ExpensesModel({
        userId,
        userEmail,
        expenseEntries,
      });
      const savedExpenseCollection = await newExpenseCollection.save();

      res.status(201).send({
        message: "New income collection created",
        expenseCollection: savedExpenseCollection,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Failed to add or update income entry",
    });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { userId, expenseId } = req.params; // Get the userId and expenseId from the request parameters

    // Find the income collection and remove the specific income entry
    const updatedExpenseCollection = await ExpensesModel.findOneAndUpdate(
      { userId }, // Find by userId
      { $pull: { expenseEntries: { expenseId } } }, // Use $pull to remove the income entry with the given expenseId
      { new: true } // Return the updated document
    );

    if (!updatedExpenseCollection) {
      return res.status(404).send({
        message: "Income collection not found or expenseId doesn't exist.",
      });
    }

    // Return the updated expenseEntries array
    res.status(200).send(updatedExpenseCollection.expenseEntries);
  } catch (error) {
    console.error("Error deleting income entry: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not delete income entry." });
  }
};
