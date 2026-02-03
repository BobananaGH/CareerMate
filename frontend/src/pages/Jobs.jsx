import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import styles from "./css/Jobs.module.css";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/jobs/")
      .then((res) => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading jobs" />;

  return (
    <main className={styles.page}>
      <h1>Open Positions</h1>

      <div className={styles.list}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={styles.card}
            onClick={() => navigate(`/jobs/${job.id}`)}
          >
            <h2>{job.title}</h2>
            <p>{job.description.slice(0, 120)}...</p>
            <small>{job.location}</small>
          </div>
        ))}
      </div>
    </main>
  );
}
