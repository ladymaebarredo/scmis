import { Link } from "react-router-dom";

export default function BulkRequestsTable({ requests }) {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Bulk Certificate Requests
      </h2>
      {requests.length === 0 ? (
        <p>No bulk requests found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Dean</th>
              <th className="border p-2 text-left">Reason</th>
              <th className="border p-2 text-left">Department</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Requestors Count</th>
              <th className="border p-2 text-left">Date Created</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="border p-2">{request.deanName}</td>
                <td className="border p-2">{request.reason}</td>
                <td className="border p-2">{request.department}</td>
                <td className="border p-2">{request.status}</td>
                <td className="border p-2">{request.requestors.length}</td>
                <td className="border p-2">
                  {new Date(
                    request.dateCreated?.seconds * 1000
                  ).toLocaleString()}
                </td>
                <td className="p-2 border text-center">
                  <Link
                    to={`/dashboard/certificate/bulk/${request.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
