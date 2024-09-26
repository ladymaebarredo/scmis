import { db } from "./firebase"; // Adjust this import to your Firebase config file
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export const createDiagnostic = async (appointmentId, message, medicines) => {
  try {
    await addDoc(collection(db, "diagnostics"), {
      appointmentId,
      message,
      medicines,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      message: "An error occurred while creating the diagnostic.",
    };
  }
};

export const getDiagnostic = async (appointmentId) => {
  try {
    const diagnosticQuery = query(
      collection(db, "diagnostics"),
      where("appointmentId", "==", appointmentId)
    );
    const querySnapshot = await getDocs(diagnosticQuery);
    if (!querySnapshot.empty) {
      const diagnosticDoc = querySnapshot.docs[0];
      return {
        message: diagnosticDoc.data().message,
        medicines: diagnosticDoc.data().medicines,
      };
    } else {
      return null; // Return null if no document matches
    }
  } catch (error) {
    console.error("Error fetching diagnostic:", error);
    return null;
  }
};
