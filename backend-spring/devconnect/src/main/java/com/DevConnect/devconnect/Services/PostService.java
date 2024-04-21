package com.DevConnect.devconnect.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DevConnect.devconnect.Models.PostModel;
import com.DevConnect.devconnect.Repositories.PostRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;
    
    public PostModel createPost(PostModel model){
        return postRepository.save(model);
    } 

    public Iterable<PostModel> getAllPosts(){
        return postRepository.findAll();
    }

    public PostModel getPostById(long id){
        try{
            return postRepository.findById(id).get();
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public String deletePost(long postId){
        try{
            PostModel post = postRepository.findById(postId).get();
            if(post == null){
                return "Post not found";
            }

            postRepository.deleteById(postId);
            return "Post deleted";
        }catch(Exception e){
            e.printStackTrace();
            return "Post not deleted";
        }
    }

    public String likePost(long postId){
        try{
            PostModel post = postRepository.findById(postId).get();
            if(post == null){
                return "Post not found";
            }
            post.setLikes(post.getLikes() + 1);
            postRepository.save(post);
            return "Post liked";
        }catch(Exception e){
             e.printStackTrace();
            return "Post not liked";
        }
    }

}
