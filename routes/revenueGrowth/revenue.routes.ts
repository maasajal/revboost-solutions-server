import express from "express";
import { revenueGrowth } from "../../controllers/revenueGrowth/revenue.controller";
import {
  addOrUpdateRevenue,
  calculateHalfYearRevenue,
  calculateMonthlyRevenue,
  calculateQuarterlyRevenue,
  calculateTotalRevenueGrowth,
  calculateYearlyRevenue,
  getRevenueData,
} from "../../controllers/revenueGrowth/revenueController";

const router = express.Router();

router.get("/revenue/:userId", getRevenueData);
router.get("/revenue-growth/:id", revenueGrowth);
router.post("/revenue-growth", revenueGrowth);
router.post("/add-update-revenue", addOrUpdateRevenue);
router.get("/monthly-revenue/:id", calculateMonthlyRevenue);
router.get("/quarterly-revenue/:id", calculateQuarterlyRevenue);
router.get("/half-year-revenue/:id", calculateHalfYearRevenue);
router.get("/yearly-revenue/:id", calculateYearlyRevenue);
router.get("/total-revenue/:id", calculateTotalRevenueGrowth);

export default router;
