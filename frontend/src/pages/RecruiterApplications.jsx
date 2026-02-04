import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import styles from "./css/Jobs.module.css";

export default function RecruiterApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get("/jobs/applications/");
      setApps(res.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);

    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    try {
      await api.patch(`/jobs/applications/${id}/`, { status });
    } catch {
      fetchApps();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loading text="Loading applications" />;

  if (!apps.length)
    return (
      <main className={styles.page}>
        <h1>Applicants</h1>
        <p>No applications yet.</p>
      </main>
    );

  /* Group by job title */
  const grouped = apps.reduce((acc, app) => {
    acc[app.job_title] = acc[app.job_title] || [];
    acc[app.job_title].push(app);
    return acc;
  }, {});

  return (
    <main className={styles.page}>
      <h1>Applicants</h1>

      {Object.entries(grouped).map(([jobTitle, applications]) => (
        <section key={jobTitle} className={styles.group}>
          <h2 style={{ marginBottom: 10 }}>{jobTitle}</h2>

          {applications.map((a) => (
            <div key={a.id} className={styles.row}>
              <span>{a.candidate_email}</span>

              <select
                value={a.status}
                disabled={updatingId === a.id}
                onChange={(e) => updateStatus(a.id, e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
