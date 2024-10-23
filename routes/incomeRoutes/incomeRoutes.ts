import express from "express";
import {
  addOrUpdateIncome,
  deleteIncome,
  filterIncomeEntriesByDate,
  getIncomes,
  incomeStatusWithVat,
} from "../../controllers/incomeController/incomeController";

const router = express.Router();

router.get("/:userId", getIncomes);
router.post("/filter", filterIncomeEntriesByDate);
router.post("/add-update-income", addOrUpdateIncome);
router.delete("/delete", deleteIncome);
router.post("/vat-status", incomeStatusWithVat);

export default router;
