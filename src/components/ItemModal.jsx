import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createItem, updateItem } from "../utils/inventory"; // Assuming you have an updateItem function

export function ItemModal({ onClose, item, revalidate }) {
  // 'item' prop for editing
  const [itemName, setItemName] = useState(item?.itemName || "");
  const [itemType, setItemType] = useState(item?.itemType || "");
  const [itemBrand, setItemBrand] = useState(item?.itemBrand || "");
  const [supplier, setSupplier] = useState(item?.supplier || "");
  const [quantity, setQuantity] = useState(item?.quantity || 0);
  const [expiryDate, setExpiryDate] = useState(item?.expiryDate || "");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = item
        ? await updateItem(
            item.id,
            itemName,
            itemType,
            itemBrand,
            supplier,
            quantity,
            expiryDate
          ) // Update existing item
        : await createItem(
            itemName,
            itemType,
            itemBrand,
            supplier,
            quantity,
            expiryDate
          ); // Create new item

      if (res.success) {
        onClose();
        toast.success(
          item ? "Item Updated Successfully!" : "Item Created Successfully!"
        );
        revalidate();
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="z-50 p-5 fixed top-0 left-0 h-screen w-full bg-black/70 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white rounded-lg p-10 md:w-[700px] w-full"
      >
        <h1 className="font-semibold">{item ? "Edit Item" : "Create Item"}</h1>
        <section className="flex flex-col">
          <label htmlFor="itemName" className="text-gray-500">
            Item Name
          </label>
          <input
            type="text"
            name="itemName"
            id="itemName"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="p-2 rounded-lg border-2"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="itemType" className="text-gray-500">
            Item Type
          </label>
          <select
            id="itemType"
            name="itemType"
            className="p-2 border-2"
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
          >
            <option value="">Select Item Type</option>
            <option value="Medicine">Medicine</option>
            <option value="Others">Others</option>
          </select>
        </section>
        <section className="flex flex-col">
          <label htmlFor="itemBrand" className="text-gray-500">
            Item Brand
          </label>
          <input
            type="text"
            name="itemBrand"
            id="itemBrand"
            placeholder="Item Brand"
            value={itemBrand}
            onChange={(e) => setItemBrand(e.target.value)}
            className="p-2 rounded-lg border-2"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="supplier" className="text-gray-500">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            id="supplier"
            placeholder="Supplier"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="p-2 rounded-lg border-2"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="quantity" className="text-gray-500">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="p-2 rounded-lg border-2"
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="expiryDate" className="text-gray-500">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiryDate"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="p-2 rounded-lg border-2"
          />
        </section>
        <section className="flex items-center justify-end gap-2">
          <button
            onClick={() => onClose(null)}
            className="bg-red-950 text-white p-2 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-950 text-white p-2 rounded-lg"
            disabled={loading}
          >
            {loading
              ? item
                ? "Updating Item..."
                : "Adding Item..."
              : item
              ? "Update Item"
              : "Add Item"}
          </button>
        </section>
        {error && <p>{error}</p>}
      </form>
    </main>
  );
}
