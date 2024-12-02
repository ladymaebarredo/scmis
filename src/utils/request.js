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
      { wow: "wow" }
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
        { type: "request-status", requestId }
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
