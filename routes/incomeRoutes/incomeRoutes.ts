import express from "express";
import {
  addOrUpdateIncome,
  deleteIncome,
  getIncomes,
} from "../../controllers/incomeController/incomeController";

const router = express.Router();

router.get("/:userId", getIncomes);
router.post("/add-update-income", addOrUpdateIncome);
router.delete("/:userId/:incomeId", deleteIncome);

export default router;
