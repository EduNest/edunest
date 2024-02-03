import express from "express";
import multer from "multer";
import {
  handleGetCourse,
  handleCreateCourse,
} from "../controllers/coursesController.js";
import { handleCreateChapter } from "../controllers/chaptersController.js";
const coursesRouter = express.Router();
const upload = multer();


coursesRouter.post("/save-course", upload.single("image"), handleCreateCourse);

coursesRouter.post("/:courseTitle/chapters/save-chapter", handleCreateChapter);

coursesRouter.get("/:courseTitle", handleGetCourse);

export default coursesRouter;
