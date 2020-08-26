// Get current tutorial data from database
const videoId = "-" + window.location.href.split('?video=')[1];
const difficultyArray = ["All Levels", "Beginner", "Intermediate"];

// Load database into page
firebase.database().ref(`/videos/${videoId}`).once('value', snapshot => {
    if (snapshot.val()) {
        document.getElementsByClassName('video-description')[0].innerText = snapshot.val().info.description;
        document.getElementsByClassName('video-title')[0].innerText = snapshot.val().info.title;
        document.getElementsByClassName('video-container')[0].src = snapshot.val().info.url;
        document.getElementsByClassName('video-meta')[0].innerText = snapshot.val().info.views + " views • " + snapshot.val().info.published;

        document.getElementsByClassName('video-container')[0].poster = snapshot.val().info.banner;

        document.getElementsByClassName('course-name')[0].innerText = snapshot.val().info.course;
        document.getElementsByClassName('course-difficulty')[0].innerText = difficultyArray[snapshot.val().info.difficulty];

        document.title = "MultiCourse | " + snapshot.val().info.title;

        firebase.database().ref(`/users/${snapshot.val().info.author}`).once('value', author => {
            document.getElementsByClassName('author-avatar')[0].src = author.val().photo;
            document.getElementsByClassName('author-details')[0].innerHTML = `by <span>${author.val().name}</span> &middot; ${snapshot.val().info.course}`;
        });
    } else {
        window.location.href = "/tutorials/";
    }
});

// Load video comments into page - this will only happen on page load
function loadComments() {
    firebase.database().ref(`/videos/${videoId}/comments/`).once('value', snapshot => {
        let numberOfComments = 0;
        let commentsList = document.getElementsByClassName('comments-list')[0];

        // Clear previous comments and load them back in so there are no double ups
        commentsList.innerHTML = "";

        // Make sure there are comments to load
        if (snapshot.val()) {
            numberOfComments = Object.keys(snapshot.val()).length;

            // Create html for each comment and add to comment list
            snapshot.forEach(comment => {
                let currentYear = new Date().getFullYear();
                let commentTime = new Date(comment.val().time).toString().split(currentYear)[0];
                let author = comment.val().author;

                commentsList.innerHTML = `
                <div class="comment-item">
                    <img class="comment-avatar" src="${author.photo}"></img>
                    <div class="comment-name">${author.name} <span class="comment-time">${commentTime}</span></div>
                    <div class="comment-message">${comment.val().comment}</div>
                </div>` + commentsList.innerHTML;
            });
        }

        document.getElementsByClassName('comments-title')[0].innerText = (numberOfComments == 1) ? numberOfComments + " Comment" : numberOfComments + " Comments";
    });
}

// Change bottom border of comment input when text is changed
document.getElementsByClassName('enter-comment-text')[0].addEventListener('input', () => {
    let enterCommentInput = document.getElementsByClassName('enter-comment-text')[0];
    let sendCommentButton = document.getElementsByClassName('send-comment-button')[0];

    if (enterCommentInput.value != "" && enterCommentInput.value != " ") {
        enterCommentInput.classList.add("contains-text");
        sendCommentButton.classList.add("enable-send-button");
    } else {
        sendCommentButton.classList.remove("enable-send-button");
        enterCommentInput.classList.remove("contains-text");
    }
});

