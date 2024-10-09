import express, { Router } from "express";
import { basicPlan, isAdmin, premiumPlan, standardPlan } from "../../controllers/authorizationController/authorization.controller";
import {
    adminMiddleware,
    authMiddleware,
    basicPlanMiddleware,
    premiumPlanMiddleware,
    standardPlanMiddleware,
} from "../../middleware/authMiddleware";
const router: Router = express.Router();

router.route("/admin").get(authMiddleware, adminMiddleware, isAdmin);
router.route("/basic").get(authMiddleware, basicPlanMiddleware, basicPlan);
router.route("/standard").get(authMiddleware, standardPlanMiddleware, standardPlan);
router.route("/premium").get(authMiddleware, premiumPlanMiddleware, premiumPlan);


export default router;
