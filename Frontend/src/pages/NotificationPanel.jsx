import { useState, useEffect } from "react";

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Dada mota sent you a message", read: false },
    { id: 2, text: "Raja buana suar liked your post", read: false },
    { id: 3, text: "Tv commented on your update", read: false },
  ]);

  // ✅ Mark as read on click
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // ✅ FUTURE: Backend API se notifications fetch karne ke liye useEffect
  /*
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications"); // Backend endpoint
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, []);
  */

  // ✅ FUTURE: Backend API se read status update karna
  /*
  const handleMarkReadAPI = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`); // Backend endpoint
      handleMarkRead(id);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };
  */

  return (
    <div className="h-screen w-full flex justify-center items-start bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Notifications</h2>

        <div className="flex-1 overflow-y-auto space-y-3">
          {notifications.length === 0 && (
            <p className="text-gray-500 text-center">No notifications</p>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)} // FUTURE: replace with handleMarkReadAPI(n.id)
              className={`p-4 rounded-xl border cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                n.read ? "bg-gray-200 text-gray-500" : "bg-purple-50 text-gray-800"
              }`}
            >
              <span>{n.text}</span>
              {!n.read && (
                <span className="text-xs text-white bg-purple-600 px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => setNotifications([])} // FUTURE: backend delete all
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
