// setting up firebase with our website
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyATeuXMmvqfrkSHbbCNWBfm-UgOqbENaiw",
    authDomain: "testing-f70e8.firebaseapp.com",
    projectId: "testing-f70e8",
    storageBucket: "testing-f70e8.appspot.com",
    messagingSenderId: "87279105612",
    appId: "1:87279105612:web:27ab21d6704229f89a66e9"
});
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

// Sign up function
const signUp = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email, password)
    // firebase code
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in 
            document.write("You are Signed Up")
            alert("account create sucssefuly")
            alert("You are Signed up")
            window.location.href = "homepage.html";
            // ...
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message)
            alert("your already have account")
            
            // ..
        });
}

// Sign In function
const signIn = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // firebase code
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in 
            alert("You are Signed in")
            window.location.href = "homepage.html";
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message)
            alert("you don't have account ")
        });
}