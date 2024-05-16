package com.DevConnect.devconnect.Models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class PostModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long postId;

    @Column(nullable = false)
    private String media;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @JsonIgnore
    private int views = 0;

    private int likes = 0;

    @ManyToOne
    private UserModel owner;

    // @JsonIgnore
    @OneToMany(mappedBy = "post")
    private List<CommentModel> comments;

    
    @ManyToMany
    private List<UserModel> likedUsers;

    public PostModel() {
    }


    public PostModel(String media, String title, String description, UserModel owner) {
        this.media = media;
        this.title = title;
        this.description = description;
        this.owner = owner;
    }

    public long getPostId() {
        return postId;
    }

    public String getMedia() {
        return media;
    }

    public void setMedia(String media) {
        this.media = media;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public UserModel getOwner() {
        return owner;
    }

    public void setOwner(UserModel owner) {
        this.owner = owner;
    }

    public List<CommentModel> getComments() {
        return comments;
    }
}
