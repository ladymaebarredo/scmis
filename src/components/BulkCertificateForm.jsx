import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";
import { createNotification } from "../utils/notifications";

export default function BulkCertificateForm({ userData, revalidate }) {
  const [form, setForm] = useState({
    reason: "",
    requestors: [{ id: "", firstname: "", lastname: "", status: "Pending" }],
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRequestors = [...form.requestors];
    updatedRequestors[index][name] = value;
    setForm((prevForm) => ({
      ...prevForm,
      requestors: updatedRequestors,
    }));
  };

  const handleAddRequestor = () => {
    setForm((prevForm) => ({
      ...prevForm,
      requestors: [
        ...prevForm.requestors,
        { id: "", firstname: "", lastname: "", status: "Pending" },
      ],
    }));
  };

  const handleRemoveRequestor = (index) => {
    const updatedRequestors = form.requestors.filter((_, i) => i !== index);
    setForm((prevForm) => ({
      ...prevForm,
      requestors: updatedRequestors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.reason ||
      form.requestors.some((r) => !r.firstname || !r.lastname || !r.id)
    ) {
      alert("Please fill out all fields for each requestor.");
      return;
    }

    setLoading(true);
    try {
      // Add bulk certificate request to Firestore
      const docRef = await addDoc(collection(db, "bulkCertificate"), {
        deanId: userData.id,
        deanName: `${userData.firstname} ${userData.lastname}`,
        reason: form.reason,
        requestors: form.requestors,
        status: "Pending",
        dateCreated: serverTimestamp(),
        department: userData.assignment,
      });

      // Extract the document ID (bulkId)
      const bulkId = docRef.id;

      // Set success message and reset the form
      setSuccessMessage("Bulk certificate requests submitted successfully!");
      setForm({ reason: "", requestors: [{ firstname: "", lastname: "" }] });

      // Create notification
      await createNotification(
        userData.id,
        "o1jCIz3nAFaETuEvhmIWIIXjBJJ2", // Nurse ID
        `${userData.lastname} requested a bulk certificate.`,
        `/dashboard/certificate/bulk/${bulkId}` // Use the bulkId in the notification link
      );
    } catch (error) {
      console.error("Error submitting bulk certificate request: ", error);
      alert("Failed to submit the bulk certificate request. Please try again.");
    } finally {
      revalidate();
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Bulk Certificate Request
      </h2>
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="reason" className="block text-gray-700 font-medium">
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            rows="3"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {form.requestors.map((requestor, index) => (
          <div key={index} className="mb-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor={`id-${index}`}
                  className="block text-gray-700 font-medium"
                >
                  ID
                </label>
                <input
                  type="text"
                  id={`id-${index}`}
                  name="id"
                  value={requestor.id}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor={`firstname-${index}`}
                  className="block text-gray-700 font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id={`firstname-${index}`}
                  name="firstname"
                  value={requestor.firstname}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor={`lastname-${index}`}
                  className="block text-gray-700 font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id={`lastname-${index}`}
                  name="lastname"
                  value={requestor.lastname}
                  onChange={(e) => handleChange(e, index)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {form.requestors.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveRequestor(index)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                Remove Requestor
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between mb-4">
          <button
            type="button"
            onClick={handleAddRequestor}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Add Requestor
          </button>
        </div>

        <button
          type="submit"
          className={`w-full p-2 text-white rounded-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Bulk Request"}
        </button>
      </form>
    </div>
  );
}
