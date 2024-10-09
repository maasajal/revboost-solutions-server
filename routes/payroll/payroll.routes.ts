import express from "express";
import { addPayroll } from "../../controllers/payroll/payroll.controller";

const router = express.Router();

router.post("/", addPayroll);

export default router;
