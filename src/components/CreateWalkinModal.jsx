import { useUser } from "../providers/UserProvider";
import { useState } from "react";
import { createAppointment } from "../utils/appointment";
import { createNotification } from "../utils/notifications";
import { serverTimestamp } from "firebase/firestore";
import { format, parseISO } from "date-fns";

export function CreateWalkinModal({ onClose, revalidate }) {
  const { userData } = useUser();

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00"); // Default time
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !studentId ||
      !name ||
      !course ||
      !yearLevel ||
      !selectedDate ||
      !selectedTime ||
      !message
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Format the selected date and time
      const formattedDate = format(parseISO(selectedDate), "yyyy-MM-dd");

      const res = await createAppointment(
        "Nurse",
        "Nurse", // No worker for walk-ins
        message,
        format(parseISO(formattedDate), "EEEE"), // Change to day of the week e.g Monday
        selectedTime, // Use formatted date + time
        formattedDate,
        studentId,
        name,
        course
      );
      if (res.success) {
        revalidate();
        onClose();
      } else {
        setError(res.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal without submitting
  };

  return (
    <main className="z-50 p-5 fixed top-0 left-0 h-screen w-full bg-black/70 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Create Walk-in Appointment
          </h2>
        </div>

        {/* Student Information */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Student ID:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Course:
          </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Year Level:
          </label>
          <input
            type="text"
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date Picker */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Appointment Date:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Time Picker */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Appointment Time:
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Message */}
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700">
            Message:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message or note"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Buttons */}
        <div className="mt-6 text-center space-x-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-md"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <button
            onClick={handleCancel}
            className="btn bg-gray-600 text-white hover:bg-gray-700 p-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
