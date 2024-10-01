import express from "express";
import { createExpenseAddress } from "../controllers/expense.address.controller";


const router = express.Router();

router.post("/expenseAddress", createExpenseAddress);

export default router;