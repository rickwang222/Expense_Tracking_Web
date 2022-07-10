// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBEBHax-cZX8PS4w_sXVVn3WQfFLnVlMs",
  authDomain: "sccproject2.firebaseapp.com",
  projectId: "sccproject2",
  storageBucket: "sccproject2.appspot.com",
  messagingSenderId: "77550615026",
  appId: "1:77550615026:web:884ccfeb3411636e55136b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initalize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();