export function AppointmentsTable({ appointments }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Worker Type</th>
            <th className="p-2 border">Created At</th>
            <th className="p-2 border">Message</th>
            <th className="p-2 border">User ID</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="odd:bg-white even:bg-gray-50">
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
                      : appointment.appointmentStatus === "Confirmed"
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
