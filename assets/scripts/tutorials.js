firebase.auth().onAuthStateChanged(user => {

    // Check to see if a user is authenticated
    if (user) {

        // Get courses list and populate that into UI
        firebase.database().ref(`/tutorials/`).once('value', tutorials => {

            // Cycle through all tutorials
            tutorials.forEach(tutorial => {
                let tutorialsArray = [];
                console.time();

                // If tutorial exists
                if (tutorial.val()) {
                    const videoUrl = tutorial.val().videoUrl;

                    // Load video ui
                    firebase.database().ref(`/videos/${videoUrl}`).once('value', video => {
                        if (video.val()) {

                            // Get video author details
                            firebase.database().ref(`/users/${video.val().info.author}`).once('value', author => {
                                if (author.val()) {
                                    
                                    // Check if the video has likes
                                    firebase.database().ref(`/videos/${videoUrl}/likes/${firebase.auth().currentUser.uid}`).once('value', videoLiked => {
                                        let liked = (videoLiked.val()) ? true : false;
                                        let likes = (video.val().likes) ? Object.values(video.val().likes).length.toString() + " likes" : "0 likes";

                                        let shortDescription = video.val().info.description;
                                        let numberOfComments = 0;

                                        // Add ellipsis to description if it is too long
                                        if (shortDescription.length >= 130) { shortDescription = video.val().info.description.substring(0, 130) + "..."; }

                                        if (video.val().comments) { numberOfComments = Object.keys(video.val().comments).length; }

                                        // Load object with video information
                                        tutorialsArray.push({
                                            title: video.val().info.title,
                                            videoUrl: tutorial.val().videoUrl,
                                            courseIndex: tutorial.val().courseIndex,
                                            comments: numberOfComments,
                                            banner: video.val().info.banner,
                                            plan: tutorial.val().plan,
                                            views: video.val().info.views,
                                            description: shortDescription,
                                            duration: video.val().info.duration,
                                            likes: likes,
                                            liked: liked,
                                            author: {
                                                name: author.val().name,
                                                photo: author.val().photo,
                                            }
                                        });

                                        loadTutorialUI(tutorialsArray[0]);
                                        console.timeLog();
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    } else {
        window.location.href = "/signin/";
    }
});

function loadTutorialUI(tutorialObject) {
    let currentTutorialObject = document.getElementsByClassName('course-list')[tutorialObject.courseIndex];

    currentTutorialObject.innerHTML = `
    <div class="course-item">
        <img class="course-banner" style="background-image: url(${tutorialObject.banner})"></img>
        <div class="course-details-container">
            <a class="course-name" href="/tutorial/?video=${tutorialObject.videoUrl.substring(1)}">${tutorialObject.title}</a>
            <div class="course-description">${tutorialObject.description}</div>
            <div class="course-author">
                <div class="author-container">
                    <img class="author-avatar" src=${tutorialObject.author.photo}></img>
                    <div class="created-by">Created by</div>
                    <div class="author-name">${tutorialObject.author.name}</div>
                </div>
                <div class="time-container">
                    <i class="icofont-clock-time"></i>
                    <div class="duration">${tutorialObject.duration}</div>
                </div>
            </div>
        </div>
        <div class="course-bottom">
            <div class="likes-container">
                <i class="icofont-heart ${(tutorialObject.liked ? "like-selected" : "")}"></i>
                <div class="likes">${tutorialObject.likes}</div>
            </div>

            <div class="views-container">
                <i class="icofont-eye-alt"></i>
                <div class="views">${tutorialObject.views}</div>
            </div>

            <div class="comments-container">
                <i class="icofont-ui-video-chat"></i>
                <div class="comments">${tutorialObject.comments}</div>
            </div>
        </div>
    </div>` + currentTutorialObject.innerHTML;
}