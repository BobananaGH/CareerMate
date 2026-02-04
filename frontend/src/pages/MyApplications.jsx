import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Loading from "../components/Loading";
import Card from "../components/Card";
import styles from "./css/Jobs.module.css";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/jobs/my-applications/")
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading applications" />;

  return (
    <main className={styles.page}>
      <h1>My Applications</h1>

      {apps.length === 0 && (
        <p className={styles.empty}>You haven’t applied to any jobs yet.</p>
      )}

      <div className={styles.list}>
        {apps.map((a) => (
          <Card
            key={a.id}
            title={a.job_title}
            footer={`Status: ${a.status} • ${new Date(
              a.created_at,
            ).toLocaleDateString()}`}
            onClick={() => navigate(`/jobs/${a.job_id}`)}
          >
            {a.job_location}
          </Card>
        ))}
      </div>
    </main>
  );
}
