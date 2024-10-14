import express from "express";
import { createExpense, deleteExpense, getAllExpense, getIndividualExpense, updateExpense } from "../controllers/expense.controller";

const router = express.Router();

router.post("/create", createExpense);
router.get("/create", getAllExpense);
router.put("/update/:id", updateExpense);
router.get("/create/:id", getIndividualExpense);
router.delete("/create/:id", deleteExpense);

export default router;