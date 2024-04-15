import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Comment } from "../models/comment.model.js"
import { Post } from "../models/post.model.js"  
import { User } from "../models/user.model.js"

import {ApiResponse} from "../utils/ApiResponse.js"


const addComment = asyncHandler(async (req,res) => {
    //taking the details from reuest bodyu

    const postId = req.param("_id")

    const {text} = req.body;
    if(text?.trim()===""){
        throw new ApiError(400, "All fields are required.")
    }

    const comment = await Comment.create(
        {
            text,
            owner: req.user._id,
            post: postId
        }
    )
    if(!comment){
        throw new ApiError(500, "Failed to add comment.")
    }
    //adding comment to the user
    req.user.comments?.push(comment._id)
    await req.user.save()

    const post = await Post.findByIdAndUpdate(
        postId,
        {$push: {comments: comment._id}},
        {new: true}
    )

    return res.status(201).json(
        new ApiResponse(201, {
            comment,
            post
        }, "Comment added successfully")
    )
})


const likeComment = asyncHandler(async (req, res) => {
    const commentId = req.param("_id")

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }

    if(comment.likes.includes(req.user._id)){
        comment.likes?.splice(comment.likes.indexOf(req.user._id), 1)
        await comment.save()
    }else{
        comment.likes?.push(req.user._id)
        await comment.save()
    }

    return res.status(200).json(
        new ApiResponse(200, {
            comment
        }, "Comment liked successfully")
    )
});

const getComment = asyncHandler(async(req, res) => {
    const commentId = req.param("_id")
    const comment = await Comment.findById(commentId)
    .populate({
        path:"post",
        select: "media"
    }
    )
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    return res.status(200).json(
        new ApiResponse(200, {
            comment
        }, "Comment fetched successfully")
    )
})

const getAllCommentsofCurrentUser = asyncHandler(async(req, res) => {
    const comments = await Comment.find({owner: req.user._id})
    .populate({
        path:"post",
        select: "media"
    }
    )
    if(!comments){
        throw new ApiError(404, "Comments not found")
    }
    return res.status(200).json(
        new ApiResponse(200, {
            comments
        }, "Comments fetched successfully")
    )
})

export{
    addComment,
    likeComment,
    getComment,
    getAllCommentsofCurrentUser
}