package com.DevConnect.devconnect.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DevConnect.devconnect.Models.PostModel;
import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Repositories.PostRepository;
import com.DevConnect.devconnect.Repositories.UserRepository;
import com.DevConnect.devconnect.Utils.PostDTO;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    
    public PostModel createPost(PostDTO postDTO){
        UserModel user = userRepository.findById(postDTO.getOwnerId()).get();
        
        PostModel newPost = new PostModel();
        newPost.setOwner(user);
        newPost.setMedia(postDTO.getMedia());
        newPost.setDescription(postDTO.getDescription());
        newPost.setTitle(postDTO.getTitle());

        return postRepository.save(newPost);
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

    public Iterable<PostModel> getPostsOfUser(Long userId){
        try{
            return postRepository.findByOwnerId(userId);
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
