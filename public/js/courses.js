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
    openCourseModal("createCourseModal");
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
  if (!validateCourse(formData)) {
    console.error("Validation failed.");
    return;
  }
  try {
    const data = await postCourse(formData);
    console.log("Course saved:", data);
    document.getElementById("courseForm").reset();
    if (courseModal) {
      courseModal.hide();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("There was an error saving the course. Please try again.");
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
  return fetch("/courses/save-course", { method: "POST", body: formData })
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
      const course = response.course;
      appendCourse(course, course.title);
      return course;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function validateCourse(formData) {
  if (!formData.get("title").trim() || !formData.get("description").trim()) {
    alert("Title and description are required.");
    return false;
  }
  const prohibited = /[\0\/\*\?\&.$#[\]]/;
  if (formData.get("title").match(prohibited)) {
    alert("Title contains prohibited characters.");
    return false;
  }
  return true;
}

function appendCourse(course, index) {
  const coursesContainer = document.getElementById("courses-container");

  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("data-bs-toggle", "modal");
  card.setAttribute("data-bs-target", `#courseModal${index}`);

  const img = document.createElement("img");
  img.src = course.image;
  img.alt = course.title;
  card.appendChild(img);

  const h5 = document.createElement("h5");
  h5.textContent = course.title;
  card.appendChild(h5);

  const cardInfo = document.createElement("div");
  cardInfo.className = "card-info";
  cardInfo.textContent = course.description;
  card.appendChild(cardInfo);

  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = `courseModal${index}`;
  modal.setAttribute("tabindex", "-1");
  modal.setAttribute("aria-labelledby", `courseModalLabel${index}`);
  modal.setAttribute("aria-hidden", "true");

  const modalDialog = document.createElement("div");
  modalDialog.className = "modal-dialog";
  modal.appendChild(modalDialog);

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalDialog.appendChild(modalContent);

  // Modal header
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalContent.appendChild(modalHeader);

  const modalTitle = document.createElement("h5");
  modalTitle.className = "modal-title";
  modalTitle.id = `courseModalLabel${index}`;
  modalTitle.textContent = course.title;
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

  const modalImg = document.createElement("img");
  modalImg.src = course.image;
  modalImg.alt = course.title;
  modalBody.appendChild(modalImg);

  const p = document.createElement("p");
  p.textContent = course.description;
  modalBody.appendChild(p);

  const small = document.createElement("small");
  small.className = "text-muted";
  small.textContent = "Created on " + course.created;
  modalBody.appendChild(small);

  // Modal footer
  const modalFooter = document.createElement("div");
  modalFooter.className = "modal-footer";
  modalContent.appendChild(modalFooter);

  const enrollButton = document.createElement("button");
  enrollButton.className = "btn btn-primary enroll-btn";
  enrollButton.textContent = "Enroll";
  modalFooter.appendChild(enrollButton);

  const exploreButton = document.createElement("button");
  exploreButton.className = "btn btn-primary explore-btn";
  exploreButton.textContent = "Explore";
  exploreButton.setAttribute(
    "onClick",

    `window.location.href='/courses/${course.title}';`
  );
  modalFooter.appendChild(exploreButton);

  coursesContainer.appendChild(card);
  coursesContainer.appendChild(modal);
}

function closeCourseModal(modalId) {
  const courseModalElement = document.getElementById(modalId);
  const courseModal = new bootstrap.Modal(courseModalElement);
  courseModal.hide();
}
