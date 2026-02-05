import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from "./css/Project.module.css";

export default function ResultPage() {
  const navigate = useNavigate();

  const result = localStorage.getItem("cv_result");
  const roadmap = localStorage.getItem("cv_roadmap");
  const filename = localStorage.getItem("cv_filename");

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

        {/* ATS RESULT */}

        <div className={styles.resultContent}>
          <h2>ATS Analysis</h2>

          {result ? (
            <div className={styles.analysisText}>
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          ) : (
            <p className={styles.emptyState}>
              No analysis data found. Please upload a resume first.
            </p>
          )}
        </div>

        {/* ROADMAP */}

        {roadmap && (
          <div className={styles.aiResults}>
            <h2>Your Learning Roadmap</h2>

            <div className={styles.analysisText}>
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* ACTIONS */}

        <div className={styles.resultActions}>
          <button
            type="button"
            className="btn btnOutline"
            onClick={() => navigate("/analyze")}
          >
            ← Back to Resume Upload
          </button>
        </div>
      </section>
    </main>
  );
}
