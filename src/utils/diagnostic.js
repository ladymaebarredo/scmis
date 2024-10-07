import { db } from "./firebase"; // Adjust this import to your Firebase config file
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export const assignDiagnostic = async (appointmentId, message, medicines) => {
  try {
    // Create a reference to the document
    const docRef = doc(db, "diagnostics", appointmentId);
    await setDoc(docRef, {
      appointmentId,
      message,
      medicines,
      createdAt: serverTimestamp(),
    });
    console.log("Document successfully created/updated!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

export const getDiagnostic = async (appointmentId) => {
  try {
    // Create a reference to the document
    const docRef = doc(db, "diagnostics", appointmentId);
    // Get the document snapshot
    const docSnap = await getDoc(docRef);
    // Check if the document exists
    if (docSnap.exists()) {
      // Return the document data
      return docSnap.data();
    } else {
      console.log("No such diagnostic!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching diagnostic: ", error);
    throw error; // Propagate the error for further handling if necessary
  }
};
