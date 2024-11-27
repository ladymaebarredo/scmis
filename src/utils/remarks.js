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

export const assignRemarks = async (appointmentId, remarks) => {
  try {
    // Create a reference to the diagnostic document
    const docRef = doc(db, "remarks", appointmentId);
    await setDoc(docRef, {
      appointmentId,
      message: remarks,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
  }
};

export const getRemarks = async (appointmentId) => {
  try {
    // Create a reference to the document
    const docRef = doc(db, "remarks", appointmentId);
    // Get the document snapshot
    const docSnap = await getDoc(docRef);
    // Check if the document exists
    if (docSnap.exists()) {
      // Return the document data
      return docSnap.data();
    } else {
      console.log("No such remarks!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching remarks: ", error);
    throw error; // Propagate the error for further handling if necessary
  }
};
