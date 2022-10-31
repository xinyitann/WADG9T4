// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC6FeItoMxFnT9yIv5F8zukSMvhnZrH0YU",
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
// Initialize variables
// import { getDatabase, ref, onValue } from "firebase/database";
// import { getAuth } from "firebase/auth";
// import { getAuth } from "firebase/auth";
const auth = firebase.auth()
const database = firebase.database()


// Set up our register function
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  full_name = document.getElementById('full_name').value
  // favourite_song = document.getElementById('favourite_song').value
  // milk_before_cereal = document.getElementById('milk_before_cereal').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  if (validate_field(full_name) == false ) {
    alert('One or More Extra Fields is Outta Line!!')
    return
  }
 
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      full_name : full_name,
      // favourite_song : favourite_song,
      // milk_before_cereal : milk_before_cereal,
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // DOne
    alert('User Created!!')
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // DOne
    alert('User Logged In!!')
    window.location.replace("./index.html");

  })
  .catch(function(error) {
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

if (login){
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



//   // Revoke all refresh tokens for a specified user for whatever reason.
// // Retrieve the timestamp of the revocation, in seconds since the epoch.
// getAuth()
// .revokeRefreshTokens(uid)
// .then(() => {
//   return getAuth().getUser(uid);
// })
// .then((userRecord) => {
//   return new Date(userRecord.tokensValidAfterTime).getTime() / 1000;
// })
// .then((timestamp) => {
//   console.log(`Tokens revoked at: ${timestamp}`);
// });

// const metadataRef = getDatabase().ref('metadata/' + uid);
// metadataRef.set({ revokeTime: utcRevocationTimeSecs }).then(() => {
//   console.log('Database updated successfully.');
// });

// // Verify the ID token while checking if the token is revoked by passing
// // checkRevoked true.
// let checkRevoked = true;
// getAuth()
//   .verifyIdToken(idToken, checkRevoked)
//   .then((payload) => {
//     // Token is valid.
//   })
//   .catch((error) => {
//     if (error.code == 'auth/id-token-revoked') {
//       // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
//     } else {
//       // Token is invalid.
//     }
//   });

//   function onIdTokenRevocation() {
//     // For an email/password user. Prompt the user for the password again.
//     let password = prompt('Please provide your password for reauthentication');
//     let credential = firebase.auth.EmailAuthProvider.credential(
//         firebase.auth().currentUser.email, password);
//     firebase.auth().currentUser.reauthenticateWithCredential(credential)
//       .then(result => {
//         // User successfully reauthenticated. New ID tokens should be valid.
//       })
//       .catch(error => {
//         // An error occurred.
//       });
//   }

//   firebase.initializeApp({
//     apiKey: "AIzaSyC6FeItoMxFnT9yIv5F8zukSMvhnZrH0YU",
//   authDomain: "onestopper.firebaseapp.com"
//   });
  
//   // As httpOnly cookies are to be used, do not persist any state client side.
//   firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  
//   // When the user signs in with email and password.
//   firebase.auth().signInWithEmailAndPassword('user@example.com', 'password').then(user => {
//     // Get the user's ID token as it is needed to exchange for a session cookie.
//     return user.getIdToken().then(idToken => {
//       // Session login endpoint is queried and the session cookie is set.
//       // CSRF protection should be taken into account.
//       // ...
//       const csrfToken = getCookie('csrfToken')
//       return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken);
//     });
//   }).then(() => {
//     // A page redirect would suffice as the persistence is set to NONE.
//     return firebase.auth().signOut();
//   }).then(() => {
//     window.location.assign('/profile');
//   });

//   app.post('/sessionLogin', (req, res) => {
//     // Get the ID token passed and the CSRF token.
//     const idToken = req.body.idToken.toString();
//     const csrfToken = req.body.csrfToken.toString();
//     // Guard against CSRF attacks.
//     if (csrfToken !== req.cookies.csrfToken) {
//       res.status(401).send('UNAUTHORIZED REQUEST!');
//       return;
//     }
//     // Set session expiration to 5 days.
//     const expiresIn = 60 * 60 * 24 * 5 * 1000;
//     // Create the session cookie. This will also verify the ID token in the process.
//     // The session cookie will have the same claims as the ID token.
//     // To only allow session cookie setting on recent sign-in, auth_time in ID token
//     // can be checked to ensure user was recently signed in before creating a session cookie.
//     getAuth()
//       .createSessionCookie(idToken, { expiresIn })
//       .then(
//         (sessionCookie) => {
//           // Set cookie policy for session cookie.
//           const options = { maxAge: expiresIn, httpOnly: true, secure: true };
//           res.cookie('session', sessionCookie, options);
//           res.end(JSON.stringify({ status: 'success' }));
//         },
//         (error) => {
//           res.status(401).send('UNAUTHORIZED REQUEST!');
//         }
//       );
//   });

//   getAuth()
//   .verifyIdToken(idToken)
//   .then((decodedIdToken) => {
//     // Only process if the user just signed in in the last 5 minutes.
//     if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
//       // Create session cookie and set it.
//       return getAuth().createSessionCookie(idToken, { expiresIn });
//     }
//     // A user that was not recently signed in is trying to set a session cookie.
//     // To guard against ID token theft, require re-authentication.
//     res.status(401).send('Recent sign in required!');
//   });

//   // Whenever a user is accessing restricted content that requires authentication.
// app.post('/profile', (req, res) => {
//   const sessionCookie = req.cookies.session || '';
//   // Verify the session cookie. In this case an additional check is added to detect
//   // if the user's Firebase session was revoked, user deleted/disabled, etc.
//   getAuth()
//     .verifySessionCookie(sessionCookie, true /** checkRevoked */)
//     .then((decodedClaims) => {
//       serveContentForUser('/profile', req, res, decodedClaims);
//     })
//     .catch((error) => {
//       // Session cookie is unavailable or invalid. Force user to login.
//       res.redirect('/login');
//     });
// });

// getAuth()
//   .verifySessionCookie(sessionCookie, true)
//   .then((decodedClaims) => {
//     // Check custom claims to confirm user is an admin.
//     if (decodedClaims.admin === true) {
//       return serveContentForAdmin('/admin', req, res, decodedClaims);
//     }
//     res.status(401).send('UNAUTHORIZED REQUEST!');
//   })
//   .catch((error) => {
//     // Session cookie is unavailable or invalid. Force user to login.
//     res.redirect('/login');
//   });

//   app.post('/sessionLogout', (req, res) => {
//     res.clearCookie('session');
//     res.redirect('/login');
//   });