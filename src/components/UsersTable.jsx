import React, { useState } from "react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5; // Define the number of items per page

function PaginatedTable({ data, columns, renderRow }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination details
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            {columns.map((col) => (
              <th key={col} className="py-2 px-4 text-left text-gray-600">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{paginatedData.map(renderRow)}</tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-200 rounded-md ${
            currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-200 rounded-md ${
            currentPage === totalPages
              ? "cursor-not-allowed"
              : "hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function StudentsTable({ students }) {
  const columns = [
    "First Name",
    "Middle Name",
    "Last Name",
    "Department",
    "Year Level",
    "Student ID",
    "Program",
    "Action",
  ];

  const renderRow = (student) => (
    <tr key={student.id} className="border-b hover:bg-gray-50">
      <td className="py-2 px-4">{student.firstname}</td>
      <td className="py-2 px-4">{student.middlename}</td>
      <td className="py-2 px-4">{student.lastname}</td>
      <td className="py-2 px-4">{student.department}</td>
      <td className="py-2 px-4">{student.yearLevel}</td>
      <td className="py-2 px-4">{student.studentId}</td>
      <td className="py-2 px-4">{student.program}</td>
      <td>
        <Link
          to={`/dashboard/profile?id=${student.id}`}
          className="text-red-950 hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  );

  return (
    <PaginatedTable data={students} columns={columns} renderRow={renderRow} />
  );
}

export function EmployeesTable({ employees }) {
  const columns = [
    "First Name",
    "Middle Name",
    "Last Name",
    "Employee Type",
    "Assignment",
    "Employee ID",
    "Action",
  ];

  const renderRow = (employee) => (
    <tr key={employee.id} className="border-b hover:bg-gray-50">
      <td className="py-2 px-4">{employee.firstname}</td>
      <td className="py-2 px-4">{employee.middlename}</td>
      <td className="py-2 px-4">{employee.lastname}</td>
      <td className="py-2 px-4">{employee.employeeType}</td>
      <td className="py-2 px-4">{employee.assignment}</td>
      <td className="py-2 px-4">{employee.employeeId}</td>
      <td>
        <Link
          to={`/dashboard/profile?id=${employee.id}`}
          className="text-red-950 hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  );

  return (
    <PaginatedTable data={employees} columns={columns} renderRow={renderRow} />
  );
}

export function WorkersTable({ workers }) {
  const columns = [
    "First Name",
    "Middle Name",
    "Last Name",
    "Worker Type",
    "Worker ID",
    "Action",
  ];

  const renderRow = (worker) => (
    <tr key={worker.id} className="border-b hover:bg-gray-50">
      <td className="py-2 px-4">{worker.firstname}</td>
      <td className="py-2 px-4">{worker.middlename}</td>
      <td className="py-2 px-4">{worker.lastname}</td>
      <td className="py-2 px-4">{worker.workerType}</td>
      <td className="py-2 px-4">{worker.workerId}</td>
      <td>
        <Link
          to={`/dashboard/profile?id=${worker.id}`}
          className="text-red-950 hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  );

  return (
    <PaginatedTable data={workers} columns={columns} renderRow={renderRow} />
  );
}
