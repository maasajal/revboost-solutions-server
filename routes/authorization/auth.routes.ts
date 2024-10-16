import express, { Router } from "express";
import {
  deleteUserById,
  getUserByEmail,
  getUsers,
  registerUser,
  updateUserByEmail,
} from "../../controllers/authorizationController/auth.controller";
// import { AdminMiddleware } from "../../middleware/adminMiddleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.get("/users", getUsers); // all user get by admin 
router.get("/user/:email", getUserByEmail);
router.patch("/user/:email", updateUserByEmail);
router.delete("/user/:id", deleteUserById);

export default router;
