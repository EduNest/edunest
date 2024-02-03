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
  const chapterTitle = document.getElementById("chapterTitle").value;
  if (!validateChapter(chapterTitle)) {
    console.error("Validation failed.");
    return;
  }
  try {
    const data = await postChapter(chapterTitle);
    console.log("Chapter saved:", data);
    document.getElementById("chapterForm").reset();
    if (chapterModal) {
      chapterModal.hide();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error saving the chapter. Please try again.");
  }
}

function validateChapter(title) {
  if (!title.trim()) {
    alert("Title is required.");
    return false;
  }
  const prohibited = /[\0\/\*\?\&.$#[\]]/;
  if (title.match(prohibited)) {
    alert("Title contains prohibited characters.");
    return false;
  }
  return true;
}

function postChapter(title) {
  const courseTitle = getCourseTitleFromPath(window.location.pathname);
  return fetch(`/courses/${courseTitle}/chapters/save-chapter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title }),
  })
    .then((response) => {
      if (response.status === 400 || response.status === 500) {
        return response.json().then((data) => {
          alert(data.message);
          return Promise.reject(data);
        });
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((response) => {
      const chapter = response.chapter;
      appendChapter(chapter, chapter.title);
      return chapter;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function appendChapter(chapter, index) {
  const chaptersContainer = document.getElementById("chapters-container");

  // Create chapter card
  const card = document.createElement("div");
  card.className = "card mb-3";
  card.id = `chapter-${index}`;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  card.appendChild(cardBody);

  const h5 = document.createElement("h5");
  h5.className = "card-title chapter-title";
  h5.textContent = chapter.title;
  cardBody.appendChild(h5);

  const hr = document.createElement("hr");
  cardBody.appendChild(hr);

  const p = document.createElement("p");
  p.className = "card-text";
  p.textContent = "No lessons available for this chapter.";
  cardBody.appendChild(p);

  // Create "Create Lesson" button
  const createLessonButton = document.createElement("button");
  createLessonButton.id = `create-lesson-btn-${index}`;
  createLessonButton.className = "btn btn-primary";
  createLessonButton.textContent = "Create Lesson";
  createLessonButton.setAttribute("data-bs-toggle", "modal");
  createLessonButton.setAttribute("data-bs-target", `#lessonModal-${index}`);
  cardBody.appendChild(createLessonButton);
  
  // Create lesson modal
  const lessonModal = document.createElement("div");
  lessonModal.className = "modal fade";
  lessonModal.id = `lessonModal-${index}`;
  lessonModal.setAttribute("tabindex", "-1");
  lessonModal.setAttribute("aria-labelledby", `lessonModalLabel-${index}`);
  lessonModal.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog modal-lg";
  lessonModal.appendChild(modalDialog);

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalDialog.appendChild(modalContent);

  // Modal header
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalContent.appendChild(modalHeader);

  const modalTitle = document.createElement("h5");
  modalTitle.className = "modal-title";
  modalTitle.id = `lessonModalLabel-${index}`;
  modalTitle.textContent = "Create Lesson";
  modalHeader.appendChild(modalTitle);

  const closeButton = document.createElement("button");
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");
  modalHeader.appendChild(closeButton);

  // Modal body
  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalContent.appendChild(modalBody);

  const form = document.createElement("form");
  form.id = `lessonForm-${index}`;
  modalBody.appendChild(form);

  const div1 = document.createElement("div");
  div1.className = "mb-3";
  form.appendChild(div1);

  const label1 = document.createElement("label");
  label1.className = "form-label";
  label1.htmlFor = `lessonTitle-${index}`;
  label1.textContent = "Lesson Title";
  div1.appendChild(label1);

  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control";
  input.id = `lessonTitle-${index}`;
  input.required = true;
  input.pattern = "[A-Za-z0-9 ]+";
  div1.appendChild(input);

  const div2 = document.createElement("div");
  div2.className = "mb-3";
  form.appendChild(div2);

  const label2 = document.createElement("label");
  label2.className = "form-label";
  label2.htmlFor = `lessonContent-${index}`;
  label2.textContent = "Lesson Content";
  div2.appendChild(label2);

  const textarea = document.createElement("textarea");
  textarea.className = "form-control";
  textarea.id = `lessonContent-${index}`;
  textarea.rows = "10";
  textarea.required = true;
  div2.appendChild(textarea);

  const div3 = document.createElement("div");
  div3.className = "mb-3";
  form.appendChild(div3);

  const label3 = document.createElement("label");
  label3.className = "form-label";
  label3.htmlFor = `lessonPreview-${index}`;
  label3.textContent = "Lesson Preview";
  div3.appendChild(label3);

  const div4 = document.createElement("div");
  div4.id = `lessonPreview-${index}`;
  div4.className = "border p-2";
  div3.appendChild(div4);

  // Modal footer
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalContent.appendChild(modalFooter);

  const previewButton = document.createElement("button");
  previewButton.className = "btn btn-primary";
  previewButton.id = `previewButton-${index}`;
  previewButton.textContent = "Preview";
  modalFooter.appendChild(previewButton);

  const saveLessonButton = document.createElement("button");
  saveLessonButton.className = "btn btn-primary";
  saveLessonButton.id = `saveLessonButton-${index}`;
  saveLessonButton.textContent = "Save Lesson";
  modalFooter.appendChild(saveLessonButton);

  chaptersContainer.appendChild(card);
  chaptersContainer.appendChild(lessonModal);
}
