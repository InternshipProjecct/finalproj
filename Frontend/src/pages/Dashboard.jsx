
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Heart, UserPlus, LogOut, Plus } from "lucide-react";
import API from "../api/axios";
import CreatePost from "./Createpost";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ✅ Send connection request
  const sendConnectionRequest = async (targetUserId) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/users/connections/send",
        { targetUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove user from suggestions
      setSuggested((prev) => prev.filter((u) => u._id !== targetUserId));
      alert("✅ Connection request sent!");
    } catch (err) {
      console.error("Connection request failed:", err);
      alert("❌ Failed to send request");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // Current user info
        const userRes = await API.get(`/users/${userId}`);
        setUser(userRes.data);

        // Feed posts
        const feedRes = await API.get(`/posts/feed`);
        setPosts(feedRes.data);

        // Suggested users (all except me)
        const usersRes = await API.get(`/users`);
        const filtered = usersRes.data.filter((u) => u._id !== userId);
        setSuggested(filtered);

        // Dummy connections (replace later with backend)
        setConnections([
          { _id: "conn1", name: "Jane Smith", profilePic: "https://picsum.photos/35" },
          { _id: "conn2", name: "Peter Jones", profilePic: "https://picsum.photos/35" },
        ]);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const toggleLike = async (postId) => {
    try {
      const res = await API.put(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: res.data.likes.length, likedByMe: res.data.likedByMe }
            : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ---------- TOP BAR ---------- */}
      <div className="flex justify-between items-center bg-white shadow px-6 py-3">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate(`/profile/${user._id}`)}
        >
          <img
            src={user.profilePic || "https://picsum.photos/40"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold text-gray-700">{user.name}</span>
        </div>

        <div className="cursor-pointer" onClick={() => navigate("/chat")}>
          <MessageCircle className="w-6 h-6 text-purple-600" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* ---------- MAIN LAYOUT ---------- */}
      <div className="flex max-w-7xl mx-auto mt-6 px-4 gap-6">
        {/* LEFT SIDEBAR */}
        <div className="w-1/4 space-y-6">
          {/* Connections */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-lg mb-4 text-purple-600">Follow List</h2>
            {connections.length > 0 ? (
              <ul className="space-y-3">
                {connections.map((conn) => (
                  <li
                    key={conn._id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                    onClick={() => navigate(`/profile/${conn._id}`)}
                  >
                    <img
                      src={conn.profilePic}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span>{conn.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No connections yet</p>
            )}
          </div>

          {/* Suggested Users */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold text-lg mb-4 text-purple-600">Suggested</h2>
            {suggested.length > 0 ? (
              suggested.map((sug) => (
                <div key={sug._id} className="flex items-center justify-between mb-3">
                  {/* Left side: Navigate to user page */}
                  <div
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => navigate(`/userpage/${sug._id}`)}
                  >
                    <img
                      src={sug.profilePic || "https://picsum.photos/35"}
                      alt="suggested"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span>{sug.name}</span>
                  </div>

                  {/* Right side: Send Request Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ stop parent navigation
                      sendConnectionRequest(sug._id);
                    }}
                    className="p-1 rounded-full hover:bg-purple-100"
                  >
                    <UserPlus className="w-5 h-5 text-purple-600" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No suggestions</p>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT (Posts) */}
        <div className="w-3/4 space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col justify-between min-h-[350px]"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={post.userId?.profilePic || "https://picsum.photos/35"}
                    alt="user"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-700">{post.userId?.name}</span>
                </div>

                <div className="flex-1">
                  <p className="text-gray-700">{post.content}</p>
                  {post.image ? (
                    <img
                      src={post.image}
                      alt="post"
                      className="w-full mt-3 rounded-lg object-cover h-40"
                    />
                  ) : (
                    <div className="w-full h-40 mt-3 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-6 mt-4 text-gray-600">
                  <button
                    onClick={() => toggleLike(post._id)}
                    className="flex items-center space-x-2"
                  >
                    <Heart
                      className={`w-5 h-5 ${post.likedByMe ? "fill-red-500 text-red-500" : ""}`}
                    />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No posts yet</p>
          )}
        </div>
      </div>

      {/* ---------- CREATE POST BUTTON ---------- */}
      <button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-purple-700 transition"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ---------- CREATE POST MODAL ---------- */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button
              onClick={() => setShowCreatePost(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <CreatePost onClose={() => setShowCreatePost(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
