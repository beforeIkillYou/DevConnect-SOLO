package com.DevConnect.devconnect.Utils;


public class CommentDTO {
    private String text;
    private long userId;
    private long postId;

    // Getters and setters
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public long getUserId() {
        return userId;
    }
    public void setUserId(long userId) {
        this.userId = userId;
    }
    public long getPostId() {
        return postId;
    }
    public void setPostId(long postId) {
        this.postId = postId;
    }
    
}