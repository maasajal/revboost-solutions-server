import { Request, Response } from "express";
import { UserModel } from "../../models/auth.model";
export const isAdmin = async (req: Request, res: Response) => {
  try {
    const email = req?.email; 
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.send({ message: "messing" });
    } else if (user.role === "user") {
      res.send({ message: "success" });
    }
  } catch (error) {
    //   res.status(500).send(error);
  }
};
