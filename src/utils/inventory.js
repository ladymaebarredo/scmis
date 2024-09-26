import { db } from "./firebase"; // Adjust this import to your Firebase config file
import {
  doc,
  collection,
  collectionGroup,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export const updateItem = async (
  id,
  itemName,
  itemType,
  itemBrand,
  supplier,
  quantity,
  expiryDate
) => {
  try {
    await updateDoc(doc(db, "inventory", id), {
      itemName,
      itemType,
      itemBrand,
      supplier,
      quantity,
      expiryDate,
      updatedAt: serverTimestamp(),
    });
    return { success: true, message: "Item updated successfully." };
  } catch (error) {
    console.error("Error updating item:", error);
    return {
      success: false,
      message: "An error occurred while updating the item.",
    };
  }
};

export const createItem = async (
  itemName,
  itemType,
  itemBrand,
  supplier,
  quantity,
  expiryDate
) => {
  try {
    await addDoc(collection(db, "inventory"), {
      itemName,
      itemType,
      itemBrand,
      supplier,
      quantity,
      expiryDate,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Item created successfully." };
  } catch (error) {
    console.error("Error creating item:", error);
    return {
      success: false,
      message: "An error occurred while creating the item.",
    };
  }
};

export const getItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const getMedicines = async () => {
  try {
    // Query the appointments collection for the specific worker
    const inventoryQuery = query(
      collection(db, "inventory"),
      where("itemType", "==", "Medicine")
    );
    // Execute the query
    const querySnapshot = await getDocs(inventoryQuery);
    // Map through the results to format them
    const inventory = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return inventory;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}
