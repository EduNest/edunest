import express from "express";
import {
  handleSignUp,
  handleForgotPassword,
  handleLogin,
  handleLogout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/forgot-password", handleForgotPassword);
router.post("/logout", handleLogout);

export default router;
