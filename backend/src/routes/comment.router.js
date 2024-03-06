import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

//importing and using orutes
import { addComment , likeComment} from "../controllers/comment.controller.js";  

//secured routes
router.route("/add-comment").post(verifyJWT, addComment);
router.route("/like-comment").post(verifyJWT, likeComment);

export default router