// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd6mSNvPDbEpTDMythYZx5_KnU_E7wvLM",
  authDomain: "licenta-auth-30204.firebaseapp.com",
  projectId: "licenta-auth-30204",
  storageBucket: "licenta-auth-30204.appspot.com",
  messagingSenderId: "947575282461",
  appId: "1:947575282461:web:e5fcd5205e755d4af9dff4"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth()
const db = firebase.firestore();
export { auth, db }