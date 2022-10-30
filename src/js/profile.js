// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyC6FeItoMxFnT9yIv5F8zukSMvhnZrH0YU",
//   authDomain: "onestopper.firebaseapp.com",
//   databaseURL: "https://onestopper-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "onestopper",
//   storageBucket: "onestopper.appspot.com",
//   messagingSenderId: "64753765868",
//   appId: "1:64753765868:web:2f5a596f8d4a62d0e9c4c9",
//   measurementId: "G-DE6MGV1BWE"
// };
// // Initialize Firebase


var app = Vue.createApp({
  data() {
      return {
        username:'',
        name:'',
        email:'',
        saved:'',
        


      }
  },

  methods:{
 
    getData(){
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }
   
  }

})
app.mount("#app")