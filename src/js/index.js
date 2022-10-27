

const firebaseConfig = {
  apiKey: "AIzaSyC6FeItoMxFnT9yIv5F8zukSMvhnZrH0YU",
  authDomain: "onestopper.firebaseapp.com",
  databaseURL: "https://onestopper-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "onestopper",
  storageBucket: "onestopper.appspot.com",
  messagingSenderId: "64753765868",
  appId: "1:64753765868:web:2f5a596f8d4a62d0e9c4c9",
  measurementId: "G-DE6MGV1BWE"
};

firebase.initializeApp(firebaseConfig);


// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// choose Google Authentication
ui.start('#firebaseui-auth-container', {
signInOptions: [
  // List of OAuth providers supported.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  //firebase.auth.GithubAuthProvider.PROVIDER_ID
],
// Other config options...
});

var uiConfig = {
callbacks: {
  signInSuccessWithAuthResult: function(authResult, redirectUrl) {
    // User successfully signed in.
    // Return type determines whether we continue the redirect automatically
    // or whether we leave that to developer to handle.
    return true;
  },
  uiShown: function() {
    // The widget is rendered.
    // Hide the loader.
    document.getElementById('loader').style.display = 'none';
  }
},
// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
signInFlow: 'popup',
signInSuccessUrl: '<url-to-redirect-to-on-success>',
signInOptions: [
  // Leave the lines as is for the providers you want to offer your users.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  //firebase.auth.GithubAuthProvider.PROVIDER_ID,
  //firebase.auth.EmailAuthProvider.PROVIDER_ID,
  //firebase.auth.PhoneAuthProvider.PROVIDER_ID
],
// Terms of service url.
tosUrl: '<your-tos-url>',
// Privacy policy url.
privacyPolicyUrl: '<your-privacy-policy-url>'
};

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
     