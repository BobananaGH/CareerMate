import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import styles from "./AdminMonitor.module.css";
import Loading from "../components/Loading";

const REFRESH_INTERVAL = 30000;
const PAGE_SIZE = 10;

export default function AdminMonitor({ user }) {
  const [conversations, setConversations] = useState([]);
  const [cvs, setCVs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("cvs");

  const [expandedConvId, setExpandedConvId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const sortedUsers = useMemo(
    () =>
      [...users].sort(
        (a, b) => new Date(b.date_joined) - new Date(a.date_joined),
      ),
    [users],
  );

  const fetchAdminData = useCallback(async () => {
    if (!user?.is_staff) return;
    if (initialLoad && !loading) setLoading(true);

    try {
      const [conv, cv, job, app, usr] = await Promise.all([
        api.get("/admin/monitoring/conversations/"),
        api.get("/admin/monitoring/cvs/"),
        api.get("/admin/monitoring/jobs/"),
        api.get("/admin/monitoring/applications/"),
        api.get("/users/admin/users/"),
      ]);

      setConversations(conv.data);
      setCVs(cv.data);
      setJobs(job.data);
      setApplications(app.data);
      setUsers(usr.data);
    } catch {
      console.warn("Admin fetch failed");
    }

    setInitialLoad(false);
    setLoading(false);
  }, [initialLoad, user]);

  useEffect(() => {
    if (!user?.is_staff) return;
    fetchAdminData();
    const i = setInterval(() => {
      if (!document.hidden) fetchAdminData();
    }, REFRESH_INTERVAL);
    return () => clearInterval(i);
  }, [fetchAdminData, user]);

  useEffect(() => {
    setExpandedConvId(null);
    setPage(1);
  }, [tab, search]);

  if (!user?.is_staff) return <Navigate to="/" replace />;
  if (loading) return <Loading text="Loading admin monitor" />;

  const lower = search.toLowerCase();

  const filteredCVs = cvs.filter(
    (c) =>
      c.user_email?.toLowerCase().includes(lower) ||
      c.extracted_text?.toLowerCase().includes(lower),
  );

  const filteredApplications = applications.filter((a) => {
    const matchSearch =
      a.candidate_email?.toLowerCase().includes(lower) ||
      a.job_title?.toLowerCase().includes(lower);
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredConversations = conversations.filter((c) =>
    c.user_email?.toLowerCase().includes(lower),
  );

  const currentData =
    tab === "cvs"
      ? filteredCVs
      : tab === "jobs"
        ? jobs
        : tab === "applications"
          ? filteredApplications
          : tab === "conversations"
            ? filteredConversations
            : sortedUsers;

  const maxPage = Math.max(1, Math.ceil(currentData.length / PAGE_SIZE));
  const paginate = (arr) => arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/monitoring/applications/${id}/`, { status });
      fetchAdminData();
    } catch {
      alert("Status update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/admin/users/${id}/`);
    fetchAdminData();
  };

  const exportCSV = () => {
    if (!currentData.length) return;

    const headers = Object.keys(currentData[0]);

    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const rows = currentData.map((row) =>
      headers.map((h) => escape(row[h])).join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}.csv`;
    a.click();
  };

  return (
    <div className={styles.container}>
      <h1>Admin Monitor</h1>

      {/* STATS */}
      <div style={{ display: "flex", gap: 20 }}>
        <div>CVs: {cvs.length}</div>
        <div>Jobs: {jobs.length}</div>
        <div>Applications: {applications.length}</div>
        <div>Users: {users.length}</div>
      </div>

      <div className={styles.tabs}>
        {["cvs", "jobs", "applications", "conversations", "users"].map((t) => (
          <button
            key={t}
            className={`btn btnSm ${tab === t ? "btnPrimary" : "btnOutline"}`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {tab === "applications" && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        )}

        <button className="btn btnOutline" onClick={exportCSV}>
          Export CSV
        </button>

        <button className="btn btnOutline" onClick={fetchAdminData}>
          Refresh
        </button>
      </div>

      {/* CVS */}

      {tab === "cvs" && (
        <table className={styles.table}>
          <tbody>
            {paginate(filteredCVs).map((cv) => (
              <tr key={cv.id}>
                <td>{cv.user_email}</td>
                <td>{cv.status}</td>
                <td>
                  <a href={cv.file} target="_blank" rel="noreferrer">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* JOBS */}

      {tab === "jobs" && (
        <table className={styles.table}>
          <tbody>
            {paginate(jobs).map((j) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td>{j.recruiter_email}</td>
                <td>{j.applications?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* APPLICATIONS */}

      {tab === "applications" && (
        <table className={styles.table}>
          <tbody>
            {paginate(filteredApplications).map((a) => (
              <tr key={a.id}>
                <td>{a.job_title}</td>
                <td>{a.candidate_email}</td>
                <td>
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CONVERSATIONS */}

      {tab === "conversations" && (
        <table className={styles.table}>
          <tbody>
            {paginate(filteredConversations).map((c) => (
              <React.Fragment key={c.id}>
                <tr>
                  <td>{c.user_email}</td>
                  <td>{c.messages.length}</td>
                  <td>
                    <button
                      className="btn btnSm"
                      onClick={() =>
                        setExpandedConvId(expandedConvId === c.id ? null : c.id)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>

                {expandedConvId === c.id && (
                  <tr>
                    <td colSpan="3">
                      {c.messages.map((m) => (
                        <div key={m.id}>{m.content}</div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* USERS */}

      {tab === "users" && (
        <table className={styles.table}>
          <tbody>
            {paginate(sortedUsers).map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.is_staff ? "Admin" : "User"}</td>
                <td>
                  <button
                    className="btn btnSm"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* PAGINATION */}

      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>

        <span>
          Page {page} / {maxPage || 1}
        </span>

        <button
          disabled={page >= maxPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
