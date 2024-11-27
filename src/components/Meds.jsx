import { useEffect, useState } from "react";
import { getRequests } from "../utils/request";
import { useUser } from "../providers/UserProvider";
import RequestCard from "./RequestCard";
import { AlertCircle, Loader2 } from "lucide-react";
import MedkitRequest from "./MedkitRequest";
import RequestsTable from "./RequestsTable";

export default function Meds() {
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();

  async function fetchRequests() {
    const requests = await getRequests(userData.id);
    setRequests(requests);
    setLoading(false);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const activeRequest = requests.find(
      (request) => request.status === "Pending"
    );
    setActiveRequest(activeRequest);
  }, [requests]);

  return (
    <section>
      <h1 className="font-bold">Medkit Requests</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2 mb-5">
          <AlertCircle className="text-yellow-500 w-6 h-6" />
          <span>Active Request</span>
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div> // Loading indicator
        ) : activeRequest ? (
          <RequestCard request={activeRequest} revalidate={fetchRequests} />
        ) : (
          <p className="text-gray-600">You have no active request.</p>
        )}
      </div>
      <MedkitRequest
        employeeId={userData.id}
        name={`${userData.firstname} ${userData.lastname}`}
        revalidate={fetchRequests}
      />
      <RequestsTable requests={requests} />
    </section>
  );
}
