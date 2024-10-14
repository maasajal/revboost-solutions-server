import express from "express";
import { createExpense, deleteExpense, deleteIndividualExpense, getAllExpense, getIndividualExpense, updateExpense } from "../controllers/expense.controller";

const router = express.Router();

router.post("/create", createExpense);
router.get("/create", getAllExpense);
router.put("/update/:id", updateExpense);
router.get("/create/:id", getIndividualExpense);
router.delete("/create/:id", deleteIndividualExpense);
router.delete("/create", deleteExpense);

export default router;