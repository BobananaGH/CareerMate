import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";

export default function RecruiterApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api
      .get("/jobs/applications/")
      .then((res) => setApps(res.data))
      .catch(() => alert("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    try {
      await api.patch(`/jobs/applications/${id}/`, { status });
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loading text="Loading applications..." />;

  if (!apps.length)
    return (
      <main style={{ padding: 30 }}>
        <h1>Applicants</h1>
        <p>No applications yet.</p>
      </main>
    );

  return (
    <main style={{ padding: 30 }}>
      <h1>Applicants</h1>

      {apps.map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "10px 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <span style={{ minWidth: 220 }}>{a.candidate_email}</span>

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

          {updatingId === a.id && (
            <small style={{ opacity: 0.6 }}>Updating...</small>
          )}
        </div>
      ))}
    </main>
  );
}
