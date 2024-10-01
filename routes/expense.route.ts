import express from "express";
import { createExpense, updateExpense } from "../controllers/expense.controller";

const router = express.Router();

router.post("/create", createExpense);
router.put("/update/:id", updateExpense);

export default router;