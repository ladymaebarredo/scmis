import React from "react";

export default function ItemsTable({ items, toggleModal }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Item Type</th>
            <th className="p-2 border">Item Brand</th>
            <th className="p-2 border">Supplier</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Expiry Date</th>
            <th className="p-2 border">Added Date</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="odd:bg-white even:bg-gray-50">
              <td className="p-2 border">{item.itemName}</td>
              <td className="p-2 border">{item.itemType}</td>
              <td className="p-2 border">{item.itemBrand}</td>
              <td className="p-2 border">{item.supplier}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.expiryDate}</td>
              <td className="p-2 border">
                {new Date(item.createdAt.seconds * 1000).toLocaleString()}
              </td>
              <td className="p-2 border">
                <button onClick={() => toggleModal(item)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
