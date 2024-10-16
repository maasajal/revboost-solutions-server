import express from "express";
import { revenueGrowth } from "../../controllers/revenueGrowth/revenue.controller";
import { addOrUpdateRevenue, getRevenueData } from "../../controllers/revenueGrowth/revenueController";

const router = express.Router();

router.get("/revenue/:userId", getRevenueData);
router.get("/revenue-growth/:id", revenueGrowth);
router.post("/revenue-growth", revenueGrowth);
router.post("/add-update-revenue", addOrUpdateRevenue);

export default router;
