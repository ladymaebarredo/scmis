import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";

// Login with email and password
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, message: "Login Success" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unknown error occurred." };
  }
};

export const getUser = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    // Check if the document exists
    if (userDoc.exists()) {
      const userData = {
        id: userDoc.id,
        data: userDoc.data(),
      };
      return userData;
    } else {
      // Document does not exist
      return null;
    }
  } catch (e) {
    // Handle any errors
    console.error("Error fetching user:", e);
    return null;
  }
};

export const getUsersData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersData;
  } catch (e) {
    console.error("Error fetching users data:", e);
    return [];
  }
};

export const getUserData = async (uid, role) => {
  try {
    const collectionName =
      role === "STUDENT"
        ? "students"
        : role === "EMPLOYEE"
        ? "employees"
        : "workers";

    const userDoc = await getDoc(doc(db, collectionName, uid));
    const userData = userDoc.data();
    return userData;
  } catch (e) {
    console.error("Error fetching user data:", e);
    return null;
  }
};

export const register = async (email, password, role) => {
  let userCredential;
  try {
    // Register the user with email and password
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    return { success: false, message: error.message };
  }
  try {
    const userData = {
      email: email,
      role: role,
      createdAt: new Date().toISOString(),
      onboarded: false,
    };
    // Store the user data in Firestore using the uid as the document ID
    await setDoc(doc(db, "users", userCredential.user.uid), userData);
  } catch (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Register Success" };
};
