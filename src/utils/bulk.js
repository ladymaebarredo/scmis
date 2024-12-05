import { db } from "../utils/firebase"; // Import Firestore instance
import { collection, getDocs } from "firebase/firestore";

/**
 * Fetches all documents from a specified Firestore collection in bulk.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of documents.
 */
export const getAllBulk = async () => {
  try {
    const collectionRef = collection(db, "bulkCertificate"); // Replace with your collection name
    const snapshot = await getDocs(collectionRef);

    // Map over the documents to create a structured array
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data; // Return the array of documents
  } catch (error) {
    console.error("Error fetching bulk data:", error);
    throw new Error("Failed to fetch bulk data");
  }
};
