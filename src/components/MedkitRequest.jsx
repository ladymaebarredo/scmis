import { useState } from "react";
import { createMedkitRequest } from "../utils/request";
import { createNotification } from "../utils/notifications";

export default function MedkitRequest({ employeeId, name, revalidate }) {
  const [formData, setFormData] = useState({
    reason: "",
    employeeId,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMedkitRequest(employeeId, formData.reason, name);
    console.log("Form submitted:", formData);
    setSubmitted(true);
    revalidate();
  };

  return (
    <div className="w-full mt-10 bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        Request Medkit
      </h1>
      {submitted ? (
        <div className="text-center text-green-600">
          <h2 className="text-xl font-semibold">Request Submitted!</h2>
          <p>
            We have received your medkit request and will process it shortly.
          </p>
        </div>
      ) : (
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
              placeholder="Explain why you need the medkit"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
