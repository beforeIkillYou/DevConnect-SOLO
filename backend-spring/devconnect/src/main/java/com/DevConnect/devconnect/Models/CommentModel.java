package com.DevConnect.devconnect.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "comments")
public class CommentModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long commentId;

    @Column(nullable = false)
    private String text;

    @JsonIgnore
    @ManyToOne
    private UserModel owner;

    @JsonIgnore
    @ManyToOne
    private PostModel post;

    CommentModel() {
    }

    CommentModel(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public UserModel getOwner() {
        return owner;
    }

    public void setOwner(UserModel owner) {
        this.owner = owner;
    }

    public PostModel getPost() {
        return post;
    }

    public void setPost(PostModel post) {
        this.post = post;
    }
}
