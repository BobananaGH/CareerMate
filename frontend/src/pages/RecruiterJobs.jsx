import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import styles from "./css/Jobs.module.css";
import Card from "../components/Card";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

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

      setShowCreate(false);
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
      fetchJobs();
    }
  };

  if (loading) return <Loading text="Loading my jobs" />;

  return (
    <main className={styles.page}>
      {/* Header */}
      <div className={styles.headerRow}>
        <h1>My Job Posts</h1>

        {!showCreate && (
          <button
            className="btn btnPrimary"
            onClick={() => setShowCreate(true)}
          >
            <i className="fa-solid fa-plus" />
            Create Job
          </button>
        )}
      </div>

      {/* CREATE MODE */}
      {showCreate && (
        <div className={styles.group}>
          <h2>Create Job</h2>

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

            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <button className="btn btnPrimary" disabled={creating}>
                {creating ? "Creating..." : "Create"}
              </button>

              <button
                type="button"
                className="btn btnOutline"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST MODE */}
      {!showCreate && (
        <>
          {!jobs.length && <p>No jobs yet.</p>}

          <div className={styles.list}>
            {jobs.map((job) => (
              <Card
                key={job.id}
                title={job.title}
                footer={`${job.location}`}
                actions={
                  <button
                    className="btn btnDanger btnSm"
                    onClick={() => deleteJob(job.id)}
                  >
                    <i className="fa-solid fa-trash" /> Delete
                  </button>
                }
              >
                {job.description.length > 120
                  ? job.description.slice(0, 120) + "..."
                  : job.description}
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
