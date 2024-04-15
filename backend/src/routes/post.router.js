import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router()


//importing the routes
import {
    createPost,
    viewPost,
    likePost,
    deletePost,
    getAllPosts
} from "../controllers/post.controller.js"

//all are secured posts
router.route("/create-post").post(verifyJWT, upload.single('media'), createPost);
router.route("/view-post").post(verifyJWT, viewPost);
router.route("/like-post").post(verifyJWT,  likePost);
router.route("/delete-post").delete(verifyJWT, deletePost);
router.route("/get-all-posts").get(verifyJWT, getAllPosts)

export default router