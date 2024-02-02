import express from "express";
import path from "path";
import { auth, db, ref, get } from "../firebaseConfig.js";
// import {
//   handleGetCourses,
//   handleGetCourse,
// } from "../controllers/coursesController.js";
import { getCourses, getCourse } from "../models/coursesModel.js";
const router = express.Router();

export const getUserFromDatabase = async (fetchRole = false) => {
  if (!auth.currentUser) {
    return null;
  }
  const userSettingsRef = ref(db, "userSettings/" + auth.currentUser.uid);
  const userSnapshot = await get(userSettingsRef);

  if (userSnapshot.exists()) {
    let user = userSnapshot.val();

    if (fetchRole) {
      const roleRef = ref(db, "users/" + auth.currentUser.uid);
      const roleSnapshot = await get(roleRef);
      if (roleSnapshot.exists()) {
        user.role = roleSnapshot.val().role;
      }
    }

    return user;
  }
};
router.get("/", async (req, res) => {
  try {
    let user = await getUserFromDatabase();
    res.render("index", { user: user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching user data.");
  }
});

router.get("/index", async (req, res) => {
  try {
    let user = await getUserFromDatabase();
    res.render("index", { user: user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching user data.");
  }
});

router.get("/auth", async (req, res) => {
  try {
    let user = await getUserFromDatabase();
    if (user) {
      res.render("index", { user: user });
    }
    res.render("auth", { user: user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching user data.");
  }
});

router.get("/courses", async (req, res) => {
  try {
    let user = await getUserFromDatabase(true);
    let courses = await getCourses();

    res.render("courses", { user: user, courses: courses ? courses : [] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching user data.");
  }
});






export default router;
