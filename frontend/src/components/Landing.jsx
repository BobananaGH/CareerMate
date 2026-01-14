import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Project.module.css";

const API_URL = "http://localhost:8000/api/users/analyze/";

export default function Landing({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [aiResults, setAiResults] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.analysis) {
        throw new Error("AI không trả kết quả");
      }

      localStorage.setItem("cv_result", data.analysis);
      localStorage.setItem("cv_filename", file.name);

      setAiResults(data.analysis);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi phân tích CV");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className={styles.headerCheckHome}>
        <nav className={styles.headerMainNav}>
          <ul className={styles.headerNavList}>
            <li className={styles.headerNavItem}>Home</li>
            <li className={styles.headerNavItem}>Resume Check</li>
          </ul>
        </nav>

        <div className={styles.headerAction}>
          <div className={styles.dropdown}>
            <button className="btn btnGhost">
              <i className="fas fa-question-circle"></i> Help
              <p className={styles.dropdownContent}>
                No account required, unlimited checks, and guaranteed privacy.
              </p>
            </button>
          </div>

          {user ? (
            <button className="btn btnOutline" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          ) : (
            <button
              className="btn btnOutline"
              onClick={() => navigate("/login")}
            >
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
          )}
        </div>
      </header>

      {/* ================= MAIN CHECK SECTION ================= */}
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

            <div className={styles.uploadContainer}>
              <div
                className={styles.uploadBox}
                onClick={() => document.getElementById("resumeFile").click()}
              >
                <button className="btn btnPrimary btnLg">
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

              <input
                type="file"
                id="resumeFile"
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

            {aiResults && (
              <div className={styles.aiResults}>
                {aiResults}
                <button
                  className="btn btnOutline"
                  style={{ marginTop: "16px" }}
                  onClick={() => navigate("/result")}
                >
                  View Detailed Report
                </button>
              </div>
            )}

            <button
              className="btn btnPrimary btnBlock"
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{ marginTop: "16px" }}
            >
              Analyze CV
            </button>
          </section>
        </div>
      </main>

      {/* ================= SUGGEST SECTION ================= */}
      <section className={styles.suggest}>
        <div className={styles.suggestHeader}>Rewrite your resume with AI</div>
        <p>
          Get your resume rewritten by the world’s best AI engine (Claude) with
          tailored prompts based on your resume and job description. Generate
          summaries, skills, and remove buzzwords automatically.
        </p>
      </section>

      {/* ================= THEME BLOCKS ================= */}
      <div className={styles.theme}>
        <div className={styles.themeChild1}></div>
        <div className={styles.themeChild2}></div>
        <div className={styles.themeChild3}></div>
        <div className={styles.themeChild4}></div>
      </div>

      {/* ================= PRICING / AHREFS SECTION ================= */}
      <section className={styles.ahrefsSection}>
        <div className={styles.ahrefsContainer}>
          <h2>
            Sign up for <span>CareerMate</span>.
            <br />
            ############
          </h2>

          <div className={styles.ahrefsCards}>
            <div className={styles.ahrefsCard}>
              <h3>Starter</h3>
              <p className={styles.price}>
                $29<span>/mo</span>
              </p>
              <p>See what people search and spy on competitors.</p>
              <button className="btn btnPrimary">Get started</button>
            </div>

            <div className={styles.ahrefsCard}>
              <h3>Webmaster Tools 🚀</h3>
              <p className={styles.price}>Free</p>
              <p>Get data on your site.</p>
              <button className="btn btnOutline">Get started</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
