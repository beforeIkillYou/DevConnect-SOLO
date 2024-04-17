function openStoryPopup(imageToUse, caption) {
    document.getElementById('storyPopup').style.display = 'flex';
    document.getElementById('story-image').setAttribute('src',`imgs/story-imgs/${imageToUse}`);
    document.getElementById('caption').innerHTML = caption;
}

function closeStoryPopup() {
    document.getElementById('storyPopup').style.display = 'none';
}