import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import styles from "./AdminMonitor.module.css";

export default function AdminMonitor({ user }) {
  const [conversations, setConversations] = useState([]);
  const [cvs, setCVs] = useState([]);
  const [expandedConvId, setExpandedConvId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [convRes, cvRes] = await Promise.all([
          api.get("/admin/monitoring/conversations/"),
          api.get("/admin/monitoring/cvs/"),
        ]);

        setConversations(convRes.data);
        setCVs(cvRes.data);
      } catch {
        setError("Failed to load admin monitoring data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.is_staff) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p className={styles.muted}>Loading admin monitor…</p>;
  }

  if (error) {
    return <p className={styles.muted}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Monitor</h1>

      {/* ================= CONVERSATIONS ================= */}
      <section className={styles.section}>
        <h2>Recent Conversations</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Messages</th>
              <th>Updated</th>
              <th>Inspect</th>
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
                      className="btn btnOutline btnSm"
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
                  <tr className={styles.expandedRow}>
                    <td colSpan="5">
                      <div className={styles.expandedBox}>
                        {conv.messages.map((msg) => (
                          <div key={msg.id} className={styles.message}>
                            <span className={styles.role}>
                              {msg.role.toUpperCase()}
                            </span>{" "}
                            <span className={styles.timestamp}>
                              ({new Date(msg.created_at).toLocaleString()})
                            </span>
                            <div>{msg.content}</div>
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
        <h2>Recent CV Uploads</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>File</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {cvs.map((cv) => (
              <tr key={cv.id}>
                <td>{cv.id}</td>
                <td>{cv.user_email || "—"}</td>
                <td>
                  <a
                    href={cv.file}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btnGhost btnSm"
                  >
                    Download
                  </a>
                </td>
                <td>{new Date(cv.uploaded_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
