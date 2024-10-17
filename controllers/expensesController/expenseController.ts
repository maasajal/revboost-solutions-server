import { Request, Response } from "express";
import { ExpensesModel } from "../../models/expenses/expenses.model";

export const getExpenses = async (req: Request, res: Response) => {
  const { userId } = req.params; // Get the userId from the request parameters
  try {
    // Find the income collection for the specified user
    const userExpenseCollection = await ExpensesModel.findOne({ userId });

    if (!userExpenseCollection) {
      return res.status(404).send({ message: "Expense collection not found." });
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
    const existingExpenseCollection = await ExpensesModel.findOne({ userId });

    if (existingExpenseCollection) {
      for (let entry of expenseEntries) {
        const existingEntryIndex =
          existingExpenseCollection.expenseEntries.findIndex(
            (expense) => expense.expenseId === entry.expenseId
          );

        if (existingEntryIndex !== -1) {
          existingExpenseCollection.expenseEntries[existingEntryIndex] = {
            ...existingExpenseCollection.expenseEntries[existingEntryIndex],
            item: entry.item,
            quantity: entry.quantity,
            unitPrice: entry.unitPrice,
            total: entry.quantity * entry.unitPrice,
          };
        } else {
          // If entry doesn't exist, add it
          existingExpenseCollection.expenseEntries.push({
            expenseId: entry.expenseId,
            item: entry.item,
            quantity: entry.quantity,
            unitPrice: entry.unitPrice,
            total: entry.quantity * entry.unitPrice,
          });
        }
      }

      const updatedExpenseCollection = await existingExpenseCollection.save();

      return res.status(200).send({
        message: "Expenses updated successfully",
        expenseCollection: updatedExpenseCollection,
      });
    } else {
      const newExpenseCollection = new ExpensesModel({
        userId,
        userEmail,
        expenseEntries: expenseEntries.map((entry) => ({
          expenseId: entry.expenseId,
          item: entry.item,
          quantity: entry.quantity,
          unitPrice: entry.unitPrice,
          total: entry.quantity * entry.unitPrice,
        })),
      });

      const savedExpenseCollection = await newExpenseCollection.save();

      return res.status(201).send({
        message: "New expense collection created",
        expenseCollection: savedExpenseCollection,
      });
    }
  } catch (error) {
    console.error("Error adding/updating expense entries: ", error);
    return res.status(500).send({
      message: "Failed to add or update expense entries",
    });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { userId, expenseId } = req.params;
    const updatedExpenseCollection = await ExpensesModel.findOneAndUpdate(
      { userId },
      { $pull: { expenseEntries: { expenseId } } },
      { new: true }
    );

    if (!updatedExpenseCollection) {
      return res.status(404).send({
        message: "Income collection not found or expenseId doesn't exist.",
      });
    }

    res.status(200).send(updatedExpenseCollection.expenseEntries);
  } catch (error) {
    console.error("Error deleting income entry: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not delete income entry." });
  }
};
