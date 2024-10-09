const mongoose = require("mongoose");

const MONTHS = [
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

const payrollSchema = mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
    min: 0,
  },
  bonus: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  taxDeduction: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  month: {
    type: String,
    enum: MONTHS,
    default: () => {
      const currentMonthIndex = new Date().getMonth();
      return MONTHS[currentMonthIndex];
    },
  },
});

module.exports = payrollSchema;
