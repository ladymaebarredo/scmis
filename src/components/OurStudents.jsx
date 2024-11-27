import { useEffect, useState } from "react";
import { getStudents } from "../utils/student";
import { StudentsTable } from "./UsersTable";

export default function OurStudents({ department }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchStudents() {
      const students = await getStudents(department);
      console.log(students);
      setStudents(students);
    }
    fetchStudents();
  }, []);

  return (
    <div>
      <h1 className="font-bold">Students of {department}</h1>
      <StudentsTable students={students} />
    </div>
  );
}
