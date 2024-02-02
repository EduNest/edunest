import { ref, get, db, auth } from "../firebaseConfig.js";
import {
  checkUsernameExists,
  createUser,
  loginUser,
  sendResetPasswordEmail,
} from "../models/authModel.js";

export async function handleSignUp(req, res) {
  const { email, password, username, displayName } = req.body;
  const usernameExists = await checkUsernameExists(username);
  if (usernameExists) {
    res.status(400).json({
      message: "This username is already taken. Please choose a different one.",
    });
  } else {
    try {
      await createUser(email, password, username, displayName);
      res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export async function handleLogin(req, res) {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await loginUser(email, password, rememberMe);

    // const userRef = ref(db, "userSettings/" + user.uid);

    // await get(userRef).then((snapshot) => {
    //   const userData = snapshot.val();
    // })
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
export async function handleForgotPassword(req, res) {
  const { email } = req.body;
  try {
    await sendResetPasswordEmail(email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function handleLogout(req, res) {
  try {
    await auth.signOut();
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
