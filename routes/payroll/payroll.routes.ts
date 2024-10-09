import express from "express";
import {
  addPayroll,
  getPayroll,
  deletePayroll,
} from "../../controllers/payroll/payroll.controller";

const router = express.Router();

router.get("/", getPayroll);
router.post("/", addPayroll);
router.delete("/:id", deletePayroll);

export default router;
