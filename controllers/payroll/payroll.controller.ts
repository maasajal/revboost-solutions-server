import { Request, Response } from "express";
import { PayrollModel } from "../../models/payroll.model";

// Get all payroll documents
export const getPayroll = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    const userPayrollCollection = await PayrollModel.findOne({ userId });

    // Check if userPayrollCollection is null
    if (!userPayrollCollection) {
      return res.status(404).json({
        message: "Payroll data not found for the specified user.",
      });
    }

    // If userPayrollCollection exists, return the payroll entries
    res.status(200).json(userPayrollCollection.payrollEntries);
  } catch (err) {
    res.status(500).json({
      message: "There is a server-side error while getting all payroll data!",
    });
  }
};

// Add a payroll document
export const addPayroll = async (req: Request, res: Response) => {
  const { userId, userEmail, payrollEntries } = req.body;

  if (
    !userId ||
    !userEmail ||
    !payrollEntries ||
    !Array.isArray(payrollEntries)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid data. Please provide all required fields." });
  }

  try {
    const existingPayrollCollection = await PayrollModel.findOne({
      userId,
      userEmail,
    });

    if (existingPayrollCollection) {
      const updatedPayrollCollection = await PayrollModel.findOneAndUpdate(
        { userId }, // Find the payroll collection by userId
        { $push: { payrollEntries: { $each: payrollEntries } } }, // Use $push to add new entries to the array
        { new: true } // Return the updated document
      );

      if (!updatedPayrollCollection) {
        return res
          .status(404)
          .send({ message: "payroll collection not found." });
      }
      return res.status(200).send({
        message: "payroll entry added to existing collection",
        payrollCollection: updatedPayrollCollection,
      });
    } else {
      const newPayrollCollection = new PayrollModel({
        userId,
        userEmail,
        payrollEntries,
      });
      const savedPayrollCollection = await newPayrollCollection.save();

      res.status(201).send({
        message: "New payroll collection created",
        payrollCollection: savedPayrollCollection,
      });
    }
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.error(err);
    res.status(500).json({
      message: "There was a server-side error while adding payroll data!",
      error: errorMessage, // Send the error message in the response
    });
  }
};

// Update a payroll document
export const updatePayroll = async (req: Request, res: Response) => {
  try {
    const { userId, payrollId } = req.params; // Get the userId and payrollId from the request parameters
    const payrollData = req.body; // an object

    const updatedPayrollCollection = await PayrollModel.findOneAndUpdate(
      { userId, "payrollEntries._id": payrollId }, // Match the document by userId and specific payroll entry _id
      {
        $set: {
          "payrollEntries.$.employeeName": payrollData.employeeName,
          "payrollEntries.$.position": payrollData.position,
          "payrollEntries.$.salary": payrollData.salary,
          "payrollEntries.$.bonus": payrollData.bonus,
          "payrollEntries.$.taxDeduction": payrollData.taxDeduction,
          "payrollEntries.$.month": payrollData.month,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedPayrollCollection) {
      return res.status(404).json({
        message:
          "Payroll data not found for the specified user or payroll entry.",
      });
    }

    res.status(200).json({
      message: "Payroll entry updated successfully",
      updatedPayrollCollection,
    });
  } catch (err) {
    console.error("Error updating payroll entry: ", err);
    res.status(500).json({
      message:
        "There was a server-side error while updating the payroll entry.",
    });
  }
};

// Delete a payroll document
export const deletePayroll = async (req: Request, res: Response) => {
  try {
    const { userId, payrollId } = req.params; // Get the userId and payrollId from the request parameters

    // Find the income collection and remove the specific income entry
    const updatedPayrollCollection = await PayrollModel.findOneAndUpdate(
      { userId }, // Find by userId
      { $pull: { payrollEntries: { _id: payrollId } } }, // Use $pull to remove the income entry with the given payrollId
      { new: true } // Return the updated document
    );

    if (!updatedPayrollCollection) {
      return res.status(404).send({
        message: "Income collection not found or payrollId doesn't exist.",
      });
    }

    // Return the updated payrollEntries array
    res.status(200).send(updatedPayrollCollection.payrollEntries);
  } catch (error) {
    console.error("Error deleting income entry: ", error);
    res
      .status(500)
      .send({ message: "Server error. Could not delete income entry." });
  }
};
