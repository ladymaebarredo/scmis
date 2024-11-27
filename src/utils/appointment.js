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

//import { createNotification } from "../utils/notifications";

// Create a new appointment directly in the "appointments" collection
export const createAppointment = async (
  workerType,
  workerId,
  message,
  selectedDay,
  selectedTime,
  selectedDate,
  userId,
  fullname
) => {
  try {
    // Create a reference to the appointments collection
    const appointmentsRef = collection(db, "appointments");

    // Check for existing "Pending" appointments for the user
    const q = query(
      appointmentsRef,
      where("userId", "==", userId),
      where("appointmentStatus", "==", "Pending")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // User already has a "Pending" appointment
      return {
        success: false,
        message: "You already have a pending appointment.",
      };
    }

    // Add a new appointment document to the appointments collection
    const appointment = await addDoc(appointmentsRef, {
      workerType,
      workerId,
      message,
      selectedDay,
      selectedTime,
      selectedDate,
      userId,
      appointee: fullname,
      appointmentStatus: workerType == "Nurse" ? "Approved" : "Pending",
      createdAt: serverTimestamp(),
    });

    return { success: true, message: appointment.id };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      message: "An error occurred while creating the appointment.",
    };
  }
};

// Get all appointments for a specific worker
export const getAppointments = async (typeId, type) => {
  try {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where(type, "==", typeId)
    );
    const querySnapshot = await getDocs(appointmentsQuery);
    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error fetching worker's appointments:", error);
    return [];
  }
};

export const updateStatus = async (id, status) => {
  try {
    const ref = doc(db, "appointments", id);
    await updateDoc(ref, { appointmentStatus: status });
    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    // Get the reference to the appointments collection
    const appointmentsCollection = collection(db, "appointments");
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

export const getApprovedAppointments = async (workerId) => {
  try {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("workerId", "==", workerId),
      where("appointmentStatus", "==", "Approved")
    );
    const querySnapshot = await getDocs(appointmentsQuery);
    const appointments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return appointments;
  } catch (error) {
    console.error("Error fetching worker's appointments:", error);
    return [];
  }
};

export const getAppointment = async (appointmentId) => {
  try {
    const appointmentDoc = await getDoc(doc(db, "appointments", appointmentId));
    if (appointmentDoc.exists()) {
      return {
        id: appointmentDoc.id,
        ...appointmentDoc.data(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching worker's appointments:", error);
    return null;
  }
};

export const countByDate = async (date, workerType) => {
  try {
    // Reference the appointments collection
    const appointmentsRef = collection(db, "appointments");

    // Query documents where the selectedDate matches the passed date
    const q = query(
      appointmentsRef,
      where("selectedDate", "==", date),
      where("appointmentStatus", "in", ["Pending", "Approved"]),
      where("workerType", "==", workerType)
    );

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    // Return the count of matching documents
    return querySnapshot.size;
  } catch (error) {
    console.error("Error counting appointments by date:", error);
    throw error; // Rethrow error for the caller to handle
  }
};
