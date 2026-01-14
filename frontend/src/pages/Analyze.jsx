import React, { useState, useRef } from "react";
import styles from "./css/Project.module.css";
import api from "../api";

export default function Analyze() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [aiResults, setAiResults] = useState("");
  const fileInputRef = useRef(null);

  const handleRemoveFile = () => {
    setFile(null);
    setAiResults("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    e.target.value = null;
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/users/analyze/", formData);
      const data = res.data;

      if (!data.success || !data.analysis) throw new Error("No result");

      setAiResults(data.analysis);
      localStorage.setItem("cv_result", data.analysis);
      localStorage.setItem("cv_filename", file.name);
    } catch (err) {
      console.error(err);
      alert("Error analyzing CV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Main content */}
      <main className={styles.projectContent}>
        <section
          className={`${styles.analyzerWrapper} ${
            file ? styles.showAnalyze : ""
          }`}
        >
          <div
            className={`${styles.uploadContainer} ${
              file ? styles.hasFile : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => !file && fileInputRef.current.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
          >
            <div className={styles.uploadBox}>
              <button type="button" className="btn btnPrimary btnLrg">
                <i className="fas fa-upload"></i> Upload Your CV
              </button>

              <div className={styles.uploadTitleBox}>
                <p>
                  <i className="fa-regular fa-file"></i>PDF, DOC, DOCX only. Max
                  2MB file size.
                </p>
                <div className={styles.privacyBadge}>
                  <i className="fas fa-lock"></i> Privacy guaranteed
                </div>
              </div>

              {file && (
                <>
                  <p className={styles.fileName}>
                    Selected file: <strong>{file.name}</strong>
                  </p>

                  <button
                    type="button"
                    className={`btn btnGhost btnSm ${styles.removeBtn}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={handleFileChange}
          />

          {uploading && (
            <div className={styles.uploadProgress}>
              <p>Analyzing your resume...</p>
            </div>
          )}

          <button
            className={`${styles.analyzeBtn} btn btnPrimary btnLrg`}
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            Analyze CV
          </button>

          {aiResults && <div className={styles.aiResults}>{aiResults}</div>}
        </section>
      </main>
    </div>
  );
}
