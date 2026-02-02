import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import styles from "./css/Jobs.module.css";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    location: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/");
      setJobs(res.data);
    } catch {
      alert("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const createJob = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await api.post("/jobs/", form);

      setJobs((prev) => [res.data, ...prev]);

      setForm({
        title: "",
        description: "",
        skills: "",
        location: "",
      });
    } catch {
      alert("Failed to create job");
    } finally {
      setCreating(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;

    setJobs((prev) => prev.filter((j) => j.id !== id));

    try {
      await api.delete(`/jobs/${id}/`);
    } catch {
      alert("Delete failed");
      fetchJobs();
    }
  };

  if (loading) return <Loading text="Loading my jobs..." />;

  return (
    <main className={styles.page}>
      <h1>My Job Posts</h1>

      {/* Create Job */}
      <form onSubmit={createJob} className={styles.form}>
        <input
          name="title"
          placeholder="Job title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="skills"
          placeholder="Skills"
          value={form.skills}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <button className="btn btnPrimary" disabled={creating}>
          {creating ? "Creating..." : "Create Job"}
        </button>
      </form>

      {!jobs.length && <p>No jobs yet.</p>}

      {/* Job List */}
      <div className={styles.list}>
        {jobs.map((job) => (
          <div key={job.id} className={styles.card}>
            <h3>{job.title}</h3>
            <p>{job.description.slice(0, 120)}...</p>

            <small>{job.location}</small>

            <div style={{ marginTop: 10 }}>
              <button
                className="btn"
                onClick={() => deleteJob(job.id)}
                style={{ color: "#dc2626" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
