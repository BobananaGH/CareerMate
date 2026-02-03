import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}/`)
      .then((res) => setJob(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!job) return <Loading text="Job not found" />;
  const apply = async () => {
    setApplying(true);
    try {
      await api.post("/jobs/apply/", { job: id });
      alert("Applied!");
    } catch {
      alert("Already applied");
    } finally {
      setApplying(false);
    }
  };

  return (
    <main style={{ padding: 60 }}>
      <h1>{job.title}</h1>
      <p>{job.description}</p>

      <button className="btn btnPrimary" onClick={apply} disabled={applying}>
        {applying ? "Applying..." : "Apply"}
      </button>
    </main>
  );
}
