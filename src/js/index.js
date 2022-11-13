// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBhPWm941iBnBVNjMW3zV43xfoIxq7BhWM",
  authDomain: "onestopper.firebaseapp.com",
  databaseURL: "https://onestopper-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "onestopper",
  storageBucket: "onestopper.appspot.com",
  messagingSenderId: "64753765868",
  appId: "1:64753765868:web:2f5a596f8d4a62d0e9c4c9",
  measurementId: "G-DE6MGV1BWE"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth()
const database = firebase.database()


// Set up our register function
function register() {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  username = document.getElementById('username').value


  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is not valid!')
    return
    // Don't continue running the code
  }
  if (validate_field(username) == false) {
    alert('One or More Extra Fields is not valid!')
    return
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser

      // Add this user to Firebase Database
      var database_ref = database.ref()

      // Create User data
      var user_data = {
        email: email,
        username: username,
        uid: user.uid,
        last_login: Date.now()
      }

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
      // DOne
      alert('User Created!!')
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message

      alert(error_message)
    })
}

// Set up our login function
function login() {
  // Get all our input fields
  email = document.getElementById('email2').value
  password = document.getElementById('password2').value
  username = document.getElementById('username2').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is not valid!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser

      // Add this user to Firebase Database
      var database_ref = database.ref()

      var user_routes = []
      // Create User data
      var user_data = {
        email: email,
        username: username,
        uid: user.uid,
        last_login: Date.now()
      }

      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)

      // DOne
      alert('User Logged In!!')
      firebase.database().ref('users/' + user.uid).once("value", snap => {

        localStorage.setItem("users", JSON.stringify(snap.val()));
        window.location.replace("./index.html");

      })
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message

      alert(error_message)
    })
}


// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}

if (login) {
  getAuth()
    .getUser(uid)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
    });
}


getAuth()
  .getUserByEmail(email)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });


function getDirections() {
  console.log('getting directions')
}


function update_email_index(email, uid) {
  const user = auth.currentUser;

  user.updateEmail(email).then(() => {
    console.log('success')
    firebase.database().ref('users/' + uid).once("value", snap => {
      bus_stops = snap.val().email
      var users = firebase.database().ref('users');
      var email = document.getElementById('email').value
      var updates = {};
      updates['/users/' + uid + "/" + 'email'] = email;
      firebase.database().ref().update(updates);
      get_data()
    })
  }).catch((error) => {
    console.log('sorry didnt work', error)
    return 'error'
  });
}