// Add a comment to the video
document.getElementsByClassName('send-comment-button')[0].addEventListener('click', () => {
    let enterCommentInput = document.getElementsByClassName('enter-comment-text')[0];
    let sendCommentButton = document.getElementsByClassName('send-comment-button')[0];
    
    let time = Date.now();
    let comment = enterCommentInput.value;

    // Make sure the input contains something
    if (comment != "") {
        firebase.database().ref(`/videos/${videoId}/comments/`).push({
            comment: comment,
            time: time,
            author: {
                uid: firebase.auth().currentUser.uid,
                name: firebase.auth().currentUser.displayName,
                photo: firebase.auth().currentUser.photoURL
            }
        });

        // Add comment to list without requiring a new snapshot - reloading the page will grab new comments
        let commentsList = document.getElementsByClassName('comments-list')[0];

        let currentYear = new Date().getFullYear();
        let commentTime = new Date(time).toString().split(currentYear)[0];

        commentsList.innerHTML = `
        <div class="comment-item">
            <img class="comment-avatar" src="${firebase.auth().currentUser.photoURL}"></img>
            <div class="comment-name">${firebase.auth().currentUser.displayName} <span class="comment-time">${commentTime}</span></div>
            <div class="comment-message">${comment}</div>
        </div>` + commentsList.innerHTML;

        // Increase comments text
        let commentsText = document.getElementsByClassName('comments-title')[0];
        let newNumberOfComments =  parseInt(commentsText.innerText.split(' Comment')[0]);

        newNumberOfComments++;
        commentsText.innerText = newNumberOfComments.toString() + " Comments";

        // Clear input and reset send button
        enterCommentInput.value = "";
        enterCommentInput.classList.remove("contains-text");
        sendCommentButton.classList.remove("enable-send-button");
    }
});

// Increment likes when like button is pressed
document.getElementsByClassName('btn-like')[0].addEventListener('click', () => {
    let uid = firebase.auth().currentUser.uid;

    firebase.database().ref(`/videos/${videoId}/likes/${uid}`).once('value', snapshot => {
        if (snapshot.val()) {
            // Remove like from video
            firebase.database().ref(`/videos/${videoId}/likes/${uid}`).remove();
            
        } else {
            // Add like to video
            firebase.database().ref(`/videos/${videoId}/likes/`).update({
                [uid]: 1
            });
        }
    });
});

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        isVideoLiked();
        loadComments();
    } else {
        window.location.href = "/signin/";
    }
});

// Is the video liked by the current user, change the like button if it is
function isVideoLiked() {
    let uid = firebase.auth().currentUser.uid;
    let likeButton = document.getElementsByClassName('btn-like')[0];

    firebase.database().ref(`/videos/${videoId}/likes/${uid}/`).on('value', snapshot => {
        if (snapshot.val()) {
            likeButton.classList.add("btn-like-selected");
        } else {
            likeButton.classList.remove("btn-like-selected");
        }
    });
}

let numberOfSteps = 0;
let stepsArray = [];

// Load step items 
firebase.database().ref(`/videos/${videoId}/steps/`).once('value', steps => {
    let stepCount = 0;

    // Make sure steps exist for the video
    if (steps.val()) {
        numberOfSteps = Object.keys(steps.val()).length;

        // Cycle through all steps
        steps.forEach(step => {
            document.getElementsByClassName('steps-list')[0].innerHTML += `
            <div class="step-item">
                <div class="step-icon"></div>
                <div class="step-name" id=${stepCount} onclick="stepClick(this.id);">${step.val().name.split('.')[0]}<br><div>${step.val().name.split('.')[1]}</div></div>
                <div class="step-starttime">${step.val().time}</div>
            </div>`;

            stepsArray.push({
                name: step.val().name,
                time: step.val().time
            });

            stepCount++;
        });
    }
});

function stepClick(stepId) {
    let stepTime = document.getElementsByClassName('step-starttime')[stepId].innerText;

    let minutes = parseInt(stepTime.split(':')[0]) * 60;
    let seconds = parseInt(stepTime.split(':')[1]);

    let timeInSeconds = minutes + seconds;

    // Clear highlight for other step items
    for (i = 0; i < numberOfSteps; i++) {
        document.getElementsByClassName('step-item')[i].classList.remove('step-selected');
    }

    // Allocate new step items
    document.getElementsByClassName('step-item')[stepId].classList.add('step-selected');

    console.log(`Jumping to: ${timeInSeconds} (${stepTime})`);

    jumpToTime(timeInSeconds);
}