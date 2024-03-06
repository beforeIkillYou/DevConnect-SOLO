import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import {DEFAULT_PFP} from "../constants.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

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
    const {fullname, email, username, password} = req.body;
    if([fullname, email, username, password].some((x)=>x?.trim()==="")){
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
        avatar:avatar.url
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Internal server error")
    }

    return res.status(201).json(
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
        .cookie("acessToken",accessToken, options)
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


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcessToken
}