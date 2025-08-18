import { useState } from "react";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");
  const [selectedItem, setSelectedItem] = useState(null); // For view modal

  // ✅ Dummy data
  const [users, setUsers] = useState([
    { id: 1, name: "dada", email: "dada@example.com" },
    { id: 2, name: "raja bouna", email: "raja_bouna@example.com" },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, title: "My first post", content: "Hello world!" },
    { id: 2, title: "React is awesome", content: "Learning React step by step" },
  ]);

  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", company: "TechCorp" },
    { id: 2, title: "Backend Developer", company: "CodeHub" },
  ]);

  // ✅ Delete functions
  const handleDelete = (id, type) => {
    if (type === "users") setUsers((prev) => prev.filter((u) => u.id !== id));
    if (type === "posts") setPosts((prev) => prev.filter((p) => p.id !== id));
    if (type === "jobs") setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  // ✅ Modal close
  const closeModal = () => setSelectedItem(null);

  return (
    <div className="h-screen w-full flex justify-center items-start bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Admin Panel</h2>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {["users", "posts", "jobs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Users */}
          {activeTab === "users" &&
            users.map((u) => (
              <div
                key={u.id}
                className="p-4 mb-3 border rounded-lg flex justify-between items-center bg-purple-50"
              >
                <span>
                  <b>{u.name}</b> – {u.email}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedItem({ type: "user", data: u })}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(u.id, "users")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {/* Posts */}
          {activeTab === "posts" &&
            posts.map((p) => (
              <div
                key={p.id}
                className="p-4 mb-3 border rounded-lg flex justify-between items-center bg-green-50"
              >
                <span>
                  <b>{p.title}</b> – {p.content}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedItem({ type: "post", data: p })}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, "posts")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {/* Jobs */}
          {activeTab === "jobs" &&
            jobs.map((j) => (
              <div
                key={j.id}
                className="p-4 mb-3 border rounded-lg flex justify-between items-center bg-blue-50"
              >
                <span>
                  <b>{j.title}</b> – {j.company}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setSelectedItem({ type: "job", data: j })}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(j.id, "jobs")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal for View */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4 text-purple-600">
              {selectedItem.type === "user" && "User Profile"}
              {selectedItem.type === "post" && "Post Details"}
              {selectedItem.type === "job" && "Job Details"}
            </h3>

            {/* Show Data */}
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify(selectedItem.data, null, 2)}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
