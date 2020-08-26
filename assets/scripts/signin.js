// Attempt to authenticate user
document.getElementsByClassName('button')[0].addEventListener('click', () => {
    let email = document.getElementsByClassName('input')[0].value;
    let password = document.getElementsByClassName('input')[1].value;

    let error = document.getElementsByClassName('error')[0];

    firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
        console.error('Login Error: ', err.code);
        error.innerText = err.message.split('.')[0];
    });
});

// Check users authentication state
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = "/tutorials/";
    }
});

// Change email input state depending on its value
document.getElementsByClassName('input')[0].addEventListener('input', () => {
    let inputField = document.getElementsByClassName('input')[0];

    if (inputField.value != "") {
        inputField.className = "input input-contains-text";
    } else {
        inputField.className = "input";
    }
});

// Change password input state depending on its value
document.getElementsByClassName('input')[1].addEventListener('input', () => {
    let inputField = document.getElementsByClassName('input')[1];

    if (inputField.value != "") {
        inputField.className = "input input-contains-text";
    } else {
        inputField.className = "input";
    }
});