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
test("Sign up with valid email and password", async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, testUserEmail, testUserPassword);
        expect(userCredential.user).not.toBeNull();
    } catch (error) {
        // Handle sign-up failure
        console.error("Sign-up error:", error.message);
    }
});

// Test the sign-in functionality
test("Sign in with valid email and password", async () => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, testUserEmail, testUserPassword);
        expect(userCredential.user).not.toBeNull();
    } catch (error) {
        // Handle sign-in failure
        console.error("Sign-in error:", error.message);
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
