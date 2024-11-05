import { useState } from "react";
import { departments } from "../utils/globals";
import { offices } from "../utils/globals";
import { createStudent } from "../utils/student";
import { createEmployee } from "../utils/employee";
import { createWorker } from "../utils/worker";

export default function OnboardingPage({ user }) {
  switch (user.data.role) {
    case "STUDENT":
      return <StudentOnboardingForm user={user} />;
    case "EMPLOYEE":
      return <EmployeeOnboardingForm user={user} />;
    case "WORKER":
      return <WorkerOnboardingForm user={user} />;
    default:
      return null;
  }
}

function EmployeeOnboardingForm({ user }) {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [assignment, setAssignment] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [isDean, setIsDean] = useState(false);  // New state for the checkbox

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmployeeTypeChange = (e) => {
    const type = e.target.value;
    setEmployeeType(type);
    setAssignment("");  // Reset assignment when employee type changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createEmployee(
        firstname,
        middlename,
        lastname,
        employeeId,
        employeeType,
        assignment,
        user.id,
        isDean // Include isDean in the submission
      );
      if (res.success) {
        // Handle successful submission, e.g., navigate to the dashboard
        window.location.reload();
      } else {
        // Handle errors and update state
        setError(res.message);
      }
    } catch (error) {
      setError("An error occurred during submission.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 bg-red-950 h-screen flex justify-center items-center">
      <form
        className="flex flex-col gap-4 w-[800px] bg-white p-10 rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-lg font-semibold mb-5">Employee Onboarding</h1>
        
        {/* First Name */}
        <section className="flex flex-col">
          <label htmlFor="firstname" className="text-gray-500">Firstname</label>
          <input
            required
            type="text"
            placeholder="Firstname"
            id="firstname"
            name="firstname"
            className="p-2"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </section>

        {/* Middle Name */}
        <section className="flex flex-col">
          <label htmlFor="middlename" className="text-gray-500">Middlename</label>
          <input
            required
            type="text"
            placeholder="Middlename"
            id="middlename"
            name="middlename"
            className="p-2"
            value={middlename}
            onChange={(e) => setMiddlename(e.target.value)}
          />
        </section>

        {/* Last Name */}
        <section className="flex flex-col">
          <label htmlFor="lastname" className="text-gray-500">Lastname</label>
          <input
            required
            type="text"
            placeholder="Lastname"
            id="lastname"
            name="lastname"
            className="p-2"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </section>

        {/* Employee ID */}
        <section className="flex flex-col">
          <label htmlFor="employeeId" className="text-gray-500">Employee ID</label>
          <input
            required
            type="text"
            placeholder="Employee ID"
            id="employeeId"
            name="employeeId"
            className="p-2"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </section>

        {/* Employee Type */}
        <section className="flex flex-col">
          <label htmlFor="employeeType" className="text-gray-500">Employee Type</label>
          <select
            id="employeeType"
            name="employeeType"
            className="p-2"
            value={employeeType}
            onChange={handleEmployeeTypeChange}
          >
            <option value="">Select Employee Type</option>
            <option value="teaching">Teaching</option>
            <option value="non-teaching">Non-Teaching</option>
          </select>
        </section>

        {/* If Employee Type is Teaching, show the isDean checkbox */}
        {employeeType === "teaching" && (
          <>
            <section className="flex gap-4">
              <label htmlFor="isDean" className="text-gray-500">Dean</label>
              <input
                type="checkbox"
                id="isDean"
                name="isDean"
                checked={isDean}
                onChange={(e) => setIsDean(e.target.checked)}
              />
            </section>

            <section className="flex flex-col">
              <label htmlFor="assignment" className="text-gray-500">Department</label>
              <select
                id="assignment"
                name="assignment"
                className="p-2"
                value={assignment}
                onChange={(e) => setAssignment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.shortname} value={dept.shortname}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </section>
          </>
        )}

        {/* If Employee Type is Non-Teaching, show office assignment */}
        {employeeType === "non-teaching" && (
          <section className="flex flex-col">
            <label htmlFor="assignment" className="text-gray-500">Office</label>
            <select
              id="assignment"
              name="assignment"
              className="p-2"
              value={assignment}
              onChange={(e) => setAssignment(e.target.value)}
            >
              <option value="">Select Office</option>
              {offices.map((office) => (
                <option key={office.shortname} value={office.shortname}>
                  {office.name}
                </option>
              ))}
            </select>
          </section>
        )}

        {/* Submit button */}
        <section className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-red-950 px-10 py-3 rounded-lg text-white"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </section>

        {/* Error message */}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </main>
  );
}

