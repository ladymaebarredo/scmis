import { useEffect, useState } from "react";
import { CreateAppointmentModal } from "../../components/CreateAppointmentModal";
import { useUser } from "../../providers/UserProvider";
import { useNavigate } from "react-router-dom";
import {
  getAppointments,
  updateStatus,
  getAllAppointments,
} from "../../utils/appointment";
import { AppointmentCard } from "../../components/AppointmentCard";
import { AppointmentsTable } from "../../components/AppointmentsTable";
import {
  Calendar,
  PlusCircle,
  AlertCircle,
  User,
  Loader2, // Add loader icon
} from "lucide-react";
import { createNotification } from "../../utils/notifications";
import { Link } from "react-router-dom";
import { getRecord } from "../../utils/record";
import { LoadingPage } from "../LoadingPage";
import { CreateWalkinModal } from "../../components/CreateWalkinModal";
import { nurseId } from "../../utils/globals";

export default function AppointmentsPage() {
  const { user, userData, loading } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  if (loading) return <LoadingPage />;

  // Fetch the student record if the user is a STUDENT
  useEffect(() => {
    if (user.data.role === "STUDENT") {
      const fetchRecord = async () => {
        setIsLoading(true);
        try {
          const record = await getRecord(userData.id); // Assuming `user.uid` is the unique ID
          if (!record) {
            console.log(userData);
            navigate(`/dashboard/profile?id=${userData.id}#record`); // Adjust the URL as per your routing setup
          }
        } catch (err) {
          console.error("Error fetching record:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecord();
    }
  }, [user.data.role, user.uid, navigate]); // Effect runs when role or user changes

  if (isLoading) return <LoadingPage />;

  if (user.data.role == "WORKER") {
    if (userData.workerType == "Nurse") {
      return <Nurse user={user} />;
    } else {
      return <Worker user={user} userData={userData} />;
    }
  } else {
    return <Appointee user={user} />;
  }
}

function Appointee({ user }) {
  const [dentistApp, setDentistApp] = useState(false);
  const [physicianApp, setPhysicianApp] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const toggleDentistApp = () => setDentistApp(!dentistApp);
  const togglePhysicianApp = () => setPhysicianApp(!physicianApp);

  const fetchAppointments = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await getAppointments(user.id, "userId");
      setAppointments(response);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const activeAppointment = appointments.find(
      (appointment) =>
        appointment.appointmentStatus === "Pending" ||
        appointment.appointmentStatus === "Approved"
    );
    setActiveAppointment(activeAppointment);
  }, [appointments]);

  return (
    <>
      <main className="space-y-8 md:p-10 p-6">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2">
          <Calendar className="text-blue-500 w-8 h-8" />
          <span>Appointments</span>
        </h1>
        <section className="flex items-center gap-4 my-6 flex-wrap">
          <button
            className="bg-blue-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
            onClick={toggleDentistApp}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Dentist Appointment</span>
          </button>
          <button
            className="bg-blue-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
            onClick={togglePhysicianApp}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Physician Appointment</span>
          </button>
        </section>

        <section className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2 mb-5">
              <AlertCircle className="text-yellow-500 w-6 h-6" />
              <span>Active Appointment</span>
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div> // Loading indicator
            ) : activeAppointment ? (
              <AppointmentCard
                appointment={activeAppointment}
                revalidate={fetchAppointments}
              />
            ) : (
              <p className="text-gray-600">You have no active appointment.</p>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2 mb-5">
              <User className="text-green-500 w-6 h-6" />
              <span>My Appointments</span>
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div> // Loading indicator
            ) : (
              <AppointmentsTable appointments={appointments} />
            )}
          </div>
        </section>
      </main>
      {dentistApp && (
        <CreateAppointmentModal
          workerType="Dentist"
          onClose={toggleDentistApp}
          revalidate={fetchAppointments}
        />
      )}
      {physicianApp && (
        <CreateAppointmentModal
          workerType="Physician"
          onClose={togglePhysicianApp}
          revalidate={fetchAppointments}
        />
      )}
    </>
  );
}

const Nurse = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [nurseApp, setNurseApp] = useState(false);

  const toggleNurseApp = () => setNurseApp(!nurseApp);

  // Fetch all appointments
  const fetchAppointments = async () => {
    const appointments = await getAllAppointments();
    setAppointments(appointments);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle status change
  const handleStatusChange = async (appointment, status) => {
    await updateStatus(appointment.id, status);
    await fetchAppointments(); // Refresh appointments after status update
    await createNotification(
      user.id,
      appointment.workerId,
      `Nurse ${status} an appointment for you.`,
      `/dashboard/appointments/${appointment.id}`
    );
    await createNotification(
      user.id,
      appointment.userId,
      `Nurse ${status} your appointment.`,
      `/dashboard/appointments/${appointment.id}`
    );
  };

  // Filter appointments by status
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.appointmentStatus === "Pending"
  );

  return (
    <>
      <div className="container mx-auto p-6">
        <button
          className="bg-blue-600 text-white my-10 p-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
          onClick={toggleNurseApp}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Walkin Appointment</span>
        </button>
        <h1 className="text-lg font-bold mb-2">Pending Appointments</h1>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Appointee</th>
                <th className="px-4 py-2">Worker Type</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingAppointments.map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-4 py-2">{appointment.appointee}</td>
                  <td className="px-4 py-2">{appointment.workerType}</td>
                  <td className="px-4 py-2">{appointment.message}</td>
                  <td className="px-4 py-2">{appointment.appointmentStatus}</td>
                  <td className="px-4 py-2">
                    {appointment.appointmentStatus === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          onClick={() =>
                            handleStatusChange(appointment, "Approved")
                          }
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          onClick={() =>
                            handleStatusChange(appointment, "Declined")
                          }
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1 className="text-lg font-bold mb-2">All Appointments</h1>
        <AppointmentsTable appointments={appointments} />
      </div>
      {nurseApp && (
        <CreateWalkinModal
          onClose={toggleNurseApp}
          revalidate={fetchAppointments}
        />
      )}
    </>
  );
};

const Worker = ({ user, userData }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await getAppointments(user.id, "workerId");
      setAppointments(response);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user.id]);

  // Handle status change to mark appointments as completed or cancelled
  const handleStatusChange = async (appointment, status) => {
    await updateStatus(appointment.id, status);
    await fetchAppointments(); // Refresh appointments after status update
    await createNotification(
      user.id,
      nurseId, // Nurse ID
      `${userData.workerType} ${status} an appointment.`,
      `/dashboard/appointments/${appointment.id}`
    );
  };

  // Filter appointments based on status
  const approvedAppointments = appointments.filter(
    (appointment) => appointment.appointmentStatus === "Approved"
  );

  if (loading) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <h2 className="text-xl font-semibold mb-2">Approved Appointments</h2>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedAppointments.map((appointment) => (
              <tr key={appointment.id} className="bg-white border-b">
                <td className="px-4 py-2">{appointment.id}</td>
                <td className="px-4 py-2">{appointment.message}</td>
                <td className="px-4 py-2">{appointment.appointmentStatus}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() =>
                        handleStatusChange(appointment, "Completed")
                      }
                    >
                      Mark as Completed
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() =>
                        handleStatusChange(appointment, "Cancelled")
                      }
                    >
                      Cancel
                    </button>
                    <Link to={appointment.id}>View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mb-2">Appointments</h2>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
};
