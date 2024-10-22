import express, { Router } from "express";
import {
    createMessage,
    getAllMessage,
    getSinglePersonMessage,
    updateReadStatus,
} from "../../controllers/customerMessageController/customerMessageController";
// import {
//     adminMiddleware,
//     authMiddleware,
// } from "../../middleware/authMiddleware";
const router: Router = express.Router();

router.route("/messages").get(getAllMessage);
router.route("/messages/:id").get(getSinglePersonMessage); 
router.patch('/messages/read-status', updateReadStatus);
router.route("/messages").post(createMessage);

export default router;
