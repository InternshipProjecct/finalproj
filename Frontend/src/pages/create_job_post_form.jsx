import { useState } from "react";

export default function JobPostForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    location: "",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setLoading(true);

    const newJob = {
      ...formData,
      skills: formData.skills.split(",").map((s) => s.trim()), // convert comma-separated to array
      applicants: [], // default empty
    };

    // ✅ FUTURE: POST to backend
    // await API.post("/jobs", newJob);

    // Local simulation
    setTimeout(() => {
      const post = { id: Date.now(), ...newJob, date: new Date().toLocaleString() };
      setPosts([post, ...posts]);
      setFormData({ title: "", description: "", skills: "", location: "" });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
          Create Job Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            rows={4}
            required
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
