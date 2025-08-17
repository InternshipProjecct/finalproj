import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import JobPostForm from "./create_job_post_form";

export default function ViewProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJobForm, setShowJobForm] = useState(false); // ✅ new state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center relative">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          ← Back to Dashboard
        </button>

        {/* Banner */}
        {user.bannerPic && (
          <div className="h-40 w-full rounded-lg overflow-hidden mb-4">
            <img
              src={user.bannerPic}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Profile Info */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.profilePic || "https://via.placeholder.com/100"}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-purple-600">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="mt-2">{user.bio}</p>
          </div>
        </div>

        {/* Skills */}
        {user.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {user.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            {user.experience.map((exp, i) => (
              <div key={i} className="border-b py-2">
                <p className="font-medium">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.role}</p>
                <p className="text-xs text-gray-500">
                  {new Date(exp.from).toLocaleDateString()} -{" "}
                  {exp.to ? new Date(exp.to).toLocaleDateString() : "Present"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {user.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Education</h3>
            {user.education.map((edu, i) => (
              <div key={i} className="border-b py-2">
                <p className="font-medium">{edu.school}</p>
                <p className="text-sm text-gray-600">{edu.degree}</p>
                <p className="text-xs text-gray-500">
                  {new Date(edu.from).toLocaleDateString()} -{" "}
                  {edu.to ? new Date(edu.to).toLocaleDateString() : "Present"}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Connections Count */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Connections</h3>
          <p>{user.connections?.length || 0} connections</p>
        </div>
      </div>

      {/* ---------- JOB POST BUTTON ---------- */}
      <button
        onClick={() => setShowJobForm(true)}
        className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-purple-700 transition z-50"
      >
        Post
      </button>

      {/* ---------- JOB POST MODAL ---------- */}
      {showJobForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          
            <JobPostForm />
          
        </div>
      )}
    </div>
  );
}
