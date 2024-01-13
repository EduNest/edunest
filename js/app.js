document.getElementById('menu').addEventListener('click', function(event) {
    var target = event.target;
    var pageMap = {
        'Home': '/homepage.html',
        'Quizzes': '/quiz.html',
        'Assignments': '/assignment.html',
        'Logout': '/index.html'
    };
    if (pageMap[target.textContent]) {
        window.location.href = pageMap[target.textContent];
    }
});
