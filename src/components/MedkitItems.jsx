import { useState, useEffect } from "react";
import { useUser } from "../providers/UserProvider";
import { getItems } from "../utils/inventory";
import { updateMedkitItems } from "../utils/request";

export function MedkitItems({ initialItems, requestId }) {
  const [medkitItems, setMedkitItems] = useState(initialItems);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [items, setItems] = useState([]);

  async function fetchItems() {
    setItems(await getItems());
  }

  const { user } = useUser();

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = () => {
    if (!selectedMedicine || quantity <= 0) return;

    const existingItem = medkitItems.find(
      (item) => item.name === selectedMedicine
    );

    if (existingItem) {
      // Update quantity if item already exists
      setMedkitItems((prev) =>
        prev.map((item) =>
          item.name === selectedMedicine
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item
      setMedkitItems((prev) => [...prev, { name: selectedMedicine, quantity }]);
    }

    // Reset selected item and quantity
    setSelectedMedicine("");
    setQuantity(1);
  };

  const handleRemoveItem = (name) => {
    setMedkitItems((prev) => prev.filter((item) => item.name !== name));
  };

  const handleSave = async () => {
    await updateMedkitItems(requestId, medkitItems);
    alert("Saved");
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
              <option key={item.id} value={item.itemName} className="p-5">
                {item.itemName} x {item.quantity} ({item.itemType})
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
                {item.name} (Quantity: {item.quantity})
              </span>
              {user?.data?.role === "WORKER" && (
                <button
                  onClick={() => handleRemoveItem(item.name)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
      {user?.data?.role === "WORKER" && (
        <button
          onClick={() => handleSave()}
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Save
        </button>
      )}
    </section>
  );
}
