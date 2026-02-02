import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import styles from "./AdminMonitor.module.css";
import Loading from "../components/Loading";

const REFRESH_INTERVAL = 30000; // 30s

export default function AdminMonitor({ user }) {
  const [conversations, setConversations] = useState([]);
  const [cvs, setCVs] = useState([]);
  const [expandedConvId, setExpandedConvId] = useState(null);
  const [expandedCvId, setExpandedCvId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [users, setUsers] = useState([]);

  const sortedUsers = useMemo(
    () =>
      [...users].sort(
        (a, b) => new Date(b.date_joined) - new Date(a.date_joined),
      ),
    [users],
  );

  const fetchAdminData = async () => {
    if (initialLoad) setLoading(true);

    try {
      const convRes = await api.get("/admin/monitoring/conversations/");
      setConversations(convRes.data);
    } catch {
      console.warn("Conversations failed");
    }

    try {
      const cvRes = await api.get("/admin/monitoring/cvs/");
      setCVs(cvRes.data);
    } catch {
      console.warn("CVs failed");
    }

    try {
      const usersRes = await api.get("/users/admin/users/");
      setUsers(usersRes.data);
    } catch {
      console.warn("Users endpoint failed");
    }

    try {
      const jobsRes = await api.get("/admin/monitoring/jobs/");
      setJobs(jobsRes.data);
    } catch {
      console.warn("Jobs endpoint failed");
    }

    try {
      const appsRes = await api.get("/admin/monitoring/applications/");
      setApplications(appsRes.data);
    } catch {
      console.warn("Applications endpoint failed");
    }

    setInitialLoad(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.is_staff) return;

    let mounted = true;

    fetchAdminData();

    const interval = setInterval(() => {
      if (mounted) fetchAdminData();
    }, REFRESH_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user]);

  if (!user?.is_staff) return <Navigate to="/" replace />;

  if (loading) return <Loading text="Loading admin monitor" />;

  // ================= FILTERING =================

  const filteredCVs = cvs.filter((cv) => {
    const matchSearch =
      cv.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      cv.extracted_text?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || cv.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const statusColor = (status) => {
    switch (status) {
      case "processed":
        return styles.green;
      case "failed":
        return styles.red;
      default:
        return styles.orange;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Monitor</h1>

      {/* ================= CONTROLS ================= */}

      <div className={styles.controls}>
        <input
          placeholder="Search email or content…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
        </select>

        <button className="btn btnOutline" onClick={fetchAdminData}>
          Refresh
        </button>

        <span className={styles.count}>
          CVs: {filteredCVs.length} / {cvs.length}
        </span>
      </div>

      {/* ================= CONVERSATIONS ================= */}

      <section className={styles.section}>
        <h2>Recent Conversations</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Author</th>
              <th>Messages</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {conversations.map((conv) => (
              <React.Fragment key={conv.id}>
                <tr>
                  <td>{conv.id}</td>
                  <td>{conv.user_email}</td>
                  <td>{conv.messages.length}</td>
                  <td>{new Date(conv.updated_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btnSm"
                      onClick={() =>
                        setExpandedConvId(
                          expandedConvId === conv.id ? null : conv.id,
                        )
                      }
                    >
                      {expandedConvId === conv.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedConvId === conv.id && (
                  <tr>
                    <td colSpan="5">
                      <div className={styles.expandedBox}>
                        {conv.messages.map((m) => (
                          <div key={m.id}>
                            <b>{m.role === "user" ? conv.user_email : "AI"}</b>{" "}
                            <small>
                              {new Date(m.created_at).toLocaleString()}
                            </small>
                            <div>{m.content}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= CVS ================= */}

      <section className={styles.sectionLarge}>
        <h2>CV Uploads</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Author</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th></th>
              <th>File</th>
            </tr>
          </thead>

          <tbody>
            {filteredCVs.map((cv) => (
              <React.Fragment key={cv.id}>
                <tr>
                  <td>{cv.id}</td>
                  <td>{cv.user_email || "—"}</td>

                  <td>
                    <span
                      className={`${styles.badge} ${statusColor(cv.status)}`}
                    >
                      {cv.status || "pending"}
                    </span>
                  </td>

                  <td>{new Date(cv.uploaded_at).toLocaleString()}</td>

                  <td>
                    <button
                      className="btn btnSm"
                      onClick={() =>
                        setExpandedCvId(expandedCvId === cv.id ? null : cv.id)
                      }
                    >
                      {expandedCvId === cv.id ? "Hide" : "View"}
                    </button>
                  </td>

                  <td>
                    <a href={cv.file} target="_blank" rel="noreferrer">
                      Download
                    </a>
                  </td>
                </tr>

                {expandedCvId === cv.id && (
                  <tr>
                    <td colSpan="6">
                      <div className={styles.expandedBox}>
                        <h4>Extracted Text</h4>
                        <pre>{cv.extracted_text || "—"}</pre>

                        <h4>AI Analysis</h4>
                        <pre>{cv.analysis || "—"}</pre>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= USERS ================= */}

      <section className={styles.section}>
        <h2>Users ({sortedUsers.length})</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Staff</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {sortedUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.is_staff ? "Yes" : "No"}</td>
                <td>{new Date(u.date_joined).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className={styles.section}>
        <h2>Jobs ({jobs.length})</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Recruiter</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.title}</td>
                <td>{job.recruiter_email || "—"}</td>
                <td>{new Date(job.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className={styles.section}>
        <h2>Applications ({applications.length})</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Job</th>
              <th>Candidate</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.job_title}</td>
                <td>{a.candidate_email}</td>
                <td>
                  <span className={`${styles.badge} ${statusColor(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td>{new Date(a.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
