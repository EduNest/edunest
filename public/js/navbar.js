const signOutBtn = document.getElementById("sign-out-btn");

if (signOutBtn) {
  signOutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    fetch("/api/logout", {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
