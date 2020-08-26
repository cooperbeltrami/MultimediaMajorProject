// Attempt to register a new account
document.getElementsByClassName('button')[0].addEventListener('click', () => {
    let name = document.getElementsByClassName('input')[0].value;
    let email = document.getElementsByClassName('input')[1].value;
    let password = document.getElementsByClassName('input')[2].value;

    let error = document.getElementsByClassName('error')[0];

    if (name != "" && name.includes(' ')) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            let uid = firebase.auth().currentUser.uid;
            let photo = getPhotoUrl(name);
    
            // Add user record to database
            firebase.database().ref(`/users/${uid}/`).set({
                name: name,
                email: email,
                photo: photo
            }).then(() => {

                // Update user profile
                firebase.auth().currentUser.updateProfile({
                    displayName: name,
                    photoURL: photo
                }).then(() => {
                    window.location.href = "/courses/";
                });
            });
        }).catch(err => {
            console.error('Login Error: ', err.code);
            error.innerText = err.message.split('.')[0];
        });
    } else {
        console.error('Login Error: ', 'login/invalid-name');
        error.innerText = "A valid first and last name is required";
    }
});

// Generate a profile picture with the users initial and a random colour
function getPhotoUrl(username) {
    let baseUrl = 'https://ui-avatars.com/api/';
    let options = '&length=1&format=svg&rounded=true&bold=true&color=ffffff';
    let name = '?name=' + username.replace(' ', '+');
    let backgroundOptions = ['F04747', '43B581', 'FAA61A', '747F8D', '7289DA'];
    let background = '&background=' + backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)];

    return baseUrl + name + options + background;
}

// Change name input state depending on its value
document.getElementsByClassName('input')[0].addEventListener('input', () => {
    let inputField = document.getElementsByClassName('input')[0];

    if (inputField.value != "") {
        inputField.className = "input input-contains-text";
    } else {
        inputField.className = "input";
    }
});

// Change email input state depending on its value
document.getElementsByClassName('input')[1].addEventListener('input', () => {
    let inputField = document.getElementsByClassName('input')[1];

    if (inputField.value != "") {
        inputField.className = "input input-contains-text";
    } else {
        inputField.className = "input";
    }
});

// Change password input state depending on its value
document.getElementsByClassName('input')[2].addEventListener('input', () => {
    let inputField = document.getElementsByClassName('input')[2];

    if (inputField.value != "") {
        inputField.className = "input input-contains-text";
    } else {
        inputField.className = "input";
    }
});