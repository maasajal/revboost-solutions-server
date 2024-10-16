import express from "express";
import { createExpenseAddress, deleteExpenseAddress, getExpenseAddress } from "../controllers/expense.address.controller";


const router = express.Router();

router.post("/expenseAddress", createExpenseAddress);
router.get("/expenseAddress", getExpenseAddress);
router.delete("/expenseAddress", deleteExpenseAddress);

export default router;