function StudentOnboardingForm({ user }) {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [yearLevel, setYearLevel] = useState(1);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepartment(selectedDepartment);
    setProgram(""); // Reset program selection
  };

  const handleYearLevelChange = (e) => {
    const level = parseInt(e.target.value);
    if (level <= 0 || level > 4) return;
    setYearLevel(level);
  };

  const selectedDepartment = departments.find(
    (dept) => dept.shortname === department
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createStudent(
        firstname,
        middlename,
        lastname,
        studentId,
        department,
        program,
        yearLevel,
        user.id
      );
      if (res.success) {
        // Handle successful login, e.g., navigate to the dashboard
        window.location.reload();
      } else {
        // Handle errors and update state
        setError(res.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 bg-red-950 h-screen flex justify-center items-center">
      <form
        className="flex flex-col gap-4 w-[800px] bg-white p-10 rounded-xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-lg font-semibold mb-5">Student Onboarding</h1>
        <section className="flex flex-col">
          <label htmlFor="firstname" className="text-gray-500">
            Firstname
          </label>
          <input
            required
            type="text"
            placeholder="Firstname"
            id="firstname"
            name="firstname"
            className="p-2"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="middlename" className="text-gray-500">
            Middlename
          </label>
          <input
            required
            type="text"
            placeholder="Middlename"
            id="middlename"
            name="middlename"
            className="p-2"
            value={middlename}
            onChange={(e) => setMiddlename(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="lastname" className="text-gray-500">
            Lastname
          </label>
          <input
            required
            type="text"
            placeholder="Lastname"
            id="lastname"
            name="lastname"
            className="p-2"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="studentId" className="text-gray-500">
            Student ID
          </label>
          <input
            required
            type="text"
            placeholder="Student ID"
            id="studentId"
            name="studentId"
            className="p-2"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="department" className="text-gray-500">
            Department
          </label>
          <select
            id="department"
            name="department"
            className="p-2"
            value={department}
            onChange={handleDepartmentChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.shortname} value={dept.shortname}>
                {dept.name}
              </option>
            ))}
          </select>
        </section>
        <section className="flex flex-col">
          <label htmlFor="program" className="text-gray-500">
            Program
          </label>
          <select
            id="program"
            name="program"
            className="p-2"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            disabled={!selectedDepartment}
          >
            <option value="">Select Program</option>
            {selectedDepartment &&
              selectedDepartment.programs.map((prog) => (
                <option key={prog.shortname} value={prog.shortname}>
                  {prog.name}
                </option>
              ))}
          </select>
        </section>
        <section className="flex flex-col">
          <label htmlFor="yearLevel" className="text-gray-500">
            Year Level
          </label>
          <input
            required
            type="number"
            placeholder="Year Level"
            id="yearLevel"
            name="yearLevel"
            className="p-2"
            value={yearLevel}
            onChange={handleYearLevelChange}
          />
        </section>
        <section className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-red-950 px-10 py-3 rounded-lg text-white"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </section>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </main>
  );
}

function WorkerOnboardingForm({ user }) {
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [workerType, setWorkerType] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await createWorker(
        firstname,
        middlename,
        lastname,
        workerId,
        workerType,
        user.id
      );
      if (res.success) {
        // Handle successful login, e.g., navigate to the dashboard
        window.location.reload();
      } else {
        // Handle errors and update state
        setError(res.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-red-950 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[800px] bg-white p-10 rounded-xl"
      >
        <h1 className="text-lg font-semibold mb-5">Worker Onboarding</h1>
        <section className="flex flex-col">
          <label htmlFor="firstname" className="text-gray-500">
            Firstname
          </label>
          <input
            required
            type="text"
            placeholder="Firstname"
            id="firstname"
            name="firstname"
            className="p-2"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="middlename" className="text-gray-500">
            Middlename
          </label>
          <input
            required
            type="text"
            placeholder="Middlename"
            id="middlename"
            name="middlename"
            className="p-2"
            value={middlename}
            onChange={(e) => setMiddlename(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="lastname" className="text-gray-500">
            Lastname
          </label>
          <input
            required
            type="text"
            placeholder="Lastname"
            id="lastname"
            name="lastname"
            className="p-2"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </section>
        <section className="flex flex-col">
          <label htmlFor="workerType" className="text-gray-500">
            Worker Type
          </label>
          <select
            id="workerType"
            name="workerType"
            className="p-2"
            value={workerType}
            onChange={(e) => setWorkerType(e.target.value)}
          >
            <option value="">Select Worker Type</option>
            <option value="Nurse">Nurse</option>
            <option value="Physician">Physician</option>
            <option value="Dentist">Dentist</option>
          </select>
        </section>
        <section className="flex flex-col">
          <label htmlFor="workerId" className="text-gray-500">
            Worker ID
          </label>
          <input
            required
            type="text"
            placeholder="Worker ID"
            id="workerId"
            name="workerId"
            className="p-2"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
          />
        </section>
        <section className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-red-950 px-10 py-3 rounded-lg text-white"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </section>
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </main>
  );
}
