import express from "express";
import {
  addPayroll,
  getPayroll,
  deletePayroll,
  updatePayroll,
} from "../../controllers/payroll/payroll.controller";

const router = express.Router();

router.get("/", getPayroll);
router.post("/", addPayroll);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

export default router;
