import { useUser } from "../../providers/UserProvider";
import {
  User,
  BarChart,
  ClipboardList,
  LayoutDashboardIcon,
} from "lucide-react";

export default function DashboardPage() {
  const { user, userData } = useUser();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2">
        <LayoutDashboardIcon className="text-blue-500 w-8 h-8" />
        <span>Dashboard</span>
      </h1>
      <p className="text-gray-600 text-2xl my-10">
        Welcome,{" "}
        {user.data.role == "WORKER" ? userData.workerType : user.data.role}{" "}
        {userData.firstname} {userData.lastname}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <User className="text-blue-500 w-12 h-12 mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Your Profile
            </h2>
            <p className="text-gray-600">
              {" "}
              {user.data.role == "WORKER"
                ? userData.workerType
                : user.data.role}
            </p>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <BarChart className="text-green-500 w-12 h-12 mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
            <p className="text-gray-600">Overview of your activity</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <ClipboardList className="text-yellow-500 w-12 h-12 mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Appointments
            </h2>
            <p className="text-gray-600">Manage your appointments.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
