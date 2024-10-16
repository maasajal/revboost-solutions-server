import express from "express";
import {
  addOrUpdateExpense,
  deleteExpense,
  getExpenses,
} from "../../controllers/expensesController/expenseController";

const router = express.Router();

router.get("/:userId", getExpenses);
router.post("/add-update-expense", addOrUpdateExpense);
router.delete("/:userId/:expenseId", deleteExpense);

export default router;
