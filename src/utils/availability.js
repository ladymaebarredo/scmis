import { db } from "./firebase"; // Adjust this import to your Firebase config file
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export const assignAvailability = async (data, userId) => {
  try {
    // Create a reference to the document
    const docRef = doc(db, "availability", userId);
    await setDoc(docRef, data);
    console.log("Document successfully created/updated!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

export const getAvailability = async (userId) => {
  try {
    const recordDoc = await getDoc(doc(db, "availability", userId));
    return recordDoc.data();
  } catch (e) {
    // Handle any errors
    console.error("Error fetching record:", e);
    return null;
  }
};
