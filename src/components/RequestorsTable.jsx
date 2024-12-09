import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import ViewHealthRecord from "./ViewHealthRecord";
import { db, storage } from "../utils/firebase";

export default function RequestorsTable({
  requestId,
  requestors,
  userRole,
  onUpdateStatus,
}) {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filterStatus, setFilterStatus] = useState("All"); // State for filtering by status
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const itemsPerPage = 5; // Number of items per page

  // Filtered and searched data
  const filteredRequestors = requestors
    .filter((requestor) =>
      `${requestor.firstname} ${requestor.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter(
      (requestor) => filterStatus === "All" || requestor.status === filterStatus
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredRequestors.length / itemsPerPage);
  const paginatedRequestors = filteredRequestors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle file upload
  const handleFileUpload = async (requestorId, file) => {
    const fileRef = ref(
      storage,
      `attachedFiles/${requestId}/${requestorId}/${file.name}`
    );
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    // Update the Firestore record
    const requestDocRef = doc(db, "bulkCertificate", requestId);
    const updatedRequestors = requestors.map((req) =>
      req.id === requestorId ? { ...req, attachedFile: downloadURL } : req
    );
    await updateDoc(requestDocRef, { requestors: updatedRequestors });
    window.location.reload();
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mt-6">
      {/* Search and Filter */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-4 py-2 w-1/3"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">
                Attached File
              </th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequestors.map((requestor) => (
              <tr key={requestor.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {requestor.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {requestor.firstname} {requestor.lastname}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userRole === "WORKER" ? (
                    <select
                      value={requestor.status}
                      onChange={(e) =>
                        onUpdateStatus(requestor.id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Declined">Declined</option>
                    </select>
                  ) : (
                    requestor.status
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userRole === "WORKER" ? (
                    <div>
                      {/* File Upload */}
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        {requestor.attachedFile
                          ? "Replace Attached File"
                          : "Attach File"}
                      </label>
                      <input
                        type="file"
                        accept="application/pdf, image/*"
                        onChange={(e) =>
                          handleFileUpload(requestor.id, e.target.files[0])
                        }
                        className="mb-2"
                      />

                      {/* View Attached File */}
                      {requestor.attachedFile && (
                        <a
                          href={requestor.attachedFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  ) : (
                    requestor.attachedFile && (
                      <a
                        href={requestor.attachedFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View File
                      </a>
                    )
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <ViewHealthRecord studentId={requestor.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
