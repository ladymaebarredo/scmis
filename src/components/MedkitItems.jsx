import { useState, useEffect } from "react";
import { useUser } from "../providers/UserProvider";

export function MedkitItems() {
  const [medkitItems, setMedkitItems] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { user } = useUser();

  // Static list of items
  const items = [
    { id: 1, itemName: "Paracetamol" },
    { id: 2, itemName: "Ibuprofen" },
    { id: 3, itemName: "Amoxicillin" },
    { id: 4, itemName: "Cetirizine" },
    { id: 5, itemName: "Antihistamine" },
    { id: 6, itemName: "Thermometer" },
    { id: 7, itemName: "Face Mask" },
    { id: 8, itemName: "Hand Sanitizer" },
    { id: 9, itemName: "Bandage" },
    { id: 10, itemName: "Gloves" },
  ];

  // Example of initial items (could be fetched from an API or hardcoded)
  const initialMedkitItems = [
    { itemName: "Paracetamol", quantity: 5 },
    { itemName: "Ibuprofen", quantity: 2 },
    { itemName: "Thermometer", quantity: 1 },
  ];

  useEffect(() => {
    // Initialize medkitItems with default items on mount
    setMedkitItems(initialMedkitItems);
  }, []);

  const handleAddItem = () => {
    if (!selectedMedicine || quantity <= 0) return;

    const existingItem = medkitItems.find(
      (item) => item.itemName === selectedMedicine
    );

    if (existingItem) {
      // Update quantity if item already exists
      setMedkitItems((prev) =>
        prev.map((item) =>
          item.itemName === selectedMedicine
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item
      setMedkitItems((prev) => [
        ...prev,
        { itemName: selectedMedicine, quantity },
      ]);
    }

    // Reset selected item and quantity
    setSelectedMedicine("");
    setQuantity(1);
  };

  const handleRemoveItem = (itemName) => {
    setMedkitItems((prev) => prev.filter((item) => item.itemName !== itemName));
  };

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Medkit Items</h2>
      {user?.data?.role === "WORKER" ? (
        <div className="flex items-center mb-4">
          <select
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            className="mr-2 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.itemName}>
                {item.itemName}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mr-2 w-16 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-gray-500">
            You do not have permission to add or edit items.
          </p>
        </div>
      )}

      <div className="medicines-area-box mb-4">
        <h3 className="text-lg font-semibold mb-2">Selected Items</h3>
        {medkitItems.length === 0 ? (
          <p className="text-gray-500">No items added.</p>
        ) : (
          medkitItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded-md mb-2"
            >
              <span>
                {item.itemName} (Quantity: {item.quantity})
              </span>
              {user?.data?.role === "WORKER" && (
                <button
                  onClick={() => handleRemoveItem(item.itemName)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
