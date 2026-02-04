import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import styles from "./css/Jobs.module.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}/`);
        setJob(res.data);
        setApplied(Boolean(res.data.applied));
      } catch {
        setJob(null);
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <Loading text="Loading job" />;
  if (!job) return <Loading text="Job not found" />;

  const apply = async () => {
    if (applying) return;

    setApplying(true);
    setError("");

    try {
      await api.post("/jobs/apply/", { job: id });
      setApplied(true);
    } catch {
      setError("Failed to apply for this job");
    } finally {
      setApplying(false);
    }
  };

  const unapply = async () => {
    if (applying) return;

    if (!window.confirm("Withdraw application?")) return;

    setApplying(true);
    setError("");

    try {
      await api.delete(`/jobs/unapply/${id}/`);
      setApplied(false);
    } catch {
      setError("Failed to unapply");
    } finally {
      setApplying(false);
    }
  };

  return (
    <main className={styles.resultPage}>
      <section className={styles.resultBox}>
        <h1>{job.title}</h1>

        <small>{job.location}</small>

        <hr />

        <p>{job.description}</p>

        {error && <p style={{ color: "crimson", marginBottom: 16 }}>{error}</p>}

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <button
            className="btn btnOutline"
            onClick={() => navigate(-1)}
            disabled={applying}
          >
            <i className="fa-solid fa-arrow-left" /> Back
          </button>

          {applied ? (
            <button
              className="btn btnDanger"
              onClick={unapply}
              disabled={applying}
            >
              {applying ? "Removing..." : "Unapply"}
            </button>
          ) : (
            <button
              className="btn btnPrimary"
              onClick={apply}
              disabled={applying}
            >
              {applying ? "Applying..." : "Apply"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
