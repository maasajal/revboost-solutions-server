import express, { Request, Response, Router } from "express";
import { generateToken } from "../jwt/jwt";
import { RegisterModel } from "../models/register.models";
const router: Router = express.Router();

router.route("/register").post(async (req: Request, res: Response) => {
  try {
    const data = req.body;
    await RegisterModel.create(data);
    const token = generateToken(data?.email);
    res.status(200).send({ message: token });
  } catch (error) {
    res.status(500).send("Error saving data t");
  }
});

router.route("/login").post(async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { email } = data;
    const isExist = await RegisterModel.findOne({ email });
    console.log(isExist);
    if (isExist === null) {
      const result = await RegisterModel.create(data);
      const token = generateToken(email); // create token
      res.status(200).send({ message: token });
    } else {
      const token = generateToken(email); // create token
      res.status(200).send({ message: token }); // send token
    }
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
});

export default router;
