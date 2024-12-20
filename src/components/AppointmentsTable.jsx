import { useState } from "react";
import { Link } from "react-router-dom";
import { format, isSameDay, isThisWeek } from "date-fns";
import { getWorkerType } from "../utils/globals";

export function AppointmentsTable({ appointments }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      if (statusFilter === "All") return true;
      return appointment.appointmentStatus === statusFilter;
    })
    .filter((appointment) => {
      if (dateFilter === "All") return true;
      const appointmentDate = new Date(appointment.selectedDate);
      if (dateFilter === "This Day") {
        return isSameDay(appointmentDate, new Date());
      }
      if (dateFilter === "This Week") {
        return isThisWeek(appointmentDate);
      }
      return true;
    })
    .filter((appointment) =>
      appointment.appointee.toLowerCase().includes(searchQuery)
    );

  return (
    <div className="mb-10">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <label htmlFor="statusFilter" className="mr-2 font-semibold">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="border p-2 rounded-lg"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        <div>
          <label htmlFor="dateFilter" className="mr-2 font-semibold">
            Filter by Date:
          </label>
          <select
            id="dateFilter"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="border p-2 rounded-lg"
          >
            <option value="All">All</option>
            <option value="This Day">This Day</option>
            <option value="This Week">This Week</option>
          </select>
        </div>
        <div className="mt-4 md:mt-0">
          <label htmlFor="searchQuery" className="mr-2 font-semibold">
            Search by Appointee:
          </label>
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter appointee name"
            className="border p-2 rounded-lg"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Date Requested</th>
              <th className="p-2 border">Date of Appointment</th>
              <th className="p-2 border">Appointee</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="p-2 border">
                    {getWorkerType(appointment.workerType)}
                  </td>
                  <td className="p-2 border">
                    {new Date(
                      appointment.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="p-2 border">
                    {appointment.selectedDate} {appointment.selectedDay}{" "}
                    {format(
                      new Date(
                        0,
                        0,
                        0,
                        ...appointment.selectedTime.split(":").map(Number)
                      ),
                      "h:mm:ss a"
                    )}
                  </td>
                  <td className="p-2 border">{appointment.appointee}</td>
                  <td className="p-2 border text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        appointment.appointmentStatus === "Pending"
                          ? "text-yellow-800 bg-yellow-200"
                          : appointment.appointmentStatus === "Approved"
                          ? "text-blue-800 bg-blue-200"
                          : appointment.appointmentStatus === "Completed"
                          ? "text-green-800 bg-green-200"
                          : appointment.appointmentStatus === "Canceled"
                          ? "text-red-800 bg-red-200"
                          : "text-gray-800 bg-gray-200"
                      }`}
                    >
                      {appointment.appointmentStatus}
                    </span>
                  </td>
                  <td className="p-2 border text-center">
                    <Link
                      to={`${appointment.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
