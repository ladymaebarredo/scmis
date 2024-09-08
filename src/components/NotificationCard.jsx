import { Bell, CheckCircle } from "lucide-react";
import { deleteNotification, readNotification } from "../utils/notifications";

export function NotificationCard({ notification }) {
  const handleRead = async () => {
    await readNotification(notification.id);
  };

  const handleDelete = async () => {
    await deleteNotification(notification.id);
  };

  return (
    <div className="w-full md:w-[35rem] border-2 border-gray-200 p-6 rounded-xl flex gap-4 items-center drop-shadow-lg bg-white">
      <div
        className={`flex-shrink-0 rounded-full p-2 ${
          notification.viewed ? "bg-gray-200" : "bg-blue-500"
        }`}
      >
        {notification.viewed ? (
          <CheckCircle className="w-6 h-6 text-gray-600" />
        ) : (
          <Bell className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold mb-1">{notification.message}</h1>
        <p className="text-sm text-gray-500">
          {new Date(notification.notifiedAt.seconds * 1000).toLocaleString()}
        </p>
      </div>
      {!notification.viewed ? (
        <div onClick={handleRead} className="text-blue-500 cursor-pointer">
          Mark as read
        </div>
      ) : (
        <div onClick={handleDelete} className="text-red-500 cursor-pointer">
          Delete
        </div>
      )}
    </div>
  );
}
