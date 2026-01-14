import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Project.module.css";

export default function ResultPage() {
  const navigate = useNavigate();

  const result = localStorage.getItem("cv_result");
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

        <div className={styles.resultContent}>
          {result ? (
            <pre>{result}</pre>
          ) : (
            <p className={styles.emptyState}>
              No analysis data found. Please upload and analyze a resume first.
            </p>
          )}
        </div>

        <div className={styles.resultActions}>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={() => navigate("/analyzer")}
          >
            Back to Resume Upload
          </button>
        </div>
      </section>
    </main>
  );
}
