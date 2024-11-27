import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";

export const createStudent = async (
  firstname,
  middlename,
  lastname,
  studentId,
  department,
  program,
  yearLevel,
  id
) => {
  try {
    await setDoc(doc(db, "students", id), {
      id,
      firstname,
      middlename,
      lastname,
      studentId,
      department,
      program,
      yearLevel,
    });
    await updateDoc(doc(db, "users", id), {
      onboarded: true,
    });
    return { success: true, message: "Success" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getStudents = async (department) => {
  try {
    // Reference the appointments collection
    const studentsRef = collection(db, "students");

    // Query documents where the selectedDate matches the passed date
    const q = query(studentsRef, where("department", "==", department));

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersData;
  } catch (error) {
    console.error("Error counting appointments by date:", error);
    throw error; // Rethrow error for the caller to handle
  }
};
