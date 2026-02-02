import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs/my-applications/")
      .then((res) => setApps(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading text="Loading applications" />;

  return (
    <main style={{ padding: 60 }}>
      <h1>My Applications</h1>

      {apps.map((a) => (
        <div key={a.id}>
          {a.candidate_email} — {a.status}
        </div>
      ))}
    </main>
  );
}
