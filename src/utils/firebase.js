import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3obhhJ34S_ERH7CaWHKDqRvlYxDQM56g",
  authDomain: "clinic-f09a9.firebaseapp.com",
  projectId: "clinic-f09a9",
  storageBucket: "clinic-f09a9.firebasestorage.app",
  messagingSenderId: "643032911810",
  appId: "1:643032911810:web:09ae8d039d8a6915d7105b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
