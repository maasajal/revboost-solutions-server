import { Request, Response } from "express";
export const isAdmin = async (req: Request, res: Response) => {
    try {
     res.send({message:"success"})
    } catch (error) {
    //   res.status(500).send(error);
    }
  };
  