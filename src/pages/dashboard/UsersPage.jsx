import React, { useEffect, useState } from "react";
import { getUsersData } from "../../utils/user";
import { Users, User, Briefcase, HardHat, UserSearch } from "lucide-react"; // Import icons

import {
  EmployeesTable,
  StudentsTable,
  WorkersTable,
} from "../../components/UsersTable";

export default function UsersPage() {
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingWorkers, setLoadingWorkers] = useState(true);

  const fetchStudents = async () => {
    try {
      const data = await getUsersData("students");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students data:", error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getUsersData("employees");
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees data:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const data = await getUsersData("workers");
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers data:", error);
    } finally {
      setLoadingWorkers(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchEmployees();
    fetchWorkers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2 mb-10">
        <UserSearch className="text-blue-500 w-8 h-8" />
        <span>Users</span>
      </h1>
      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <Users className="w-8 h-8 text-red-600 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Students</h2>
        </div>
        {loadingStudents ? (
          <p>Loading students...</p>
        ) : (
          <StudentsTable students={students} />
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <User className="w-8 h-8 text-green-600 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
        </div>
        {loadingEmployees ? (
          <p>Loading employees...</p>
        ) : (
          <EmployeesTable employees={employees} />
        )}
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <HardHat className="w-8 h-8 text-yellow-600 mr-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Workers</h2>
        </div>
        {loadingWorkers ? (
          <p>Loading workers...</p>
        ) : (
          <WorkersTable workers={workers} />
        )}
      </section>
    </div>
  );
}
