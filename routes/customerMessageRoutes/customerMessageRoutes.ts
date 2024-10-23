import express, { Router } from "express";
import {
    createMessage,
    getAllMessage,
    getSinglePersonMessage,
    updateReadStatus,
} from "../../controllers/customerMessageController/customerMessageController";
import {
    adminMiddleware,
    authMiddleware,
} from "../../middleware/authMiddleware";
const router: Router = express.Router();

router.get("/messages", authMiddleware, adminMiddleware, getAllMessage);

router.post("/messages", createMessage);

router.get(
  "/messages/:id",
  authMiddleware,
  adminMiddleware,
  getSinglePersonMessage
);
router.patch(
  "/messages/read-status",
  authMiddleware,
  adminMiddleware,
  updateReadStatus
);

export default router;
