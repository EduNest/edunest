const signUpPassword = document.getElementById("signup-password");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.querySelector("#login");
const signupBtn = document.querySelector("#signup");
const signUpToggleBtn = document.getElementById("toggle-signup-password");
const loginToggleBtn = document.getElementById("toggle-login-password");
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const formToShow = urlParams.get("form");
  if (formToShow === "login") {
    document.getElementById("login").click();
  } else if (formToShow === "signup") {
    document.getElementById("signup").click();
  }
};

loginBtn.addEventListener("click", (e) => {
  let parent = e.target.parentNode.parentNode;
  Array.from(e.target.parentNode.parentNode.classList).find((element) => {
    if (
      element !== "slide-up" &&
      !signupBtn.parentNode.classList.contains("slide-up")
    ) {
      parent.classList.add("slide-up");
    } else if (element === "slide-up") {
      signupBtn.parentNode.classList.add("slide-up");
      parent.classList.remove("slide-up");
    }
  });
});

signupBtn.addEventListener("click", (e) => {
  let parent = e.target.parentNode;
  Array.from(e.target.parentNode.classList).find((element) => {
    if (
      element !== "slide-up" &&
      !loginBtn.parentNode.parentNode.classList.contains("slide-up")
    ) {
      parent.classList.add("slide-up");
    } else if (element === "slide-up") {
      loginBtn.parentNode.parentNode.classList.add("slide-up");
      parent.classList.remove("slide-up");
    }
  });
});

addTogglePasswordEventListener(loginToggleBtn, loginPassword, "eye-icon-login");
addTogglePasswordEventListener(
  signUpToggleBtn,
  signUpPassword,
  "eye-icon-signup"
);

function addTogglePasswordEventListener(button, input, eyeIconId) {
  const eyeIcon = document.getElementById(eyeIconId);

  button.addEventListener("click", function () {
    if (input.type === "password") {
      input.type = "text";
      eyeIcon.className = "fas fa-eye-slash";
    } else {
      input.type = "password";
      eyeIcon.className = "fas fa-eye";
    }
  });
}

const signUpForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const signUpEmail = document.getElementById("signup-email");
const loginEmail = document.getElementById("login-email");
const forgotPassword = document.getElementById("forgot-password");
const checkBox = document.getElementById("remember-me");

signUpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const email = signUpEmail.value;
  const password = signUpPassword.value;
  const username = document.getElementById("sign-up-username").value;
  const displayName =
    document.getElementById("sign-up-display-name").value.trim() || username;

  fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, username, displayName }),
  })
    .then((response) => {
      if (response.status === 400) {
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
    .then((data) => {
      // Handle response
      window.location.href = "/"; // Redirect to homepage
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const email = loginEmail.value;
  const password = loginPassword.value;
  const rememberMe = document.getElementById("remember-me").checked;

  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, rememberMe }),
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
    .then((data) => {
      // Store user data in local storage
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/"; // Redirect to homepage
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

forgotPassword.addEventListener("click", function (e) {
  e.preventDefault();
  const email = loginEmail.value;

  fetch("/api/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
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
    .then((data) => {
      // Handle response
      alert("Password reset email sent!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
