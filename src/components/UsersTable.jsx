import { Link } from "react-router-dom";

export function StudentsTable({ students }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-gray-600">First Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Middle Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Last Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Department</th>
            <th className="py-2 px-4 text-left text-gray-600">Year Level</th>
            <th className="py-2 px-4 text-left text-gray-600">Student ID</th>
            <th className="py-2 px-4 text-left text-gray-600">Program</th>
            <th className="py-2 px-4 text-left text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmployeesTable({ employees }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-gray-600">First Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Middle Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Last Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Employee Type</th>
            <th className="py-2 px-4 text-left text-gray-600">Assignment</th>
            <th className="py-2 px-4 text-left text-gray-600">Employee ID</th>
            <th className="py-2 px-4 text-left text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WorkersTable({ workers }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 text-left text-gray-600">First Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Middle Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Last Name</th>
            <th className="py-2 px-4 text-left text-gray-600">Worker Type</th>
            <th className="py-2 px-4 text-left text-gray-600">Worker ID</th>
            <th className="py-2 px-4 text-left text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
