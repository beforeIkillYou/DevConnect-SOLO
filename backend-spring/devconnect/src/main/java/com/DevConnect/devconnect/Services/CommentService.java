package com.DevConnect.devconnect.Services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DevConnect.devconnect.Models.CommentModel;
import com.DevConnect.devconnect.Models.PostModel;
import com.DevConnect.devconnect.Models.UserModel;
import com.DevConnect.devconnect.Repositories.CommentRepository;
import com.DevConnect.devconnect.Repositories.PostRepository;
import com.DevConnect.devconnect.Repositories.UserRepository;
import com.DevConnect.devconnect.Utils.CommentDTO;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;
    
    public CommentModel getCommentById(Long id) {
        return commentRepository.findById(id).get();
    }

    public CommentModel addCommentFromCommentDTO(CommentDTO commentDTO) {
        UserModel user = userRepository.findById(commentDTO.getUserId()).get();
        PostModel post = postRepository.findById(commentDTO.getPostId()).get();
        System.out.println(user.getName());
        System.out.println(post.getTitle());
        CommentModel comment = new CommentModel(commentDTO.getText(), user, post);
        comment.setText(commentDTO.getText());
        comment.setOwner(user);
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    public String deleteComment(Long commentId) {

        // commentRepository.deleteById(commentId);
        
        try{
            commentRepository.deleteById(commentId);
            return "Comment deleted successfully";
        }catch(Exception e){
            e.printStackTrace();
            return "Error deleting comment";
        }
    }

    public Iterable<CommentModel> getCommentOfUser(Long userId) {
        return commentRepository.findByOwnerId(userId);
    }
}
