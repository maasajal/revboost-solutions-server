import { Request, Response } from "express-serve-static-core"

export const theMember=async(req:Request, res:Response)=>{
    const email = req.email;
    console.log(email)
}
