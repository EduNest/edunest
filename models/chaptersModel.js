import { ref, set, db } from "../firebaseConfig.js";
import { fileURLToPath } from "url";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createChapter(courseTitle, chapter) {
  const chaptersRef = ref(db, `chapters/${courseTitle}/${chapter.title}`);
  await set(chaptersRef, chapter);
  return chapter.title;
}

export async function createChapterDirectory(courseTitle, chapter) {
  const dirPath = path.join(
    __dirname,
    `../views/courses/${courseTitle}/chapters`,
    chapter
  );
  try {
    await mkdir(dirPath, { recursive: true });
    console.log("Directory created successfully!");

    // Create an index.ejs file, using the chapter index page template
    const htmlContent = await readFile(
      path.join(__dirname, "../views/courses/chapterTemplate.ejs"),
      "utf8"
    );
    await writeFile(path.join(dirPath, "index.ejs"), htmlContent);
    console.log("index.ejs created successfully!");
    return { message: "Course and directories created successfully!" };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}
