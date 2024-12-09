import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBknNU2TGixvmIwX_isRFYFyzXm7G8hoaE",
  authDomain: "oims-17cde.firebaseapp.com",
  projectId: "oims-17cde",
  storageBucket: "oims-17cde.appspot.com",
  messagingSenderId: "920624302613",
  appId: "1:920624302613:web:4d5ab2bc3f6e63e2d81c1c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
