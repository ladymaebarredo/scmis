import { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router

export function AppointmentsTable({ appointments }) {
  const [statusFilter, setStatusFilter] = useState("All");

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredAppointments =
    statusFilter === "All"
      ? appointments
      : appointments.filter(
          (appointment) => appointment.appointmentStatus === statusFilter
        );

  return (
    <div className="mb-10">
      <div className="mb-4">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Worker Type</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">User ID</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>{" "}
              {/* Added Actions column */}
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="odd:bg-white even:bg-gray-50"
                >
                  <td className="p-2 border">{appointment.workerType}</td>
                  <td className="p-2 border">
                    {new Date(
                      appointment.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </td>
                  <td className="p-2 border">{appointment.message}</td>
                  <td className="p-2 border">{appointment.userId}</td>
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
                    {/* View button with Link to appointment details by id */}
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
