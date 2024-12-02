import { useState } from "react";
import { useUser } from "../providers/UserProvider";
import { db } from "../utils/firebase"; // Import Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firestore functions
import { createNotification } from "../utils/notifications";

export default function CertificateRequestForm({ revalidate }) {
  const { userData } = useUser();
  const [formData, setFormData] = useState({
    reason: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add a new document to the "certificateRequests" collection
      await addDoc(collection(db, "certificateRequests"), {
        userId: userData.id, // Assuming userData contains the user's unique ID
        firstName: userData.firstname,
        lastName: userData.lastname,
        reason: formData.reason,
        status: "Pending",
        dateCreated: serverTimestamp(), // To record when the request was submitted
      });

      await createNotification(
        userData.id,
        "o1jCIz3nAFaETuEvhmIWIIXjBJJ2", // Nurse ID
        `${userData.lastname} requested an certificate.`,
        { wow: "wow" }
      );

      console.log("Form submitted:", formData);
      setSubmitted(true);
      revalidate();
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Request Certificate
      </h1>
      {submitted ? (
        <div className="text-center text-green-600">
          <h2 className="text-xl font-semibold">Request Submitted!</h2>
          <p>
            We have received your certificate request and will process it
            shortly.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-gray-800">
            <p>
              <strong>First Name:</strong> {userData.firstname}
            </p>
            <p>
              <strong>Last Name:</strong> {userData.lastname}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="reason"
                className="block text-gray-700 font-medium mb-2"
              >
                Reason for Request
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why you need the certificate"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
