import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../../providers/UserProvider";
import { getRequestsById } from "../../utils/request"; // Assume this utility exists
import { LoadingPage } from "../LoadingPage";
import { MedkitItems } from "../../components/MedkitItems";

export default function RequestPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState(""); // Store the status of the request
  const { user } = useUser();

  async function fetchRequest() {
    const request = await getRequestsById(id);
    setRequest(request);
    setStatus(request.status); // Set the initial status
    setLoading(false);
  }

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // Call the function to update the status in the database or backend
    //await updateRequestStatus(id, newStatus);
  };

  if (loading) return <LoadingPage />;
  if (!request)
    return (
      <div className="text-center text-gray-500 mt-10">Request not found</div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Request Details</h1>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold">Employee Name</h2>
              <p className="text-gray-600">{request.employeeName}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Request Status</h2>
              <select
                value={status}
                onChange={handleStatusChange}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Reason</h2>
              <p className="text-gray-600">{request.reason}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Created At</h2>
              <p className="text-gray-600">
                {new Date(request.createdAt.seconds * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <MedkitItems />
        </div>
      </div>
    </div>
  );
}
