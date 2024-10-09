import express from "express";
import { addPayroll } from "../../controllers/payroll/payroll.controller";
import { getPayroll } from "../../controllers/payroll/payroll.controller";

const router = express.Router();

router.get("/", getPayroll);
router.post("/", addPayroll);

export default router;
