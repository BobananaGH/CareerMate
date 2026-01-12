import React, { useState, useRef } from "react";
import styles from "./css/Project.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Landing() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [aiResults, setAiResults] = useState("");
  const fileInputRef = useRef(null);
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
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

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
      {/* Header */}
      <header className={styles.headerCheckHome}>
        <nav className={styles.headerMainNav}>
          <ul className={styles.headerNavList}>
            <li className={styles.headerNavItem}>Home</li>
            <li className={styles.headerNavItem}>Resume Check</li>
          </ul>
        </nav>
        <div className={styles.headerAction}>
          <div className={styles.dropdown}>
            <button className="btn btnGhost btnSm">
              <i className="fas fa-question-circle"></i> Help
              <p className={styles.dropdownContent}>
                No account required, unlimited checks, and guaranteed privacy.
              </p>
            </button>
          </div>
          <button className="btn btnPrimary btnSm">
            <i className="fas fa-sign-in-alt"></i> Log In
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className={styles.projectContent}>
        <div className={styles.checkContainer}>
          <section className={styles.checkSection}>
            <h1 className={styles.checkLine}>
              <span className={styles.lineTittle}>Is your CV good enough?</span>
            </h1>
            <p className={styles.checkDescription}>
              This is a <strong>free AI checker</strong> to ensure your CV is
              ready to perform and get interview
            </p>

            {/* Upload */}
            <div className={styles.uploadContainer}>
              <div
                className={styles.uploadBox}
                onClick={() => fileInputRef.current.click()}
              >
                <button type="button" className="btn btnOutline btnBlock">
                  <i className="fas fa-upload"></i> Upload Your CV
                </button>

                <div className={styles.uploadTitleBox}>
                  <p>
                    Drop your CV here or choose a file.
                    <br />
                    PDF & DOCX only. Max 2MB file size.
                  </p>

                  <div className={styles.privacyBadge}>
                    <i className="fas fa-lock"></i> Privacy guaranteed
                  </div>
                </div>
              </div>
              {file && (
                <p className={styles.fileName}>
                  Selected file: <strong>{file.name}</strong>
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={handleFileChange}
              />
            </div>

            {uploading && (
              <div className={styles.uploadProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill}></div>
                </div>
                <p>Analyzing your resume...</p>
              </div>
            )}

            {aiResults && <div className={styles.aiResults}>{aiResults}</div>}

            <button
              className={`btn btnPrimary btnBlock`}
              onClick={handleUpload}
              disabled={!file}
            >
              Analyze CV
            </button>
          </section>
        </div>
      </main>

      {/* Suggest section */}
      <section className={styles.suggest}>
        <div className={styles.suggestHeader}>Rewrite your resume with AI</div>
        <div>
          Get your resume rewritten by the world’s best AI engine (ChatGPT 4.0)…
        </div>
      </section>

      {/* Theme bars */}
      <div className={styles.theme}>
        <div className={styles.themeChild1}></div>
        <div className={styles.themeChild2}></div>
        <div className={styles.themeChild3}></div>
        <div className={styles.themeChild4}></div>
      </div>

      {/* Footer cards */}
      <section className={styles.ahrefsSection}>
        <div className={styles.ahrefsContainer}>
          <h2>
            Sign up for <span>Phunt</span>.<br />
            Stay discoverable—in search, AI, and beyond.
          </h2>

          <div className={styles.ahrefsCards}>
            <div className={styles.ahrefsCard}>
              <h3>Starter</h3>
              <p className={styles.price}>
                $29<span>/mo</span>
              </p>
              <p>See what people search and spy on competitors.</p>
              <button className="btn btnPrimary btnBlock btnSm">
                Get started
              </button>
            </div>

            <div className={styles.ahrefsCard}>
              <h3>Webmaster Tools 🚀</h3>
              <p className={styles.price}>Free</p>
              <p>Get data on your site.</p>
              <button className="btn btnPrimary btnBlock btnSm">
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
