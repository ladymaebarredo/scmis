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

export const getWorkersByType = async (workerType) => {
  try {
    const q = query(
      collection(db, "workers"),
      where("workerType", "==", workerType)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching workers:", error);
    return [];
  }
};
