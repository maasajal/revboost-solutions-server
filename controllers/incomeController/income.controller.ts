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

// module.exports = {
//     getIncomeCollection,
//     addIncomeEntry,
//   };