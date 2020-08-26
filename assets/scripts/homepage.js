firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementsByClassName('nav-button')[0].children[0].innerText = "Sign Out";
        document.getElementsByClassName('nav-button')[0].setAttribute('onclick', 'firebase.auth().signOut();');

        document.getElementsByClassName('nav-link')[1].setAttribute('href', '/tutorials/');
    }
});

document.getElementsByClassName('nav-link')[1].addEventListener('click', () => {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            alert('You must be signed in to visit this page!');
        }
    });
});