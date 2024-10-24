import express from "express";
import {
  addOrUpdateIncome,
  deleteIncome,
  filterIncomeEntriesByDate,
  getIncomes,
  getTaxStatus,
  incomeStatusWithVat,
} from "../../controllers/incomeController/incomeController";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/:userId", getIncomes);
router.post("/filter", filterIncomeEntriesByDate);
router.post("/add-update-income", addOrUpdateIncome);
router.delete("/delete", deleteIncome);
router.post("/vat-status" ,incomeStatusWithVat);
router.post("/tax-status", authMiddleware ,getTaxStatus);

export default router;
