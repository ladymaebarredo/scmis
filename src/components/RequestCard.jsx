import { format } from "date-fns"; // To format the date
import { Clock, User, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function RequestCard({ request }) {
  const { id, createdAt, reason, employeeName, status } = request;

  // Format the createdAt timestamp
  const formattedDate = format(
    new Date(createdAt.seconds * 1000),
    "MMMM dd, yyyy"
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Request ID: {id}
        </h2>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${
            status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : status === "Approved"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex items-center text-gray-600 space-x-2">
        <Clock className="w-5 h-5" />
        <p>Created on: {formattedDate}</p>
      </div>
      <div className="flex items-center text-gray-600 space-x-2">
        <User className="w-5 h-5" />
        <p>Dean: {employeeName}</p>
      </div>
      <div className="flex items-start text-gray-600 space-x-2">
        <Info className="w-5 h-5 mt-1" />
        <p>Reason: {reason}</p>
      </div>

      {status === "Approved" && (
        <div className="mt-4 text-gray-600">
          <h3 className="text-sm font-semibold">To Be Claimed</h3>
          <p className="text-xs">Weekdays: Anytime</p>
          <p className="text-xs">Time: 9:00 AM - 5:00 PM</p>
        </div>
      )}

      <div className="mt-4 w-full flex">
        <Link
          to={`/dashboard/requests/${request.id}`}
          className="w-fit bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition mx-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
