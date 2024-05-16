package com.DevConnect.devconnect.Controllers;

import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.DevConnect.devconnect.Models.PostModel;
import com.DevConnect.devconnect.Services.PostService;
import com.DevConnect.devconnect.Utils.APIReturnModel;
import com.DevConnect.devconnect.Utils.PostDTO;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@CrossOrigin(origins = "*")
@RestController
@RequestMapping("posts")
public class PostController {
    @Autowired
    private PostService postService;

    private APIReturnModel apiReturnModel;
    private Vector<PostModel> postVec;


    @PostMapping("/create-post")
    public ResponseEntity<APIReturnModel> createPost(@RequestBody PostDTO post) {
        // System.err.println(post.getMedia());
        apiReturnModel = new APIReturnModel();
        postVec = new Vector<PostModel>();

        try{
            PostModel newpost = postService.createPost(post);
            postVec.add(newpost);

            apiReturnModel.setStatus("Success");
            apiReturnModel.setMessage("Post Created");
            apiReturnModel.setData(postVec);
            apiReturnModel.setCount(postVec.size());
        }catch(Exception e){
            apiReturnModel.setStatus("Fail");
            apiReturnModel.setMessage("Send the correct Post Data");
            apiReturnModel.setCount(0);
        }

        return ResponseEntity.ok(apiReturnModel);
    }

    @DeleteMapping("/delete-post/{postId}")
    public String deletePost(@PathVariable("postId") Long postId){
        return postService.deletePost(postId);
    }

    @PostMapping("/like-post/{postId}")
    public String likePost(@PathVariable("postId") Long postId){
        return postService.likePost(postId);
    }
    
    @GetMapping("/view-post/{postId}")
    public PostModel getPostModel(@PathVariable("postId") Long postId){
        // increasing value of views in the post
        PostModel post = postService.getPostById(postId);
        post.setViews(post.getViews() + 1);
        return postService.getPostById(postId);
    }

    @GetMapping("/get-all-posts")
    public Iterable<PostModel> getAllPosts(){
        return postService.getAllPosts();
    }
    
    @GetMapping("/get-posts-of-user/{userId}")
    public Iterable<PostModel> getPostsOfUser(@PathVariable("userId") Long userId){
        return postService.getPostsOfUser(userId);
    }

}   
