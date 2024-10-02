import express,{Request, Response, Router} from "express"
import { SubscriptionDataSchemaModel } from "../models/subscription.model"

const router : Router = express.Router()
router.route("/subcriptiondata").post(async(req : Request, res : Response)=>{
    console.log(req.body)
    // res.send(req.body)
  try {
    const result =await SubscriptionDataSchemaModel.create(req.body)
    res.send(result)
  } catch (error) {
    console.log(error)
  }
})

export default router;