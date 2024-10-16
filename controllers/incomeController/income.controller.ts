import { IncomeModel } from "../../models/companyIncomes/income.model";
import { Request, Response } from 'express';

// Get Income Collection for a User
export const getIncomeCollection = async (req: Request, res: Response) => {
  
    const { userId } = req.params;
    try {
      const incomeCollection = await IncomeModel.findOne({ userId });
      if (!incomeCollection) {
        return res.status(404).json({ message: 'Income collection not found.' });
      }
      res.json(incomeCollection);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error });
    }
};

// Add a New Income Entry
export const addIncomeEntry = async (req: Request, res: Response) =>{
    const { userId } = req.params;
  const { incomeId, amount, source, date, userEmail } = req.body;

  try {
    let incomeCollection = await IncomeModel.findOne({ userId });

    if (!incomeCollection) {
      // If no collection exists, create one
      incomeCollection = new IncomeModel({
        userId,
        userEmail, // Ensure userEmail is sent in the request
        incomeEntries: [],
      });
    }

    // Add new income entry
    incomeCollection.incomeEntries.push({ incomeId, amount, source, date });

    // Save the updated collection
    await incomeCollection.save();

    res.status(201).json(incomeCollection);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { userId, incomeId } = req.params; // Get the userId and incomeId from the request parameters

    // Find the income collection and remove the specific income entry
    const updatedIncomeCollection = await IncomeModel.findOneAndUpdate(
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

// module.exports = {
//     getIncomeCollection,
//     addIncomeEntry,
//   };