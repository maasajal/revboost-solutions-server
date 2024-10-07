import express, { Router } from "express";
import {
  registerUser,
  getUsers,
  updateUserByEmail,
  getUserByEmail,
} from "../../controllers/authorizationController/auth.controller";
// import { AdminMiddleware } from "../../middleware/adminMiddleware";

const router: Router = express.Router();

router.post("/register", registerUser);
router.get("/users", getUsers); // all user get by admin
router.get("/user/:email", getUserByEmail);
router.patch("/user/:email", updateUserByEmail);

export default router;
