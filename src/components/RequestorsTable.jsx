import { useState } from "react";
import ViewHealthRecord from "./ViewHealthRecord";

export default function RequestorsTable({
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

                {userRole === "WORKER" ? (
                  <td className="border border-gray-300 px-4 py-2">
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
                  </td>
                ) : (
                  <td className="border border-gray-300 px-4 py-2">
                    {requestor.status}
                  </td>
                )}
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
