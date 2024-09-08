import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMAiSpn5hCT3TqZ23dU2F4ioEOYe6SDnU",
  authDomain: "clinic-60447.firebaseapp.com",
  projectId: "clinic-60447",
  storageBucket: "clinic-60447.appspot.com",
  messagingSenderId: "1013358005222",
  appId: "1:1013358005222:web:1ab75b2a4dfd5af557a427",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
