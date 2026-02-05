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

        {/* ANALYSIS */}

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

        {/* ROADMAP */}

        {roadmap && (
          <div className={styles.aiResults}>
            <h3>Your Learning Roadmap</h3>

            <div className={styles.analysisText}>
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* ACTION */}

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
