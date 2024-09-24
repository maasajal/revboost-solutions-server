import express, { Request, Response, Router } from "express";
import { generateToken } from "../jwt/jwt";
import { RegisterModel } from "../models/register.models";
const router: Router = express.Router();

router.route("/register").post(async (req: Request, res: Response) => {
  try {
    const { name, photo, email, password } = req.body;
    const data = req.body;
    const existingUser = await RegisterModel.findOne({ email });
    // check user already exist or not
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `this email:${email} already exist` });
    }

    const result = await RegisterModel.create(data);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("Error saving data t");
  }
});

router.route("/login").post(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; 
    const result = await RegisterModel.findOne({ email }); 
    if (result?.email == email && result?.password === password) {
      //check user validation
      const token = generateToken(email); // create token
      res.status(200).send({ message: token }); // send token
    } else {
      res.status(403).json({ message: "is not valid user Forbidden  access " });
    }
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
});

export default router;
