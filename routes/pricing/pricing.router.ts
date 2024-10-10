import express, { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { theMember } from "../../controllers/pricing/pricing.controller";

const router: Router = express.Router();

router.patch('/user/membership', authMiddleware, theMember )
export default router;