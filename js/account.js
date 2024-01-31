import {
  db,
  ref,
  onValue,
  auth,
 } from "../firebaseConfig.js";
 window.onload = function() {
   // Fetch the quote
   fetch('https://api.api-ninjas.com/v1/quotes?category=success ',  {
     headers: {
       'X-Api-Key': 'HryCEQiWRyu6/1GwJK97tg==6kLOejxBWkQVeHdv'
 
     }
   })
   .then(response => response.json())
   .then(data => {
     document.getElementById('quote').innerText = data[0].quote;
     document.getElementById('author').innerText = data[0].author;
   })
   .catch(error => console.error(error));
 
 }
 
 
 
 auth.onAuthStateChanged(user => {
   if (user) {
     // User is signed in.
     const userRef = ref(db, 'userSettings/' + user.uid);
 
     onValue(userRef, snapshot => {
       const data = snapshot.val();
       const userDisplayName = data.displayName;
       document.getElementById('display-name').innerText = userDisplayName;
 });
   
   } else {
     // No user is signed in.
   }
 });

 
 
 
 
 