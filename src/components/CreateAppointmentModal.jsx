import { useUser } from "../providers/UserProvider";
import { useEffect, useState } from "react";
import { countByDate, createAppointment } from "../utils/appointment";
import { getWorkerByType } from "../utils/worker";
import { getAvailability } from "../utils/availability";
import { addDays, startOfWeek, format, subWeeks } from "date-fns";
import { createNotification } from "../utils/notifications";

export function CreateAppointmentModal({ workerType, onClose, revalidate }) {
  const { userData } = useUser();

  const [worker, setWorker] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date())
  );
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [slots, setSlots] = useState(5);

  useEffect(() => {
    async function fetchCount() {
      const count = await countByDate(selectedDate, workerType);
      setSlots(5 - count);
    }

    if (selectedDate) {
      fetchCount();
    }
  }, [selectedDate]);

  useEffect(() => {
    const fetchWorker = async () => {
      const worker = await getWorkerByType(workerType);
      setWorker(worker);
    };

    fetchWorker();
  }, [workerType]);

  useEffect(() => {
    if (!worker) return;

    const fetchAvailability = async () => {
      const availability = await getAvailability(worker.id);
      setAvailability(availability);
    };

    fetchAvailability();
  }, [worker]);

  const getWeekDays = () => {
    let days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeekStart, i));
    }
    return days;
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToPreviousWeek = () => {
    const prevWeek = subWeeks(currentWeekStart, 1);
    if (prevWeek >= startOfWeek(new Date())) {
      setCurrentWeekStart(prevWeek);
    }
  };

  const handleDaySelect = (event) => {
    const selected = event.target.value;
    setSelectedDay(selected);
    const selectedDayDate = getWeekDays().find(
      (day) => format(day, "iiii") === selected
    );
    if (selectedDayDate) {
      setSelectedDate(format(selectedDayDate, "yyyy-MM-dd")); // Set selectedDate as a formatted string
    }
    const availabilityForDay = availability[selected.toLowerCase()];
    if (availabilityForDay) {
      setSelectedTime(availabilityForDay.from); // Default to the start time of the selected day
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedDay || !selectedTime || !message) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await createAppointment(
        workerType,
        worker.id,
        message,
        selectedDay,
        selectedTime,
        selectedDate,
        userData.id,
        `${userData.firstname} ${userData.lastname}`,
        `${userData.department}-${userData.program}`
      );
      if (res.success) {
        revalidate();
        onClose();
        await createNotification(
          userData.id,
          "o1jCIz3nAFaETuEvhmIWIIXjBJJ2", // Nurse ID
          `${userData.lastname} requested an appointment.`,
          `/dashboard/appointments/${res.message}`
        );
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
        {/* Worker Info */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {worker ? `${worker.firstname} ${worker.lastname}` : "Loading..."}
          </h2>
          <p className="text-gray-600">
            {worker ? worker.workerType : "Loading..."}
          </p>
        </div>

        {/* Availability */}
        {availability && (
          <>
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center w-full">
                <button
                  onClick={goToPreviousWeek}
                  disabled={currentWeekStart <= startOfWeek(new Date())}
                  className="p-1 bg-gray-300 text-gray-700 hover:bg-gray-400 mr-2"
                >
                  Prev
                </button>

                <select
                  id="daySelect"
                  value={selectedDay}
                  onChange={handleDaySelect}
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Choose a day
                  </option>
                  {getWeekDays().map((day, index) => {
                    const dayName = format(day, "iiii");
                    const fullDate = format(day, "MMMM dd, yyyy");
                    const availabilityForDay =
                      availability[dayName.toLowerCase()];
                    return (
                      <option
                        key={index}
                        value={dayName}
                        disabled={!availabilityForDay}
                      >
                        {dayName} ({fullDate}){" "}
                        {!availabilityForDay ? "(No Availability)" : ""}
                      </option>
                    );
                  })}
                </select>

                <button
                  onClick={goToNextWeek}
                  className="p-1 bg-gray-300 text-gray-700 hover:bg-gray-400 ml-2"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDay && availability[selectedDay.toLowerCase()] && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700">Time:</h4>
                <div className="flex items-center space-x-4">
                  <input
                    type="time"
                    value={selectedTime}
                    min={availability[selectedDay.toLowerCase()].from}
                    max={availability[selectedDay.toLowerCase()].to}
                    onChange={handleTimeChange}
                    className="w-1/2 p-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">
                    (Available from{" "}
                    {availability[selectedDay.toLowerCase()].from} to{" "}
                    {availability[selectedDay.toLowerCase()].to}) <br />({slots}{" "}
                    slots available)
                  </span>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">Message:</h4>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Enter a message or note for the worker"
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
          </>
        )}
      </div>
    </main>
  );
}
