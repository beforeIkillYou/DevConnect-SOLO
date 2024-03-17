import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Post } from "../models/post.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const createPost = asyncHandler(async(req,res)=>{
    const {title, description} = req.body
    const mediaLocalPath = req.file?.path

    if(!title || !description || !mediaLocalPath){
        throw new ApiError(400, "All fields are required.")
    }
    const media = (await uploadOnCloudinary(mediaLocalPath))

    //creating post
    const post = await Post.create({
        title,
        description,
        media:media.url,
        owner:req.user._id
    })

    //adding post id to the user
    req.user.posts.push(post._id)
    await req.user.save()

    return res
    .status(200)
    .json(
         new ApiResponse(200, post, "Post created successfully")
    )
});

const viewPost = asyncHandler(async(req,res)=>{
    if(!req.param("_id")){
        throw new ApiError(404, "Post not found")
    }

    const post = await Post.findByIdAndUpdate(
        req.param("_id"),
        {
            $inc:{
                views:1
            }
        },{new:true}
    )
    .populate('comments')
    .populate('owner','username avatar')
    if(!post){
        throw new ApiError(404, "Post not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,post , "Post vieewed successfully")
    )
})

const likePost = asyncHandler(async(req,res)=>{
    //check if the user has alread liked the post if yes then remove his like
    const postId = req.param("_id");
    if(!postId){
        throw new ApiError(404, "Post not found")
    }

    //adding or removing the post based on if already liked or not (like in instagram)
    let change = 1;
    if(req.user.likedPosts.includes(postId)){
        req.user.likedPosts.splice(req.user.likedPosts.indexOf(postId),1)
        await req.user.save()
        change = -1 //decrease the likes
    }else{
        req.user.likedPosts.push(postId)
        await req.user.save()
        change = 1 //increase the likes
    }

    //decreasing the posts likes
    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $inc:{
                likes:change
            }
        },{new:true}
    );
    if(!post){
        throw new ApiError(404, "Post not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,post, "Post liked / removed from like successfully")
    )
})

const deletePost = asyncHandler(async (req,res)=>{
    if(!req.param("_id")){
        throw new ApiError(404, "Post not found")
    }

    //deleting the post from the posts created by the user
    req.user.posts.splice(req.user.posts?.indexOf(req.param("_id")),1)
    await req.user.save()

    await Post.findByIdAndDelete(req.param("_id"));

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Post with given id got deleted successfully")
    )
})

export {
    createPost,
    viewPost,
    likePost,
    deletePost
}