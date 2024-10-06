import { useEffect, useState } from "react";
import { Mail, User, Calendar, Briefcase, Tag, FileText } from "lucide-react"; // Import icons
import { getUserData, getUser } from "../../utils/user";
import { useSearchParams } from "react-router-dom";
import { LoadingPage } from "../LoadingPage";
import { HealthRecordForm } from "../../components/HealthRecordForm";

export default function ProfilePage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async (user) => {
    try {
      const data = await getUserData(user.id, user.data.role);
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchUser = async (uid) => {
    try {
      const user = await getUser(uid);
      setUser(user);
      console.log(user);
      if (user) {
        await fetchUserData(user); // Pass the user object to fetchUserData
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false); // Set loading to false after user data is fetched
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, []);
  if (loading) return <LoadingPage />;
  if (!user || !userData) return <>User not Found</>;
  switch (user.data.role) {
    case "STUDENT":
      return (
        <>
          <StudentProfile userData={userData} user={user} />
          <HealthRecordForm profileData={userData} />
        </>
      );
    case "EMPLOYEE":
      return <EmployeeProfile userData={userData} user={user} />;
    case "WORKER":
      return <WorkerProfile userData={userData} user={user} />;
    default:
      return null;
  }
}

function StudentProfile({ userData, user }) {
  return (
    <div className="container md:p-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md py-5 px-5 md:p-10">
        <div className="flex flex-col md:flex-row items-center mb-8 text-center md:text-left">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold">
            {userData.firstname[0]}
            {userData.lastname[0]}
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData.firstname} {userData.middlename || ""}{" "}
              {userData.lastname}
            </h1>
            <p className="text-lg text-gray-600">{userData.program}</p>
            <p className="text-md text-gray-500">{userData.department}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
            <User className="text-blue-500 w-6 h-6" />
            <span>Account Details</span>
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="flex items-center space-x-2">
              <Mail className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Email:</span> {user.data.email}
            </p>
            <p className="flex items-center space-x-2">
              <FileText className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Onboarded:</span>{" "}
              {user.data.onboarded ? "Yes" : "No"}
            </p>
            <p className="flex items-center space-x-2">
              <User className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Role:</span> {user.data.role}
            </p>
            <p className="flex items-center space-x-2">
              <Calendar className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(user.data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Academic Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
            <FileText className="text-green-500 w-6 h-6" />
            <span>Academic Details</span>
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="flex items-center space-x-2">
              <User className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Student ID:</span>{" "}
              {userData.studentId}
            </p>
            <p className="flex items-center space-x-2">
              <FileText className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Program:</span> {userData.program}
            </p>
            <p className="flex items-center space-x-2">
              <FileText className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Year Level:</span>{" "}
              {userData.yearLevel}
            </p>
            <p className="flex items-center space-x-2">
              <FileText className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Department:</span>{" "}
              {userData.department}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function EmployeeProfile({ userData, user }) {
  return (
    <div className="container md:p-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md py-5 px-5 md:p-10">
        <div className="flex flex-col md:flex-row items-center mb-8 text-center md:text-left">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold">
            {userData.firstname[0]}
            {userData.lastname[0]}
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData.firstname} {userData.middlename || ""}{" "}
              {userData.lastname}
            </h1>
            <p className="text-lg text-gray-600">{userData.employeeType}</p>
            <p className="text-md text-gray-500">{userData.assignment}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
            <User className="text-blue-500 w-6 h-6" />
            <span>Account Details</span>
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="flex items-center space-x-2">
              <Tag className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Employee ID:</span>{" "}
              {userData.employeeId}
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Email:</span> {user.data.email}
            </p>
            <p className="flex items-center space-x-2">
              <Briefcase className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Onboarded:</span>{" "}
              {user.data.onboarded ? "Yes" : "No"}
            </p>
            <p className="flex items-center space-x-2">
              <User className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Role:</span> {user.data.role}
            </p>
            <p className="flex items-center space-x-2">
              <Calendar className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(user.data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
            <Briefcase className="text-green-500 w-6 h-6" />
            <span>Additional Information</span>
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="flex items-center space-x-2">
              <Tag className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Assignment:</span>{" "}
              {userData.assignment}
            </p>
            <p className="flex items-center space-x-2">
              <Briefcase className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Employee Type:</span>{" "}
              {userData.employeeType}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
function WorkerProfile({ userData, user }) {
  return (
    <div className="container md:p-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md py-5 px-5 md:p-10">
        <div className="flex flex-col md:flex-row items-center mb-8 text-center md:text-left">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold">
            {userData.firstname[0]}
            {userData.lastname[0]}
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {userData.firstname} {userData.middlename || ""}{" "}
              {userData.lastname}
            </h1>
            <p className="text-lg text-gray-600">{userData.workerType}</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
            <User className="text-blue-500 w-6 h-6" />
            <span>Account Details</span>
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="flex items-center space-x-2">
              <Mail className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Email:</span> {user.data.email}
            </p>
            <p className="flex items-center space-x-2">
              <Tag className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Onboarded:</span>{" "}
              {user.data.onboarded ? "Yes" : "No"}
            </p>
            <p className="flex items-center space-x-2">
              <User className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Role:</span> {user.data.role}
            </p>
            <p className="flex items-center space-x-2">
              <Calendar className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(user.data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
            <Tag className="text-green-500 w-6 h-6" />
            <span>Additional Information</span>
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="flex items-center space-x-2">
              <Tag className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Worker ID:</span>{" "}
              {userData.workerId}
            </p>
            <p className="flex items-center space-x-2">
              <Tag className="text-gray-500 w-5 h-5" />
              <span className="font-semibold">Worker Type:</span>{" "}
              {userData.workerType}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
