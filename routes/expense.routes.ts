import express, { Request, Response, Router } from "express";
const router: Router = express.Router();

router.route("/address").post(async(req: Request, res: Response)=>{
    try {
        
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