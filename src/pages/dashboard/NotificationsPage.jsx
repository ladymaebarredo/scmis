import { useUser } from "../../providers/UserProvider";
import { NotificationCard } from "../../components/NotificationCard";
import { BellIcon } from "lucide-react"; // Add loader icon
import { useEffect } from "react";
import { readNotification } from "../../utils/notifications";

export default function NotificationsPage() {
  const { notifications } = useUser();
  const unreadNotifications = notifications.filter(
    (notification) => !notification.viewed
  );

  return (
    <main className="p-6 sm:p-8 lg:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 flex items-center space-x-2 mb-10">
        <BellIcon className="text-blue-500 w-8 h-8" />
        <span>Notifications</span>
      </h1>
      <section className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              notification={notification}
              key={notification.id}
            />
          ))
        ) : (
          <div className="text-gray-500">You have no notifications.</div>
        )}
      </section>
    </main>
  );
}
