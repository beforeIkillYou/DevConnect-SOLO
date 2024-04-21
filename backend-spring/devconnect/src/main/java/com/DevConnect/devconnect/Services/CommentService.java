package com.DevConnect.devconnect.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.DevConnect.devconnect.Models.CommentModel;
import com.DevConnect.devconnect.Repositories.CommentRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    
    public CommentModel getCommentById(Long id) {
        return commentRepository.findById(id).get();
    }

    public CommentModel addComment(CommentModel comment) {
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
}
