import { useEffect, useState } from "react";
import { useUser } from "../providers/UserProvider";
import { getWorkersByType } from "../utils/worker";
import { createAppointment } from "../utils/appointment";
import toast from "react-hot-toast";
import { createNotification } from "../utils/notifications";
import { getAvailability } from "../utils/availability";

export function CreateAppointmentModal({ workerType, onClose, revalidate }) {
  const [workers, setWorkers] = useState([]);
  const [workerId, setWorkerId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const { userData } = useUser();

  useEffect(() => {
    const fetchWorkers = async () => {
      const workers = await getWorkersByType(workerType);
      setWorkers(workers);
    };
    fetchWorkers();
  }, [workerType]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (workerId) {
        const availability = await getAvailability(workerId);
        setAvailability(availability);
      } else {
        setAvailability(null); // Reset availability if no worker is selected
      }
    };
    fetchAvailability();
  }, [workerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAppointment(
        workerType,
        workerId,
        message,
        userData.id,
        selectedDate,
        selectedTime // Include the selected date and time
      );
      if (res.success) {
        revalidate();
        onClose();
        toast.success("Appointment Created Successfully!");
        await createNotification(
          userData.id,
          "ZpuoCwWArJcILSanSLLP7jAasuF3", // Nurse ID
          `${userData.lastname} requested an appointment.`,
          { appointmentId: res.message }
        );
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
        <h1 className="font-semibold">Create {workerType} Appointment</h1>

        <section className="flex flex-col">
          <label htmlFor="workerId" className="text-gray-500">
            {workerType}
          </label>
          <select
            id="workerId"
            name="workerId"
            className="p-2"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
          >
            <option value="">Select {workerType}</option>
            {workers.map((worker) => (
              <option value={worker.id} key={worker.id}>
                {worker.firstname} {worker.middlename} {worker.lastname}
              </option>
            ))}
          </select>
        </section>

        {availability && (
          <section className="flex flex-col">
            <h2 className="text-gray-500">Availability:</h2>
            <div>
              {Object.entries(availability).map(([day, times]) => (
                <div key={day}>
                  <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                  {times.from} - {times.to}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-col">
          <label htmlFor="date" className="text-gray-500">
            Select Date:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border-2"
            required // Make this field required
          />

          <label htmlFor="time" className="text-gray-500">
            Select Time:
          </label>
          <input
            type="time"
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="p-2 border-2"
            required // Make this field required
          />
        </section>

        <section className="flex flex-col">
          <label htmlFor="message" className="text-gray-500">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={message}
            className="p-2 border-2"
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`${userData.firstname}'s reason for appointment.`}
          ></textarea>
        </section>

        <section className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-red-950 text-white p-2 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-red-950 text-white p-2 rounded-lg"
            disabled={loading || !workerId || !selectedDate || !selectedTime}
          >
            {loading ? "Creating Appointment..." : "Create Appointment"}
          </button>
        </section>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
