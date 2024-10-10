import express from "express";
import { revenueGrowth } from "../../controllers/revenueGrowth/revenue.controller";

const router = express.Router();

router.get("/revenue-growth/:id", revenueGrowth);
router.post("/revenue-growth", revenueGrowth);

export default router;
