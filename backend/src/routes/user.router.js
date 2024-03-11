import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAcessToken,
    changeCurrentPassword,
    getCurrentUser,  
    updateAccountDetails,
    updateUserAvatar,
    updateBio,
    addStory,
    removeStory,
    startFollowing,
    stopFollowing,
    getFollowers,
    getFollowing,
    getFollowersAndFollowingCount,
    getLikedPosts,
    getHomePage
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ] 
    ),
    registerUser
);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single('avatar'), updateUserAvatar)
router.route("/update-bio").patch(verifyJWT, updateBio);

//story and following
router.route("/add-story").post(verifyJWT, upload.single('story'), addStory)
router.route("/remove-story").delete(verifyJWT, removeStory);
router.route("/start-following").post(verifyJWT,startFollowing);
router.route("/stop-following").delete(verifyJWT,stopFollowing);
router.route("/get-followers").get(verifyJWT, getFollowers);
router.route("/get-following").get(verifyJWT, getFollowing);
router.route("/get-followers-and-following-count").get(verifyJWT, getFollowersAndFollowingCount);
router.route("/get-liked-posts").get(verifyJWT, getLikedPosts)

//homepage
router.route("/homepage").get(verifyJWT, getHomePage);
export default router