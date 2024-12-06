import { useEffect, useState } from "react";
import { db } from "../../utils/firebase"; // Firestore instance
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import CertificateRequestForm from "../../components/CertificateRequestForm";
import { useUser } from "../../providers/UserProvider";
import CertificateRequestTable from "../../components/CertificateRequestTable";
import { getAllBulk } from "../../utils/bulk";
import BulkRequestsTable from "../../components/BulkRequestTable";

export default function CertificatePage() {
  const { user } = useUser();

  return (
    <main className="md:p-10">
      {user.data.role == "WORKER" ? <Nurse /> : <Appointee />}
    </main>
  );
}

function Appointee() {
  const { userData } = useUser();
  const [activeRequest, setActiveRequest] = useState(null);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!userData?.id) return;

    setLoading(true);

    try {
      // Query Firestore for the user's requests
      const q = query(
        collection(db, "certificateRequests"),
        where("userId", "==", userData.id),
        orderBy("dateCreated", "desc")
      );
      const snapshot = await getDocs(q);

      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Find the active request with status "Pending"
      const pendingRequest = requests.find(
        (req) => req.status === "Pending" || req.status === "Approved"
      );
      setActiveRequest(pendingRequest || null);
      setAllRequests(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userData]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Certificate Request
      </h1>

      <section className="mb-8 p-8 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg border border-blue-200">
        <h2 className="text-lg font-bold text-red-700 mb-6">Active Request</h2>
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">
            Loading active request...
          </p>
        ) : activeRequest ? (
          <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Details</h3>
              <p className="text-gray-700 mt-2">
                <strong>Reason:</strong> {activeRequest.reason}
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-md ${
                    activeRequest.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : activeRequest.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {activeRequest.status}
                </span>
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Submitted On:</strong>{" "}
                {new Date(
                  activeRequest.dateCreated.seconds * 1000
                ).toLocaleDateString()}
              </p>
            </div>
            {activeRequest.status === "Approved" && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  To be Claimed
                </h3>
                <p className="text-gray-700 mt-2">
                  <strong>Weekdays:</strong> Anytime
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Time:</strong> 9:00 AM - 5:00 PM
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">No active requests</p>
        )}
      </section>

      {/* Section 2: Request Form */}
      <section className="mb-8">
        <CertificateRequestForm revalidate={fetchRequests} />
      </section>

      {/* Section 3: Requests Table */}
      <section className="bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Request History</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading requests...</p>
        ) : allRequests.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Reason</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date Submitted</th>
              </tr>
            </thead>
            <tbody>
              {allRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{req.reason}</td>
                  <td className="border px-4 py-2">{req.status}</td>
                  <td className="border px-4 py-2">
                    {req.dateCreated
                      ? new Date(
                          req.dateCreated.seconds * 1000
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No requests found</p>
        )}
      </section>
    </div>
  );
}

function Nurse() {
  const [bulkData, setBulkData] = useState([]);

  useEffect(() => {
    const fetchBulkData = async () => {
      try {
        const data = await getAllBulk(); // Fetch data using the function
        setBulkData(data); // Update state with fetched data
      } catch (error) {
        console.error("Failed to fetch bulk data:", error.message);
      }
    };

    fetchBulkData();
  }, []);

  return (
    <main>
      <CertificateRequestTable />
      <BulkRequestsTable requests={bulkData} />
    </main>
  );
}
