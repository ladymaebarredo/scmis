import { useEffect, useState } from "react";
import { CreateAppointmentModal } from "../../components/CreateAppointmentModal";
import { useUser } from "../../providers/UserProvider";
import { getAppointments } from "../../utils/appointment";
import { AppointmentCard } from "../../components/AppointmentCard";
import { AppointmentsTable } from "../../components/AppointmentsTable";
import {
  Calendar,
  PlusCircle,
  AlertCircle,
  User,
  CheckCircle,
  Clock,
  BarChart,
  Loader2, // Add loader icon
} from "lucide-react";

export default function AppointmentsPage() {
  const { user } = useUser();
  return user.data.role === "WORKER" ? (
    <Worker user={user} />
  ) : (
    <Appointee user={user} />
  );
}

function Appointee({ user }) {
  const [dentistApp, setDentistApp] = useState(false);
  const [physicianApp, setPhysicianApp] = useState(false);
  const [nurseApp, setNurseApp] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const toggleDentistApp = () => setDentistApp(!dentistApp);
  const togglePhysicianApp = () => setPhysicianApp(!physicianApp);
  const toggleNurseApp = () => setNurseApp(!nurseApp);

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
      (appointment) => appointment.appointmentStatus === "Pending"
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
            className="bg-red-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
            onClick={toggleDentistApp}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Dentist Appointment</span>
          </button>
          <button
            className="bg-red-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
            onClick={togglePhysicianApp}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Physician Appointment</span>
          </button>
          <button
            className="bg-red-600 text-white p-3 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition"
            onClick={toggleNurseApp}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Nurse Appointment</span>
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
      {nurseApp && (
        <CreateAppointmentModal
          workerType="Nurse"
          onClose={toggleNurseApp}
          revalidate={fetchAppointments}
        />
      )}
    </>
  );
}

function Worker({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await getAppointments(user.id, "workerId");
        setAppointments(response);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchAppointments();
  }, [user.id]);

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.appointmentStatus === "Pending"
  ).length;
  const completedAppointments = appointments.filter(
    (appointment) => appointment.appointmentStatus === "Completed"
  ).length;

  return (
    <main className="space-y-8 md:p-10 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2">
        <Calendar className="text-blue-500 w-8 h-8" />
        <span>Appointments</span>
      </h1>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <BarChart className="text-blue-500 w-8 h-8" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Total Appointments
              </h2>
              <p className="text-2xl font-bold">{totalAppointments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <Clock className="text-yellow-500 w-8 h-8" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Pending Appointments
              </h2>
              <p className="text-2xl font-bold">{pendingAppointments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-500 w-8 h-8" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Completed Appointments
              </h2>
              <p className="text-2xl font-bold">{completedAppointments}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Appointments Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div> // Loading indicator
        ) : (
          <AppointmentsTable appointments={appointments} />
        )}
      </div>
    </main>
  );
}
