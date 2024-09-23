import express, { Request, Response, Router } from "express";
import { RegisterModel } from "../models/register.models";
const router: Router = express.Router();

router.route("/register").post(async (req: Request, res: Response) => {
  try {
    const { name, photo, email, password } = req.body;
    const result = await RegisterModel.create({ name, photo, email, password });
    console.log(result)
    res.status(201).send(result);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
});

router.route("/register").get(async (req: Request, res: Response) => {
  try { 
    const result = await RegisterModel.find({});
    console.log(result)
    res.status(200).send(result);
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
});

export default router;
