let chapterModal;
document.addEventListener("DOMContentLoaded", (event) => {
  const createChapterBtn = document.getElementById("create-chapter-btn");
  if (!createChapterBtn) {
    return;
  }
  setupCreateChapterButton(createChapterBtn);
  setupSaveChapterButton();
  const createLessonButtons = document.querySelectorAll(
    "[id^='create-lesson-btn-']"
  );
  setUpLessonModal(createLessonButtons);
});
function setUpLessonModal(createLessonButtons) {
  createLessonButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      const lessonModal = document.getElementById(`lessonModal-${index}`);
      const bootstrapModal = new bootstrap.Modal(lessonModal);
      bootstrapModal.show();
    });
  });
}
function getCourseTitleFromPath(path) {
  const segments = path.split("/");

  const coursesIndex = segments.indexOf("courses");

  let courseTitle = segments[coursesIndex + 1];

  courseTitle = decodeURIComponent(courseTitle);

  return courseTitle;
}

function setupCreateChapterButton(createChapterBtn) {
  console.log("Working!");
  createChapterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openChapterModal("chapterModal");
  });
}

function openChapterModal(modalId) {
  chapterModal = new bootstrap.Modal(document.getElementById(modalId));
  chapterModal.show();
}

function setupSaveChapterButton() {
  const saveChapterBtn = document.getElementById("save-chapter-btn");
  saveChapterBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    saveChapter();
  });
}

async function saveChapter() {
  // const formData = getChapterFormData();
  try {
    const data = await postChapter();
    console.log(data);
    const chapterHtml = await getLastChapter();
    appendChapter(chapterHtml);
    document.getElementById("chapterForm").reset();
    chapterModal.hide();
  } catch (error) {
    console.error("Error:", error);
  }
}

function postChapter() {
  const courseTitle = getCourseTitleFromPath(window.location.pathname);
  console.log("title" + courseTitle);
  const chapterTitle = document.getElementById("chapterTitle").value;
  return fetch(`/courses/${courseTitle}/chapters/save-chapter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: chapterTitle }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error during fetch:", error);
    });
}

function getLastChapter() {
  return fetch("/chapters/last").then((response) => response.text());
}

function appendChapter(chapterHtml) {
  document.getElementById("chapters-container").innerHTML += chapterHtml;
}

function closeChapterModal(modalId) {
  const chapterModalElement = document.getElementById(modalId);
  const chapterModal = new bootstrap.Modal(chapterModalElement);
  chapterModal.hide();
}
