import {
  createChapter,
  createChapterDirectory,
} from "../models/chaptersModel.js";

export async function handleCreateChapter(req, res) {
  try {
    const chapter = req.body;
    console.log(chapter);
    const courseTitle = req.params.courseTitle;
    chapter.created = new Date().toISOString();

    const chapterTitle = await createChapter(courseTitle, chapter);
    const dirResult = await createChapterDirectory(courseTitle, chapterTitle);
    console.log(dirResult.message);

    res.status(200).json({
      message: "Chapter created successfully!",
      chapterTitle: chapterTitle,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while creating the chapter.");
  }
}
