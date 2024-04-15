import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

//importing and using orutes
import { addComment , likeComment, getComment, getAllCommentsofCurrentUser} from "../controllers/comment.controller.js";  

//secured routes
router.route("/add-comment").post(verifyJWT, addComment);
router.route("/like-comment").post(verifyJWT, likeComment);
router.route("/get-comment").get(verifyJWT, getComment);
router.route("/get-comments-of-current-user").get(verifyJWT, getAllCommentsofCurrentUser); 

export default router