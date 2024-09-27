import express, { Request, Response, Router } from "express"
const router: Router = express.Router();

import { RegisterModel } from "../models/register.models";
import { authMiddleware } from "../middleware/authMiddleware";

router
  .route("/privet-rout")
  .post(authMiddleware, async (req: Request, res: Response) => {
    try {
      const email = req.email;
      const user = await RegisterModel.findOne({ email });
      if (user && user.role === "user") {
        res.status(200).send({ message: "success" });
      }
    } catch (error) {
      res.status(500).send("Error saving data");
    }
  });

export default router;
