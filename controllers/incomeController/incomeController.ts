import { Request, Response } from "express";
import mongoose from "mongoose";
import { IncomesModel } from "../../models/companyIncomes/incomesModel";

const getMonthIndex = (monthName: string): number => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(monthName); // Returns -1 if monthName is invalid
};
interface IIncomeEntry {
  _id: mongoose.Types.ObjectId; // অথবা string, যদি আপনি string হিসাবে ID ব্যবহার করেন
  incomeId: string;
  amount: number;
  source: string;
  date: Date;
  vat_status: string;
  tax_status: string;
  createdAt: Date;
  updatedAt: Date;
}
interface IIncomesModel {
  _id: mongoose.Types.ObjectId; // অথবা string
  userId: string;
  userEmail: string;
  incomeEntries: IIncomeEntry[]; // IIncomeEntry টাইপ ব্যবহার করুন
  createdAt: Date;
  updatedAt: Date;
}

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
            vat_amount: 0,
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
    const { userId, incomeId } = req.query; // Get the userId and incomeId from the request parameters

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

interface QueryData {
  userId: string;
  selectedMonth: string;
  selectedYear: number;
}

// Function to filter income entries by date
export const filterIncomeEntriesByDate = async (
  req: Request,
  res: Response
) => {
  const { selectedMonth, userId, selectedYear } = req.body;

  if (!selectedMonth || selectedYear === "null") {
    const userIncomeCollection = await IncomesModel.findOne({ userId });
    res.send(userIncomeCollection);
    return;
  }

  try {
    // Get the month index from the month name
    const monthIndex = getMonthIndex(selectedMonth);
    if (monthIndex === -1) {
      throw new Error("Invalid month name provided.");
    }

    // Adjust the month index to match MongoDB's month index (1-based)
    const adjustedMonthIndex = monthIndex + 1;

    // MongoDB aggregation query to filter the income entries
    const result = await IncomesModel.aggregate([
      { $match: { userId } },
      {
        $project: {
          incomeEntries: {
            $filter: {
              input: "$incomeEntries",
              as: "entry",
              cond: {
                $and: [
                  { $eq: [{ $year: "$$entry.date" }, selectedYear] },
                  { $eq: [{ $month: "$$entry.date" }, adjustedMonthIndex] },
                ],
              },
            },
          },
        },
      },
    ]);

    // If you want to return only the incomeEntries array
    if (result.length > 0) {
      const incomeEntries = result[0].incomeEntries; // Extract the incomeEntries
      res.status(200).json({ incomeEntries }); // Send the filtered entries
    } else {
      res.status(404).json({
        message: "No income entries found for the given month and year.",
      });
    }
  } catch (error) {
    console.error("Error filtering income entries:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const incomeStatusWithVat = async (req: Request, res: Response) => {
  const userId = req.body.userId; // ব্যবহারকারীর আইডি নিন
  const incomeEntryId = req.body.productId; // ইনকাম এন্ট্রির আইডি নিন
  const newAmount = req.body.newAmount; // নতুন পরিমাণ নিন
  const newVatStatus = req.body.newVatStatus; // নতুন ভ্যাট স্ট্যাটাস নিন

  try {
    // ব্যবহারকারী ডেটা খুঁজুন
    const findUser = await IncomesModel.findById(userId);

    if (findUser?.incomeEntries) {
      const incomeEntry = findUser.incomeEntries.find(
        (entry) => entry.incomeId === incomeEntryId
      );
      const vat = (incomeEntry?.amount || 100 * 15) / 100;
      const newAmount = (incomeEntry?.amount || 100) - vat;
      console.log(newAmount);

      if (incomeEntry) {
        // You can now access and update the `incomeEntry`
        incomeEntry.amount = newAmount;
        incomeEntry.vat_amount = vat;
        incomeEntry.vat_status = "success";

        await findUser.save();

        return res.send({
          message: "Income entry updated successfully",
          data: incomeEntry,
        });
      } else {
        return res
          .status(404)
          .send({ message: "No income entry found with that ID" });
      }
    } else {
      return res.status(404).send({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
