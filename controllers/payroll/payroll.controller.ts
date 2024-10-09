import { Request, Response } from "express";
const mongoose = require("mongoose");
const payrollSchema = require("../../models/payroll.model");

const Payroll = new mongoose.model("Payroll", payrollSchema);

export const getPayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allPayroll = await Payroll.find();
    res.status(200).json(allPayroll);
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error to get all payroll data!",
    });
  }
};

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
      message: "There is a server side error to post a payroll data!",
    });
  }
};
