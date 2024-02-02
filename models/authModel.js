import {
  auth,
  db,
  ref,
  get,
  set,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "../firebaseConfig.js";

export async function checkUsernameExists(username) {
  const snapshot = await get(ref(db, "usernames/" + username.toLowerCase()));
  return snapshot.exists();
}

export async function createUser(email, password, username, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await set(ref(db, "users/" + user.uid), {
      username: username,
      email: email,
      role: "user",
      created: new Date(),
    });

    await set(ref(db, "userSettings/" + user.uid), {
      displayName: displayName ?? username,
      displayColor: "#09a5e999",
      avatar: "/img/avatars/default.png",
      avatarBackground: "#ececec",
    });

    await set(ref(db, "usernames/" + username.toLowerCase()), user.uid);

    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error(
        "This email is already in use. Please use a different one."
      );
    }
    console.error(error);
    throw new Error("An error occurred while creating the user.");
  }
}

export async function loginUser(email, password, rememberMe) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (rememberMe) {
    await setPersistence(auth, browserLocalPersistence);
  } else {
    await setPersistence(auth, browserSessionPersistence);
  }


  return userCredential.user;
}

export function sendResetPasswordEmail(email) {
  return sendPasswordResetEmail(auth, email);
}
