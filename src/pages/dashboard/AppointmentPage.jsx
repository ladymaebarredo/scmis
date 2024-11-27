import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointment } from "../../utils/appointment";
import { LoadingPage } from "../LoadingPage";
import { Diagnostics } from "../../components/Diagnostics";
import { useUser } from "../../providers/UserProvider";
import { RemarksForm } from "../../components/RemarksForm";

export default function AppointmentPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  const { user } = useUser();

  const fetchAppointment = async () => {
    try {
      const appointmentData = await getAppointment(id);
      setAppointment(appointmentData);
    } catch (error) {
      console.log("Error fetching appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  if (loading) return <LoadingPage />;
  if (!appointment) return <div className="p-6">Appointment not found!</div>;
  console.log(appointment);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-10">
        <div className="mb-4">
          <span className="font-semibold">Status:</span>{" "}
          {appointment.appointmentStatus}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(appointment.createdAt.seconds * 1000).toLocaleString()}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Message:</span> {appointment.message}
        </div>
        <div className="mb-4 flex flex-col">
          <span className="font-semibold">Appointee:</span>{" "}
          {appointment.appointee}
          <Link
            to={`/dashboard/profile?id=${appointment.userId}`}
            className=" underline text-blue-600"
          >
            View Profile
          </Link>
        </div>
        <div className="mb-4">
          <span className="font-semibold">Worker ID:</span>{" "}
          {appointment.workerId}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Worker Type:</span>{" "}
          {appointment.workerType}
        </div>
      </div>
      <RemarksForm role={user.data.role} appointmentId={appointment.id} />
      {user.data.role == "WORKER" &&
        appointment.appointmentStatus == "Approved" && (
          <Diagnostics
            appointmentId={appointment.id}
            workerType={appointment.workerType}
          />
        )}
    </div>
  );
}
