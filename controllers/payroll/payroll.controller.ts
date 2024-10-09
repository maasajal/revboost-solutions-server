import { Request, Response } from "express";
const mongoose = require("mongoose");
const payrollSchema = require("../../models/payroll.model");

const Payroll = new mongoose.model("Payroll", payrollSchema);

export const addPayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newPayroll = new Payroll(req.body);
    await newPayroll.save();
    res.status(200).json({
      message: "Payroll was inserted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      message: "There is a server side error!",
    });
  }
};
