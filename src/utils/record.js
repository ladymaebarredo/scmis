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

export const assignRecord = async (data, userId, studentId) => {
  try {
    // Create a reference to the document
    const docRef = doc(db, "records", userId);
    await setDoc(docRef, { ...data, studentId });
    console.log("Document successfully created/updated!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

export const getRecord = async (userId) => {
  try {
    const recordDoc = await getDoc(doc(db, "records", userId));
    return recordDoc.data();
  } catch (e) {
    // Handle any errors
    console.error("Error fetching record:", e);
    return null;
  }
};

export const getStudentRecord = async (studentId) => {
  try {
    const recordsCollection = collection(db, "records");
    const q = query(recordsCollection, where("studentId", "==", studentId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming only one document matches the studentId
      return querySnapshot.docs[0].data();
    } else {
      console.warn("No record found for the given studentId.");
      return null;
    }
  } catch (e) {
    console.error("Error fetching record:", e);
    return null;
  }
};
