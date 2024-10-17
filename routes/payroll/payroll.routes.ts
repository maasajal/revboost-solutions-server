import express from "express";
import {
  addPayroll,
  getPayroll,
  deletePayroll,
  updatePayroll,
} from "../../controllers/payroll/payroll.controller";

const router = express.Router();

router.get("/:userId", getPayroll);
router.post("/", addPayroll);
router.put("/:userId/:payrollId", updatePayroll);
router.delete("/:userId/:payrollId", deletePayroll);

export default router;
