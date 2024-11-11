import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJdyBas7IF4u-rb9cfahCtNHdYlKBfiCc",
  authDomain: "hospital-e5b53.firebaseapp.com",
  projectId: "hospital-e5b53",
  storageBucket: "hospital-e5b53.firebasestorage.app",
  messagingSenderId: "378597547006",
  appId: "1:378597547006:web:ddf94890368f9846d4feaf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
