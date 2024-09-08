import { useEffect, useState } from "react";
import { getUserData } from "../utils/user";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase"; // Adjust the import based on your project structure

export function AppointmentCard({ appointment, revalidate }) {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const worker = await getUserData(appointment.workerId, "WORKER");
        setWorker(worker);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [appointment.workerId]);

  const handleCancelAppointment = async () => {
    if (canceling) return;
    setCanceling(true);
    try {
      const appointmentRef = doc(db, "appointments", appointment.id);
      await updateDoc(appointmentRef, {
        appointmentStatus: "Canceled",
      });
      revalidate();
    } catch (error) {
      console.log("Error canceling appointment:", error);
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <>Loading Appointment...</>;

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6">
      <div className="flex justify-between flex-col-reverse items-start md:items-center md:flex-row mb-4 gap-4">
        <h3 className="text-lg font-semibold">
          Appointment with {appointment.workerType} {worker.firstname}
        </h3>
        <span
          className={`px-3 py-1 text-sm font-medium text-white rounded-full ${
            appointment.appointmentStatus === "Canceled"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {appointment.appointmentStatus}
        </span>
      </div>
      <div className="text-gray-700">
        <p className="mb-2 flex-col flex">
          <strong>Message:</strong> {appointment.message}
        </p>
        <p className="flex flex-col">
          <strong>Created At:</strong>
          {new Date(appointment.createdAt.seconds * 1000).toLocaleString()}
        </p>
      </div>
      {appointment.appointmentStatus !== "Canceled" && (
        <button
          onClick={handleCancelAppointment}
          disabled={canceling}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          {canceling ? "Canceling..." : "Cancel Appointment"}
        </button>
      )}
    </div>
  );
}
