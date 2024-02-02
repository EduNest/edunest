import express from "express";
import multer from "multer";
import {
  handleGetCourses,
  handleGetCourse,
  handleCreateCourse,
} from "../controllers/coursesController.js";
import { handleCreateChapter } from "../controllers/chaptersController.js";
import { getCourse, getCourses } from "../models/coursesModel.js";
const coursesRouter = express.Router();
const upload = multer();

coursesRouter.get("/last", async (req, res) => {
  try {
    let courses = await getCourses();
    let lastCourse = courses[courses.length - 1];
    res.render("newCourse", { course: lastCourse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching the last course.");
  }
});
coursesRouter.post("/save-course", upload.single("image"), handleCreateCourse);

coursesRouter.post("/:courseTitle/chapters/save-chapter", handleCreateChapter);

coursesRouter.get("/:courseTitle", handleGetCourse);

export default coursesRouter;
