import { Request, Response } from "express";
const mongoose = require("mongoose");
const payrollSchema = require("../../models/payroll.model");

const Payroll = new mongoose.model("Payroll", payrollSchema); // collection

// get all payroll document
export const getPayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allPayroll = await Payroll.find();
    res.status(200).json(allPayroll);
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error to GET all payroll data!",
    });
  }
};

// post a payroll document
export const addPayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newPayroll = new Payroll(req.body);
    await newPayroll.save();
    res.status(200).json({
      message: "Payroll was inserted successfully!",
      payroll: newPayroll,
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error to POST a payroll data!",
    });
  }
};

// delete a payroll document
export const deletePayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payrollId = req.params.id;
    const deletedPayroll = await Payroll.findByIdAndDelete(payrollId);

    res.status(200).json({
      message: "Employee deleted successfully",
      deletedPayroll,
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error to DELETE a payroll data!",
    });
  }
};
