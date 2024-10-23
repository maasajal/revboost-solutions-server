import express from "express";
import {
  addOrUpdateIncome,
  deleteIncome,
  filterIncomeEntriesByDate,
  getIncomes,
} from "../../controllers/incomeController/incomeController";

const router = express.Router();

router.get("/:userId", getIncomes);
router.post("/filter", filterIncomeEntriesByDate);
router.post("/add-update-income", addOrUpdateIncome);
router.delete("/delete", deleteIncome);

export default router;
