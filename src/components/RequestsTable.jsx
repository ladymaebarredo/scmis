import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function RequestsTable({ requests }) {
  return (
    <div className="overflow-x-auto">
      <h1 className="my-10 font-bold">Medkit Requests</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Request ID</th>
            <th className="p-2 border">Created On</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{request.id}</td>
                <td className="p-2 border">
                  {format(
                    new Date(request.createdAt.seconds * 1000),
                    "MMMM dd, yyyy"
                  )}
                </td>
                <td className="p-2 border">{request.reason}</td>
                <td className="p-2 border">{request.employeeId}</td>
                <td className="p-2 border text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      request.status === "Pending"
                        ? "text-yellow-800 bg-yellow-200"
                        : request.status === "Approved"
                        ? "text-green-800 bg-green-200"
                        : "text-red-800 bg-red-200"
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="p-2 border text-center">
                  <Link
                    to={`/dashboard/requests/${request.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
