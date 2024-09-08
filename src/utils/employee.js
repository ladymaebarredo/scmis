import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const createEmployee = async (
  firstname,
  middlename,
  lastname,
  employeeId,
  employeeType,
  assignment,
  id
) => {
  try {
    await setDoc(doc(db, "employees", id), {
      id,
      firstname,
      middlename,
      lastname,
      employeeId,
      employeeType,
      assignment,
    });
    await updateDoc(doc(db, "users", id), {
      onboarded: true,
    });
    return { success: true, message: "Success" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
