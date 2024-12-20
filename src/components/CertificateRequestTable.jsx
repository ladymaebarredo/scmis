import { useEffect, useState } from "react";
import { db } from "../utils/firebase"; // Import Firestore instance
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { Link } from "react-router-dom";

export default function CertificateRequestTable() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 5; // Number of items per page

  // Fetch the first page of requests
  const fetchRequests = async () => {
    setLoading(true);
    const q = query(
      collection(db, "certificateRequests"),
      orderBy("dateCreated", "desc"),
      limit(PAGE_SIZE)
    );

    onSnapshot(q, (snapshot) => {
      const fetchedRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE); // Determine if there's more data
      setLoading(false);
    });
  };

  // Fetch the next page of requests
  const fetchNextPage = async () => {
    if (!hasMore || !lastDoc) return; // Exit if no more data

    setLoading(true);
    const q = query(
      collection(db, "certificateRequests"),
      orderBy("dateCreated", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    onSnapshot(q, (snapshot) => {
      const fetchedRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests((prev) => [...prev, ...fetchedRequests]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.reason
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || req.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Certificate Requests</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by reason..."
          className="p-2 border rounded-lg flex-grow focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Reason</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Date Created</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{req.firstName}</td>
                    <td className="border px-4 py-2">{req.lastName}</td>
                    <td className="border px-4 py-2">{req.reason}</td>
                    <td className="border px-4 py-2">{req.status}</td>
                    <td className="border px-4 py-2">
                      {req.dateCreated
                        ? new Date(
                            req.dateCreated.seconds * 1000
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 border text-center">
                      <Link
                        to={`${req.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-gray-500 border px-4 py-2"
                  >
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <button
                onClick={fetchNextPage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
