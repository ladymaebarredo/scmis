import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  limit,
} from "firebase/firestore";

export const createWorker = async (
  firstname,
  middlename,
  lastname,
  workerId,
  workerType,
  id
) => {
  try {
    await setDoc(doc(db, "workers", id), {
      id,
      firstname,
      middlename,
      lastname,
      workerId,
      workerType,
    });
    await updateDoc(doc(db, "users", id), {
      onboarded: true,
    });
    return { success: true, message: "Success" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getWorkerByType = async (workerType) => {
  try {
    const q = query(
      collection(db, "workers"),
      where("workerType", "==", workerType),
      limit(1) // Limit the query to only return one document
    );
    const querySnapshot = await getDocs(q);

    // Return the first worker (if available)
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]; // Get the first document
      return { id: doc.id, ...doc.data() }; // Return the worker's data
    } else {
      return null; // Return null if no worker is found
    }
  } catch (error) {
    console.error("Error fetching worker:", error);
    return null; // Return null if an error occurs
  }
};
