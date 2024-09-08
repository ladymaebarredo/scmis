import { db } from "./firebase"; // Adjust this import to your Firebase config file
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Create a new appointment directly in the "appointments" collection
export const createAppointment = async (
  workerType,
  workerId,
  message,
  userId
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
      userId,
      appointmentStatus: "Pending",
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
    // Query the appointments collection for the specific worker
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where(type, "==", typeId)
    );
    // Execute the query
    const querySnapshot = await getDocs(appointmentsQuery);
    // Map through the results to format them
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
