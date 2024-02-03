import {
  createChapter,
  getChapterByTitle,
  createChapterDirectory,
} from "../models/chaptersModel.js";

export async function handleCreateChapter(req, res) {
  try {
    const chapter = req.body;
    const courseTitle = req.params.courseTitle;
    chapter.created = new Date().toISOString();

    // Check if a chapter with the same title already exists in the same course
    const existingChapter = await getChapterByTitle(courseTitle, chapter.title);
    if (existingChapter) {
      res
        .status(400)
        .json({ message: "A chapter with this title already exists in this course." });
      return;
    }

    const chapterTitle = await createChapter(courseTitle, chapter);
    const dirResult = await createChapterDirectory(courseTitle, chapterTitle);
    console.log(dirResult.message);

    res.status(200).json({
      message: "Chapter created successfully!",
      chapter: chapter,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while creating the chapter.");
  }
}



