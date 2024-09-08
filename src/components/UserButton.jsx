import { useUser } from "../providers/UserProvider";

export function UserButton() {
  const { user, userData } = useUser();
  return (
    <div className="flex gap-2 items-center justify-center">
      <p className="font-bold text-white/50 text-ellipsis">
        {userData.firstname} {userData.lastname}
      </p>
      <p>/</p>
      <p className="font-semibold">
        {user.data.role == "WORKER" ? userData.workerType : user.data.role}
      </p>
    </div>
  );
}
