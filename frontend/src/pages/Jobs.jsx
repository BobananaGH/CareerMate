import { useEffect, useState } from "react";
import api from "../api";
import Loading from "../components/Loading";
import styles from "./css/Jobs.module.css";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Jobs() {
  console.log("JOBS COMPONENT MOUNTED");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("FETCHING JOBS");
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
        {jobs.map((job) => {
          console.log(job);

          return (
            <Card
              key={job.id}
              title={job.title}
              footer={job.location}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              {job.description.slice(0, 120)}...
            </Card>
          );
        })}
      </div>
    </main>
  );
}
