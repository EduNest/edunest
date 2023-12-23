// Import the Firebase app and authentication
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

// Initialize Firebase with your configuration
const firebaseConfig = {
    apiKey: "AIzaSyATeuXMmvqfrkSHbbCNWBfm-UgOqbENaiw",
    authDomain: "testing-f70e8.firebaseapp.com",
    projectId: "testing-f70e8",
    storageBucket: "testing-f70e8.appspot.com",
    messagingSenderId: "87279105612",
    appId: "1:87279105612:web:27ab21d6704229f89a66e9",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// Define a test user's email and password
const testUserEmail = "test@example.com";
const testUserPassword = "testpassword";

// Test the sign-up functionality
test("Sign up with a new email and password", async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, testUserEmail, testUserPassword);
        uniqueUserId = userCredential.user.uid; // Store the user ID for later cleanup
        expect(userCredential.user).not.toBeNull();
    } catch (error) {
        console.error("Sign-up error:", error.message);
    }
});

// Add more test cases for other scenarios as needed
test("Attempt to sign up with an existing email", async () => {
    try {
        await createUserWithEmailAndPassword(auth, testUserEmail, "anotherpassword");
        // The above line should throw an error if the email is already registered
    } catch (error) {
        expect(error.code).toEqual("auth/email-already-in-use");
    }
});



// Test the sign-in functionality

test("Test Sign In - Correct Email and Password (Positive Test Case)", async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, testUserEmail, testUserPassword);
        expect(userCredential.user).not.toBeNull();
    } catch (error) {
        console.error("Test Sign In - Correct Email and Password - Error:", error.message);
    }
});

test("Test Sign In - Incorrect Password (Negative Test Case)", async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, testUserEmail, "incorrectpassword");
        expect(userCredential.user).toBeNull(); // Expect null since the password is incorrect
    } catch (error) {
        console.error("Test Sign In - Incorrect Password - Error:", error.message);
    }
});

// Add more test cases for other scenarios as needed

// Cleanup: Delete the test user account (optional)
afterAll(async () => {
    const user = auth.currentUser;
    if (user) {
        await user.delete();
    }
});
