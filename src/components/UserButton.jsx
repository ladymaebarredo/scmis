import { useUser } from "../providers/UserProvider";

export function UserButton() {
  const { user, userData } = useUser();

  let roleTag = null;

  if (user.data.role === "EMPLOYEE" && userData.employeeType === "teaching") {
    if (userData.isDean) {
      roleTag = <span className="text-green-500 font-semibold">Dean</span>;
    }
  }

  return (
    <div className="flex gap-2 items-center justify-center">
      {roleTag && <span className="mr-2 p-sm">{roleTag}</span>}
      <p className="font-bold text-white/50 text-ellipsis">
        {userData.firstname} {userData.lastname}
      </p>
      <p>/</p>
      <p className="font-semibold">
        {user.data.role === "WORKER" ? userData.workerType : user.data.role}
      </p>
    </div>
  );
}
