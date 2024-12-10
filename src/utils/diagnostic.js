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
import { createNotification } from "./notifications";
import { nurseId } from "./globals";

export const assignDiagnostic = async (
  appointmentId,
  message,
  medicines,
  bloodPressure,
  temperature
) => {
  try {
    // Create a reference to the diagnostic document
    const docRef = doc(db, "diagnostics", appointmentId);
    await setDoc(docRef, {
      appointmentId,
      message,
      medicines,
      bloodPressure,
      temperature,
      createdAt: serverTimestamp(),
    });

    // Loop through medicines and update their quantities
    for (const med of medicines) {
      const { itemName, quantity } = med;
      // Query the inventory collection for the specific item
      const q = query(
        collection(db, "inventory"),
        where("itemName", "==", itemName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming itemName is unique, process the first matching document
        const docSnapshot = querySnapshot.docs[0];
        const currentQuantity = docSnapshot.data().quantity;

        // Calculate the new quantity
        const newQuantity = Math.max(0, currentQuantity - quantity);
        if (newQuantity == 0) {
          console.log("no stock");
          await createNotification(
            nurseId,
            nurseId, // Nurse ID
            `${itemName} has run out of stock!`,
            `/dashboard/inventory`
          );
        }
        // Update the inventory document
        await updateDoc(docSnapshot.ref, { quantity: newQuantity });
        console.log(`Updated ${itemName}: New quantity is ${newQuantity}`);
      } else {
        console.warn(
          `Medicine with name "${itemName}" not found in inventory.`
        );
      }
    }
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

export const getAllDiagnostics = async () => {
  try {
    // Create a reference to the diagnostics collection
    const diagnosticsRef = collection(db, "diagnostics");
    // Get the collection snapshot
    const querySnapshot = await getDocs(diagnosticsRef);

    // Create an array to store the diagnostics data
    const diagnostics = [];

    // Loop through the documents and extract the data
    querySnapshot.forEach((doc) => {
      diagnostics.push({ id: doc.id, ...doc.data() });
    });

    // Return the array of diagnostics
    return diagnostics;
  } catch (error) {
    console.error("Error fetching diagnostics: ", error);
    throw error; // Propagate the error for further handling if necessary
  }
};
