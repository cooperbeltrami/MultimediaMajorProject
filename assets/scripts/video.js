const videoComponent = document.getElementsByClassName('video-container')[0];
let alreadyViewed = false;

// Check video status every second
setInterval(() => {

    // We don't want to get the time if the video is not playing
    if (!videoComponent.paused) {
        var currentVideoTime = videoComponent.currentTime;
        
        if (alreadyViewed == false) {
            firebase.database().ref(`/videos/${videoId}/info/`).update({
                views: firebase.database.ServerValue.increment(1)
            });

            alreadyViewed = true;
        }

        // Check to see if current time is a step
        for (stepIndex = 0; stepIndex < numberOfSteps; stepIndex++) {
            if (stepsArray[stepIndex].time == formatTime(currentVideoTime)) {

                // Clear highlight for other step items
                for (i = 0; i < numberOfSteps; i++) {
                    document.getElementsByClassName('step-item')[i].classList.remove('step-selected');
                }

                document.getElementsByClassName('step-item')[stepIndex].classList.add('step-selected');
            }
        }

        console.log(formatTime(currentVideoTime));
    }
}, 1000);

// Format time into the following format 00:00:00 - hours, minutes, seconds
function formatTime(videoDuration) {
    // let videoHours = Math.floor(videoDuration / 3600);
    let videoMinutes = Math.floor(videoDuration % 3600 / 60);
    let videoSeconds = Math.floor(videoDuration % 3600 % 60);

    // (videoHours < 10) ? videoHours = "0" + videoHours.toString() : null;
    (videoMinutes < 10) ? videoMinutes = "0" + videoMinutes.toString() : null;
    (videoSeconds < 10) ? videoSeconds = "0" + videoSeconds.toString() : null;

    return videoMinutes.toString() + ":" + videoSeconds.toString();
}

function jumpToTime(timeInSeconds) {
    videoComponent.currentTime = timeInSeconds;
    videoComponent.play();
}
