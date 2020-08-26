// Check when users authentication state changes
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Load users avatar into all locations
        let userAvatars = document.getElementsByClassName('user-avatar');
        let numberOfAvatars = userAvatars.length;

        for (i = 0; i < numberOfAvatars; i ++) {
            userAvatars[i].src = user.photoURL;
        }
    }
});