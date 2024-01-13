import {
  auth,
  db,
  set,
  ref,
  get,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  browserLocalPersistence,
  browserSessionPersistence
} from '../firebaseConfig.js'

const signUpPassword = document.getElementById('signup-password')
const loginPassword = document.getElementById('login-password')
export function initStyle () {
  const loginBtn = document.querySelector('#login')
  const signupBtn = document.querySelector('#signup')
  const signUpToggleBtn = document.getElementById('toggle-signup-password')
  const loginToggleBtn = document.getElementById('toggle-login-password')
  window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search)
    const formToShow = urlParams.get('form')
    if (formToShow === 'login') {
      document.getElementById('login').click()
    } else if (formToShow === 'signup') {
      document.getElementById('signup').click()
    }
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      window.location.href = './index.html'
    }
  })

  loginBtn.addEventListener('click', e => {
    let parent = e.target.parentNode.parentNode
    Array.from(e.target.parentNode.parentNode.classList).find(element => {
      if (
        element !== 'slide-up' &&
        !signupBtn.parentNode.classList.contains('slide-up')
      ) {
        parent.classList.add('slide-up')
      } else if (element === 'slide-up') {
        signupBtn.parentNode.classList.add('slide-up')
        parent.classList.remove('slide-up')
      }
    })
  })

  signupBtn.addEventListener('click', e => {
    let parent = e.target.parentNode
    Array.from(e.target.parentNode.classList).find(element => {
      if (
        element !== 'slide-up' &&
        !loginBtn.parentNode.parentNode.classList.contains('slide-up')
      ) {
        parent.classList.add('slide-up')
      } else if (element === 'slide-up') {
        loginBtn.parentNode.parentNode.classList.add('slide-up')
        parent.classList.remove('slide-up')
      }
    })
  })

  addTogglePasswordEventListener(
    loginToggleBtn,
    loginPassword,
    'eye-icon-login'
  )
  addTogglePasswordEventListener(
    signUpToggleBtn,
    signUpPassword,
    'eye-icon-signup'
  )
}
function addTogglePasswordEventListener (button, input, eyeIconId) {
  var eyeIcon = document.getElementById(eyeIconId)
  /*
  button.addEventListener("mousedown", function () {
    input.type = "text";
    eyeIcon.className = "fas fa-eye-slash";
  });
  button.addEventListener("mouseup", function () {
    input.type = "password";
    eyeIcon.className = "fas fa-eye";
  });
  button.addEventListener("mouseout", function () {
    input.type = "password";
    eyeIcon.className = "fas fa-eye";
  });
*/

  button.addEventListener('click', function () {
    if (input.type === 'password') {
      input.type = 'text'
      eyeIcon.className = 'fas fa-eye-slash'
    } else {
      input.type = 'password'
      eyeIcon.className = 'fas fa-eye'
    }
  })
}

export function initAuth () {
  const signUpForm = document.getElementById('signup-form')
  const loginForm = document.getElementById('login-form')
  const signUpEmail = document.getElementById('signup-email')
  const loginEmail = document.getElementById('login-email')
  const forgotPassword = document.getElementById('forgot-password')
  const checkBox = document.getElementById('remember-me')

  // Authentication logic:

  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = loginEmail.value
    const password = loginPassword.value

    setPersistence(
      auth,
      checkBox.checked ? browserLocalPersistence : browserSessionPersistence
    ).then(() => {
      signInWithEmailAndPassword(auth, email, password).catch(error => {
        alert(error.message)
      })
    })
  })

  forgotPassword.addEventListener('click', function (e) {
    e.preventDefault()
    const email = loginEmail.value
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Password reset email sent!')
      })
      .catch(error => {
        alert(error.message)
      })
  })

  signUpForm.addEventListener('submit', e => {
    e.preventDefault()
    const email = signUpEmail.value
    const password = signUpPassword.value
    const username = document.getElementById('sign-up-username').value
    const displayName =
      document.getElementById('sign-up-display-name').value.trim() || username

    get(ref(db, 'usernames/' + username)).then(snapshot => {
      if (snapshot.exists()) {
        alert('This username is already taken. Please choose a different one.')
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            const user = userCredential.user
            set(ref(db, 'users/' + user.uid), {
              username: username,
              displayName: displayName ?? username,
              email: email,
              role: 'user'
            })
            set(ref(db, 'usernames/' + username), user.uid)
          })
          .catch(error => {
            alert(error.message)
          })
      }
    })
  })
}
// export { auth };
// export { db };
