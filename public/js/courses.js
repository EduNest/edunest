let courseModal;
document.addEventListener("DOMContentLoaded", (event) => {
  const createCourseBtn = document.getElementById("create-course-btn");
  if (!createCourseBtn) {
    return;
  }
  setupCreateCourseButton();
  setupSaveCourseButton();
});

function setupCreateCourseButton() {
  createCourseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openCourseModal("createCourseModal"); // Pass the ID of the "Create Course" modal
  });
}

function openCourseModal(modalId) {
  courseModal = new bootstrap.Modal(document.getElementById(modalId));
  courseModal.show();
}

function setupSaveCourseButton() {
  const saveCourseBtn = document.getElementById("save-course-btn");
  saveCourseBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    saveCourse();
  });
}

async function saveCourse() {
  const formData = getFormData();
  try {
    const data = await postCourse(formData);
    console.log(data);
    const courseHtml = await getLastCourse();
    appendCourse(courseHtml);
    document.getElementById("courseForm").reset();
    courseModal.hide();
  } catch (error) {
    console.error("Error:", error);
  }
}

function getFormData() {
  const courseTitle = document.getElementById("courseTitle").value;
  const courseDescription = document.getElementById("courseDescription").value;
  const courseImage = document.getElementById("courseImage").files[0];

  const formData = new FormData();
  formData.append("image", courseImage);
  formData.append("title", courseTitle);
  formData.append("description", courseDescription);

  return formData;
}

function postCourse(formData) {
  return fetch("/courses/save-course", {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
}

function getLastCourse() {
  return fetch("/courses/last").then((response) => response.text());
}

function appendCourse(courseHtml) {
  document.getElementById("courses-container").innerHTML += courseHtml;
}

function closeCourseModal(modalId) {
  const courseModalElement = document.getElementById(modalId);
  const courseModal = new bootstrap.Modal(courseModalElement);
  courseModal.hide();
}
