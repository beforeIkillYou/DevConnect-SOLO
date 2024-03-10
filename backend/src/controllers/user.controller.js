import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import {DEFAULT_PFP} from "../constants.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Post } from "../models/post.model.js"

const generateAccessAndRefreshToken = async(userId) =>
{
    try{
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken, refreshToken}
    }catch(err){
        throw new ApiError(500, "Server Error");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //taking the details from reuest bodyu
    const {fullname, email, username, password, bio} = req.body;
    if([fullname, email, username, password, bio].some((x)=>x?.trim()==="")){
        throw new ApiError(400, "All fields are required.")
    }

    //checking if the user already exists
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    }) 
    if(existedUser){
        throw new ApiError(409, "Username or email already exists.")
    }

    //alloting the avatar path given by the user and if not then the default path
    // console.log(req.files?.avatar[0].path)
    const avatarLocalPath = req.files?.avatar[0].path;
    const avatar = (!avatarLocalPath)?DEFAULT_PFP : (await uploadOnCloudinary(avatarLocalPath));
    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar.")
    }
    
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar:avatar.url,
        bio
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Internal server error")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(createdUser._id);
    const options = {
        httpOnly : true,
        secure : true
    }

    //added access and refresh tokens with registration too
    return res
    .status(201)
    .cookie("accessToken",accessToken,options) 
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(201, createdUser,"User registered successfully")
    )
});


const loginUser = asyncHandler(async (req, res) => {
    //req->body se data
    // username or email access
    //find the user
    //access and refresh token
    //send cookies

    const {email, username, password} = req.body;

    if(!username && !email){
        throw new ApiError(400, "Either username or email are required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials")
    }


    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        },"USER logged in successfully!")
    )
});

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {},"User logged out successfully!"))
})

const refreshAcessToken = asyncHandler(async(req,res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request!")
    }
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",newrefreshToken, options)
        .json(
            new ApiResponse(200, {
                user: user,
                accessToken,
                refreshToken:newrefreshToken
            },"USER logged in successfully!")
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "INvalid toke");
    }
});

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldpassword,newpassword} = req.body;

    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)

    if(!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials")
    }else{
        user.password = newpassword;
        await user.save({validateBeforeSave: false})

        return res
        .status(200)
        .json(new ApiResponse(200,{},"Password updated successfully"))
    }
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200, req.user,"current user fetched succesfully"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullname, email} = req.body
    
    if(!fullname || !email) {
     throw new ApiError(400, "All fields are required")
    }
    
    const user = await User.findByIdAndUpdate(
     req.user._id,
     {
         $set:{
             fullname,
             email
         }
     },
     {new: true}
    ).select("-password")
 
    return res
    .status(200)
    .json(new ApiResponse(200,user, "AccountDetails updated succesfully"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatr file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Avatar updated succesfully")
    )
})

const updateBio = asyncHandler(async(req,res)=>{
    const {bio} = req.body
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                bio
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Bio updated succesfully")
    )
})

const addStory = asyncHandler(async(req,res)=>{
    const storylocalpath = req.file?.path
    // console.log(req.file)
    if(!storylocalpath){
        throw new ApiError(400, "Story file is missing")
    }

    const story = await uploadOnCloudinary(storylocalpath)
    if(!story.url){
        throw new ApiError(400, "Story upload failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                story: story.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Story added succesfully")
    )
})

const removeStory = asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                story: undefined
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Story removed succesfully")
    )
})


const startFollowing = asyncHandler(async(req,res)=>{
    const userWhichIsFollowed = await User.findOne({username: req.param('username')})
    // console.log(userWhichIsFollowed);
    if(!userWhichIsFollowed){
        throw new ApiError(404, "User not found")
    }

    if(userWhichIsFollowed._id.toString() === req.user._id.toString()){
        throw new ApiError(400, "You cannot follow yourself")
    }

    await User.findByIdAndUpdate(
        userWhichIsFollowed._id,
        {
            $set:{
                followers: [...userWhichIsFollowed.followers, req.user._id]
            }
        },
        {new: true}
    );

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                following: [...req.user.following, userWhichIsFollowed._id]
            }
        },{new:true}
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Following started succesfully")
    )
})

const stopFollowing = asyncHandler(async(req,res)=>{
    const userWhichIsUnfollowed = await User.findOne({username: req.param('username')})
    // console.log(userWhichIsFollowed);
    if(!userWhichIsUnfollowed){
        throw new ApiError(404, "User not found")
    }

    if(userWhichIsUnfollowed._id.toString() === req.user._id.toString()){
        throw new ApiError(400, "You cannot unfollow yourself")
    }

    await User.findByIdAndUpdate(
        userWhichIsUnfollowed._id,
        {
            $set:{
                followers: userWhichIsUnfollowed.followers.filter(id => id.toString()!== req.user._id.toString())
            }
        },
        {new: true}
    );

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                following: req.user.following.filter(id => id.toString()!== userWhichIsUnfollowed._id.toString())
            }
        },{new:true}
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "Unfollowed the current user succesfully")
    )
})

const getFollowersAndFollowingCount = asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            followersCount: req.user.followers.length,
            followingCount: req.user.following.length
        }, "Followers and following count fetched succesfully")
    )
})

const getFollowers = asyncHandler(async (req,res)=>{
    const followers = await User.find({ _id : {$in: req.user.followers}})

    return res
    .status(200)
    .json(
        new ApiResponse(200,followers, "Followers fetched succesfully")
    )
})

const getFollowing = asyncHandler(async (req,res)=>{
    const following = await User.find({ _id : {$in: req.user.following}})

    return res
    .status(200)
    .json(
        new ApiResponse(200,following, "Following(users followed by the follower) fetched succesfully")
    )
})

const getLikedPosts = asyncHandler(async (req,res)=>{
    const likedPosts = await Post.find({_id : {$in: req.user.likedPosts}})

    return res
    .status(200)
    .json(
        new ApiResponse(200,likedPosts, "Liked posts fetched succesfully")
    )
})

export {
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
    getLikedPosts
}