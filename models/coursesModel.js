import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { ref, get, set, push, db } from "../firebaseConfig.js";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getCourses() {
  const coursesRef = ref(db, "courses");
  const snapshot = await get(coursesRef);
  if (snapshot.exists()) {
    const coursesObj = snapshot.val();
    const coursesArray = Object.keys(coursesObj).map((key) => coursesObj[key]);
    return coursesArray;
  } else {
    return [];
  }
}

export async function getCourse(courseTitle) {
  const coursesRef = ref(db, "courses");
  const snapshot = await get(coursesRef);
  if (snapshot.exists()) {
    const coursesObj = snapshot.val();
    const course = Object.values(coursesObj).find(
      (course) => course.title === courseTitle
    );
    return course ? course : null;
  } else {
    return [];
  }
}

export async function getCourseChapters(courseTitle) {
  const snapshot = await get(ref(db, "chapters/" + courseTitle));
  if (snapshot.exists()) {
    const chaptersObject = snapshot.val();
    const chaptersArray = Object.keys(chaptersObject).map(
      (key) => chaptersObject[key]
    );
    return chaptersArray;
  }
  return null;
}

export async function getChapterLessons(courseId, chapterTitle) {
  const snapshot = await get(
    ref(db, "courses/" + courseId + "/chapters/" + chapterTitle + "/lessons")
  );
  return snapshot.exists() ? snapshot.val() : null;
}

export async function createCourse(course) {
  const coursesRef = ref(db, "courses");
  const newCourseRef = push(coursesRef);
  await set(newCourseRef, course);
  return newCourseRef.key;
}

export async function getCourseByTitle(title) {
  const coursesRef = ref(db, "courses");
  const snapshot = await get(coursesRef);
  if (snapshot.exists()) {
    const courses = snapshot.val();
    const course = Object.values(courses).find(
      (course) => course.title.toLowerCase() === title.toLowerCase()
    );

    return course;
  }
  return null;
}

export async function createCourseDirectories(courseTitle) {
  const dirPath = path.join(__dirname, "../views/courses", courseTitle);
  try {
    await mkdir(dirPath, { recursive: true });
    console.log("Directory created successfully!");

    // Create an index.ejs file, using the course index page template
    const courseTemplate = await readFile(
      path.join(__dirname, "../views/courses/courseTemplate.ejs"),
      "utf8"
    );
    await writeFile(path.join(dirPath, "index.ejs"), courseTemplate);
    console.log("index.ejs for course created successfully!");

    
    // Create a chapters directory inside the course directory
    await mkdir(path.join(dirPath, "chapters"));
    console.log("Chapters directory created successfully!");
    const chapterTemplate = await readFile(
      path.join(__dirname, "../views/courses/chapterTemplate.ejs"),
      "utf8"
    );
    await writeFile(path.join(dirPath + "/chapters", "index.ejs"), chapterTemplate);
    console.log("index.ejs for chapter created successfully!");
    return { message: "Course and directories created successfully!" };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}
