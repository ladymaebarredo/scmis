import { useEffect, useState } from "react";
import { getAllAppointments } from "../utils/appointment";
import { PDFViewer } from "@react-pdf/renderer";
import { AppointmentsReport } from "./AppointmentReport";

export default function AppointmentReportSection() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workerType, setWorkerType] = useState("");
  const [college, setCollege] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const workerTypes = ["Nurse", "Dentist", "Physician"];
  const colleges = ["CCS", "COC", "CAS", "CED"];

  // Function to fetch all appointments
  const fetchAppointments = async () => {
    const appointmentsData = await getAllAppointments();
    setAppointments(appointmentsData);
    setFilteredAppointments(appointmentsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Function to handle filtering based on selected criteria
  const handleFilter = () => {
    let filtered = [...appointments];

    // Filter by workerType
    if (workerType) {
      filtered = filtered.filter(
        (appointment) => appointment.workerType === workerType
      );
    }

    // Filter by college (substring match)
    if (college) {
      filtered = filtered.filter((appointment) =>
        appointment.appointeeCollege.includes(college)
      );
    }

    // Filter by date range
    if (fromDate && toDate) {
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.selectedDate);
        return appointmentDate >= fromDateObj && appointmentDate <= toDateObj;
      });
    }

    setFilteredAppointments(filtered);
  };

  // Trigger filtering when any filter is changed
  useEffect(() => {
    handleFilter();
  }, [workerType, college, fromDate, toDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Appointment Report</h2>

      {/* Filter Section */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Worker Type</label>
          <select
            value={workerType}
            onChange={(e) => setWorkerType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Worker Types</option>
            {workerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">College</label>
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Colleges</option>
            {colleges.map((collegeOption) => (
              <option key={collegeOption} value={collegeOption}>
                {collegeOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <PDFViewer className="h-screen w-full">
        <AppointmentsReport
          appointments={filteredAppointments}
          workerType={workerType}
          college={college}
          fromDate={fromDate}
          toDate={toDate}
        />
      </PDFViewer>
    </div>
  );
}
