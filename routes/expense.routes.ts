import express, { Request, Response, Router } from "express";
import { ExpenseModel } from "../models/expense.model";
const router: Router = express.Router();

router.route("/address").post(async(req: Request, res: Response)=>{
    try {
        const {companyName,create,no,item,quantity,unitPrice} = req.body;
        const data = req.body;
        const result = await ExpenseModel.create(data);
        res.status(201).send(result);

    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in getUserProfile: ", error.message);
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});

export default router;