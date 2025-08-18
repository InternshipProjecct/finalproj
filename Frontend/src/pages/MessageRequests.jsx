import { useState } from "react";

export default function MessageRequests() {
  const [requests, setRequests] = useState([
    { id: 1, name: "Dada mota", message: "Wants to connect with you", status: "pending" },
    { id: 2, name: "Raja suar", message: "Sent you a message request", status: "pending" },
    { id: 3, name: "TV", message: "Wants to chat with you", status: "pending" },
  ]);

  // ✅ Local Accept/Reject handler
  const handleAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: action } : req
      )
    );
  };

  // ✅ FUTURE: Backend API ke liye
  /*
  const handleActionAPI = async (id, action) => {
    try {
      await axios.put(`/api/requests/${id}`, { status: action }); // Backend endpoint
      handleAction(id, action); // local update
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };
  */

  return (
    <div className="h-screen w-full flex justify-center items-start bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Message Requests</h2>

        <div className="flex-1 overflow-y-auto space-y-3">
          {requests.length === 0 && (
            <p className="text-gray-500 text-center">No requests</p>
          )}

          {requests.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded-xl border flex justify-between items-center ${
                req.status === "pending"
                  ? "bg-purple-50 text-gray-800"
                  : req.status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div>
                <p className="font-semibold">{req.name}</p>
                <p className="text-sm">{req.message}</p>
                {req.status !== "pending" && (
                  <p className="text-xs italic mt-1">
                    {req.status === "accepted" ? "Accepted" : "Rejected"}
                  </p>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAction(req.id, "accepted")} // FUTURE: handleActionAPI
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "rejected")} // FUTURE: handleActionAPI
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
