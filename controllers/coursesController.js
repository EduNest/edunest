import {
  getCourses,
  getCourse,
  getCourseChapters,
  getChapterLessons,
  createCourse,
  getCourseByTitle,
  createCourseDirectories,
} from "../models/coursesModel.js";
import {
  storageRef,
  storage,
  uploadBytes,
  getDownloadURL,
} from "../firebaseConfig.js";
import { getUserFromDatabase } from "../routes/viewRoutes.js";

export async function handleGetCourses(req) {
  try {
    let user = await getUserFromDatabase(true);
    const courses = await getCourses(req.db);
    return courses ? Object.values(courses) : [];
  } catch (error) {
    console.error(error);
  }
}

export async function handleGetCourse(req, res) {
  try {
    const user = await getUserFromDatabase(true);
    const title = req.params.courseTitle;
    const course = await getCourseByTitle(title);
    const courseFile = `courses/${title}/index`;
    const chaptersArray = await getCourseChapters(title);

    console.log(user);
    console.log(chaptersArray);

    res.render(courseFile, {
      user: user,
      course: course,
      chapters: chaptersArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching course.");
  }
}

export async function handleCreateCourse(req, res) {
  try {
    const course = { ...req.body };
    const courseImageFile = req.file;

    const existingCourse = await getCourseByTitle(course.title);
    if (existingCourse) {
      res
        .status(400)
        .json({ message: "A course with this title already exists." });
      return;
    }
    // If an image file is provided, upload it to Firebase storage
    if (courseImageFile) {
      const coursesFolder = storageRef(
        storage,
        `courses/${course.title}/${courseImageFile.originalname}`
      );

      await uploadBytes(coursesFolder, courseImageFile.buffer).then(
        (snapshot) => {
          console.log("Uploaded image successfully!");
        }
      );

      // Get the download URL of the uploaded image file
      const imageUrl = await getDownloadURL(coursesFolder);
      course.image = imageUrl;
    } else {
      // If no image file is provided, use the default image
      course.image = "/img/courses/default.png";
    }

    course.created = new Date().toISOString();

    const courseId = await createCourse(course);
    const dirResult = await createCourseDirectories(course.title);
    console.log(dirResult.message);
    res
      .status(200)
      .json({ message: "Course created successfully!", course: course });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while creating the course.");
  }
}
