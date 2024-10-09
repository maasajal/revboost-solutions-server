import { Request, Response } from "express";
export const isAdmin = async (req: Request, res: Response) => {
  try {
    res.send({ message: "admin" });
  } catch (error) {
    res.status(500).send(error);
  }
};
export const basicPlan = async (req: Request, res: Response) => {
  try {
    res.send({ message: "admin", plan: "basic" });
  } catch (error) {
    res.status(500).send(error);
  }
};
export const standardPlan = async (req: Request, res: Response) => {
  try {
    res.send({ message: "admin", plan: "standard" });
  } catch (error) {
    res.status(500).send(error);
  }
};
export const premiumPlan = async (req: Request, res: Response) => {
  try {
    res.send({ message: "admin", plan: "premium" });
  } catch (error) {
    res.status(500).send(error);
  }
};
