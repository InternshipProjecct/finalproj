import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function UserPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 🔹 Fetch user info
        const userRes = await API.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(userRes.data);

        // ✅ check if already requested
        const loggedInUserId = localStorage.getItem("userId");
        if (userRes.data.connectionRequests?.includes(loggedInUserId)) {
          setRequestSent(true);
        }

        // 🔹 Fetch user posts
        const postRes = await API.get(`/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postRes.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Handle Send Request
  const handleSendRequest = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await API.post(
        "/users/connections/send",
        { targetUserId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestSent(true);
      alert("✅ Connection request sent!");
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("❌ Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6">
      {/* Banner + ProfilePic */}
      <div className="relative">
        <img
          src={profile.bannerPic || "https://picsum.photos/800/200"}
          alt="banner"
          className="w-full h-48 object-cover rounded-lg"
        />
        <img
          src={profile.profilePic || "https://picsum.photos/100"}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white absolute -bottom-12 left-6"
        />
      </div>

      {/* Info */}
      <div className="mt-14 px-6">
        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
        <p className="text-gray-600">{profile.bio || "No bio available"}</p>
        {profile.skills?.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Skills: {profile.skills.join(", ")}
          </p>
        )}

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSendRequest}
            disabled={loading || requestSent}
            className={`px-4 py-2 rounded-lg text-white ${
              requestSent
                ? "bg-green-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {requestSent ? "Request Sent" : loading ? "Sending..." : "Send Request"}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">Posts</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="border-b py-3">
              <p>{post.content}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="mt-2 rounded-lg max-h-60 object-cover"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No posts yet</p>
        )}
      </div>
    </div>
  );
}
