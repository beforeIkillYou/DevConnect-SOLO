package com.DevConnect.devconnect.Controllers;

import org.springframework.web.bind.annotation.RestController;

import com.DevConnect.devconnect.Models.CommentModel;
import com.DevConnect.devconnect.Services.CommentService;
import com.DevConnect.devconnect.Utils.APIReturnModel;

import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;




@RestController
@RequestMapping("comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    private APIReturnModel apiReturnModel;
    private Vector<CommentModel> comments;
    @PostMapping("/add-comment")
    public  ResponseEntity<APIReturnModel>  addComment(@RequestBody CommentModel newComment){
        apiReturnModel = new APIReturnModel();
        comments = new Vector<>();

        try{
            CommentModel comment = this.commentService.addComment(newComment);
            comments.add(comment);

            apiReturnModel.setData(comments);
            apiReturnModel.setStatus("Success");
            apiReturnModel.setMessage("Comment Added Successfully !");
        }catch(Exception e){
            e.printStackTrace();
            apiReturnModel.setStatus("Fail");
            apiReturnModel.setMessage(" Send the correct  Comment Data");
        }

        return ResponseEntity.ok(apiReturnModel);
    }
    
    @DeleteMapping("/delete-comment/{commentId}")
    public String deleteComment(@PathVariable("commentId") Long commentId){
        return this.commentService.deleteComment(commentId);
    }

    @GetMapping("/get-comment/{commentId}")
    public CommentModel getComment(@PathVariable("commentId") Long commentId) {
        return this.commentService.getCommentById(commentId);
    }
    
}
