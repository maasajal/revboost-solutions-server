import express, { Router } from "express";
import {
  deleteUserById,
  getUserByEmail,
  getUsers,
  registerUser,
  updateUserByEmail,
} from "../../controllers/authorizationController/auth.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.get("/users", authMiddleware, getUsers); // all user get by admin
router.get("/user/:email", getUserByEmail);
router.patch("/user/:email", authMiddleware, updateUserByEmail);
router.delete("/user/:id", authMiddleware, deleteUserById);

export default router;
