import { db, ref, set, get } from "../firebaseConfig.js";
import { fileURLToPath } from "url";
import { mkdir } from "fs/promises";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createChapter(courseTitle, chapter) {
  const chaptersRef = ref(db, `chapters/${courseTitle}/${chapter.title}`);
  await set(chaptersRef, chapter);
  return chapter.title;
}

export async function getChapterByTitle(courseTitle, chapterTitle) {
  const chaptersRef = ref(db, `chapters/${courseTitle}`);
  const snapshot = await get(chaptersRef);
  if (snapshot.exists()) {
    const chapters = snapshot.val();
    const chapter = Object.values(chapters).find(
      (chapter) => chapter.title.toLowerCase() === chapterTitle.toLowerCase()
    );

    return chapter;
  }
  return null;
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

    return { message: "Directory created successfully!" };
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}
