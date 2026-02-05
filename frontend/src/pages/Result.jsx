import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./css/Project.module.css";
import api from "../api";

export default function ResultPage() {
  const navigate = useNavigate();

  const result = localStorage.getItem("cv_result");
  const filename = localStorage.getItem("cv_filename");
  const cvText = localStorage.getItem("cv_text");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!cvText) return alert("No CV text");

    setLoading(true);

    try {
      const res = await api.post("/chat/roadmap/", {
        cv_text: cvText,
      });

      setRoadmap(res.data.roadmap);
    } catch {
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.resultPage}>
      <section className={styles.resultBox}>
        <header className={styles.resultHeader}>
          <h1>Resume Analysis Result</h1>
          <p className={styles.fileName}>
            <strong>File:</strong> {filename || "No file uploaded"}
          </p>
        </header>

        <hr />

        <div className={styles.resultContent}>
          {result ? (
            <div className={styles.analysisText}>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <p className={styles.emptyState}>
              No analysis data found. Please upload and analyze a resume first.
            </p>
          )}
        </div>

        {result && (
          <div className={styles.resultActions}>
            <button
              className="btn btnPrimary"
              onClick={generateRoadmap}
              disabled={loading || roadmap}
            >
              {loading ? "Generating..." : "Generate 3-Month Roadmap"}
            </button>
          </div>
        )}

        {roadmap && (
          <div className={styles.aiResults}>
            <h3>Your Learning Roadmap</h3>
            <div className={styles.analysisText}>
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className={styles.resultActions}>
          <button
            type="button"
            className="btn btnOutline"
            onClick={() => navigate("/analyze")}
          >
            <i className="fa-solid fa-arrow-left" />
            Back to Resume Upload
          </button>
        </div>
      </section>
    </main>
  );
}
