import express from "express";
import { address } from "../controllers/expense.controller";

const router = express.Router();

router.post("/address",address);

export default router;