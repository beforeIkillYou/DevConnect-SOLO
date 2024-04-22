package com.DevConnect.devconnect.Models;



import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "users")
public class UserModel {
    @Id
	@GeneratedValue(strategy= GenerationType.AUTO)
	private long userId;

    @Column(unique=true, nullable=false)
    private String username;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String bio;

    @Column(nullable = false)
    private String avatar;

    private String story;

    @JsonIgnore
    @OneToMany(mappedBy = "owner")
    private List<PostModel> posts;

    @JsonIgnore
    @OneToMany(mappedBy = "owner")
    private List<CommentModel> comments;

    @ManyToMany(mappedBy = "likedUsers")
    private List<PostModel> likedPosts;

    @JsonIgnore
    @ManyToMany
    private List<UserModel> followers;

    
    @ManyToMany(mappedBy = "followers")
    private List<UserModel> following;

    UserModel(){
    }

    UserModel(String name, String username, String email, String password, String bio, String avatar){
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.avatar = avatar;
    }

    public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getBio() {
        return bio;
    }
    public void setBio(String bio) {
        this.bio = bio;
    }
    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getStory() {
        return story;
    }
    public void setStory(String story) {
        this.story = story;
    }

    public List<PostModel> getPosts() {
        return posts;
    }
    public void setPosts(List<PostModel> posts) {
        this.posts = posts;
    }

    public List<CommentModel> getComments() {
        return comments;
    }
    public void setComments(List<CommentModel> comments) {
        this.comments = comments;
    }

    public List<PostModel> getLikedPosts() {
        return likedPosts;
    }
    public void setLikedPosts(List<PostModel> likedPosts) {
        this.likedPosts = likedPosts;
    }

    public List<UserModel> getFollowers() {
        return followers;
    }
    public void setFollowers(List<UserModel> followers) {
        this.followers = followers;
    }

    public List<UserModel> getFollowing() {
        return following;
    }
    public void setFollowing(List<UserModel> following) {
        this.following = following;
    }

}
