package com.DevConnect.devconnect.Utils;

public class StoryDTO {
    private String avatar,story,username;

    public StoryDTO(String avatar, String story, String username) {
        this.avatar = avatar;
        this.story = story;
        this.username = username;
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
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public StoryDTO() {
    }
}
