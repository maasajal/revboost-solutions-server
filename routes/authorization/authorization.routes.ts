import express, { Router } from "express";
import { isAdmin } from "../../controllers/authorizationController/authorization.controller";
import {
    adminMiddleware,
    authMiddleware,
} from "../../middleware/authMiddleware";
const router: Router = express.Router();

router.route("/admin").get(authMiddleware, adminMiddleware, isAdmin);
export default router;
