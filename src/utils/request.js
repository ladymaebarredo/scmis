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

export const createMedkitRequest = async (employeeId, reason, name) => {
  try {
    const requestRef = collection(db, "requests");
    const q = query(
      requestRef,
      where("employeeId", "==", employeeId),
      where("status", "==", "Pending")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        success: false,
        message: "You already have a pending request.",
      };
    }

    // Add a new request document to the requests collection
    const request = await addDoc(requestRef, {
      employeeId,
      reason,
      employeeName: name,
      status: "Pending",
      items: [],
      createdAt: serverTimestamp(),
    });

    await createNotification(
      employeeId,
      "o1jCIz3nAFaETuEvhmIWIIXjBJJ2", // Nurse ID
      `${name} requested a medkit!`,
      `/dashboard/requests/${request.id}`
    );

    return { success: true, message: request.id };
  } catch (error) {
    console.error("Error creating request:", error);
    return {
      success: false,
      message: "An error occurred while creating the request.",
    };
  }
};

export const getRequests = async (employeeId) => {
  try {
    const reqQuery = query(
      collection(db, "requests"),
      where("employeeId", "==", employeeId)
    );
    const querySnapshot = await getDocs(reqQuery);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return requests;
  } catch (error) {
    console.error("Error fetching employee's requests:", error);
    return [];
  }
};

export const getAllRequests = async () => {
  try {
    // Get the reference to the appointments collection
    const appointmentsCollection = collection(db, "requests");
    // Fetch all documents from the appointments collection
    const querySnapshot = await getDocs(appointmentsCollection);

    // Map through the results to format them
    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    return [];
  }
};

export const getRequestsById = async (id) => {
  try {
    const requestDocRef = doc(db, "requests", id);
    const requestDoc = await getDoc(requestDocRef);
    if (requestDoc.exists()) {
      return { id: requestDoc.id, ...requestDoc.data() };
    } else {
      console.warn(`Request with ID: ${id} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching request by ID:", error);
    return null;
  }
};

export const updateMedkitRequestStatus = async (
  requestId,
  newStatus,
  employeeId
) => {
  try {
    // Reference the specific request document
    const requestDocRef = doc(db, "requests", requestId);

    // Update the status field
    await updateDoc(requestDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    // Create a notification for the employee
    let notificationMessage = "";
    if (newStatus === "Approved") {
      notificationMessage = `Your medkit request has been approved!`;
    } else if (newStatus === "Declined") {
      notificationMessage = `Your medkit request has been declined.`;
    } else if (newStatus === "Completed") {
      notificationMessage = `Your medkit request has been completed!`;
    }
    if (notificationMessage) {
      await createNotification(
        "o1jCIz3nAFaETuEvhmIWIIXjBJJ2", // Nurse ID
        employeeId,
        notificationMessage,
        `/dashboard/requests/${requestId}`
      );
    }
    return {
      success: true,
      message: `Request status updated to ${newStatus}.`,
    };
  } catch (error) {
    console.error("Error updating request status:", error);
    return {
      success: false,
      message: "An error occurred while updating the request status.",
    };
  }
};

export const updateMedkitItems = async (id, medkitItems) => {
  try {
    // Reference the specific request document
    const requestDocRef = doc(db, "requests", id);
    // Update the status field
    await updateDoc(requestDocRef, {
      medkitItems,
      updatedAt: serverTimestamp(),
    });

    // Loop through medicines and update their quantities
    for (const med of medkitItems) {
      const { name, quantity } = med;
      // Query the inventory collection for the specific item
      const q = query(
        collection(db, "inventory"),
        where("itemName", "==", name)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming name is unique, process the first matching document
        const docSnapshot = querySnapshot.docs[0];
        const currentQuantity = docSnapshot.data().quantity;

        // Calculate the new quantity
        const newQuantity = Math.max(0, currentQuantity - quantity);
        if (newQuantity == 0) {
          console.log("no stock");
          await createNotification(
            "o1jCIz3nAFaETuEvhmIWIIXjBJJ2",
            "o1jCIz3nAFaETuEvhmIWIIXjBJJ2", // Nurse ID
            `${name} has run out of stock!`,
            `/dashboard/inventory`
          );
        }
        // Update the inventory document
        await updateDoc(docSnapshot.ref, { quantity: newQuantity });
        console.log(`Updated ${name}: New quantity is ${newQuantity}`);
      } else {
        console.warn(`Medicine with name "${name}" not found in inventory.`);
      }
    }

    return {
      success: true,
      message: `Request status updated to ${newStatus}.`,
    };
  } catch (error) {
    console.error("Error updating request status:", error);
    return {
      success: false,
      message: "An error occurred while updating the request status.",
    };
  }
};
