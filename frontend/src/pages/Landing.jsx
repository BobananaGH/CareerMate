import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Project.module.css";

export default function Landing({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      <main className={styles.projectContent}>
        <div className={styles.checkContainer}>
          <section className={styles.checkSection}>
            <h1 className={styles.checkLine}>
              <span className={styles.lineTittle}>
                Analyze Your CV with an AI
              </span>
            </h1>

            <p className={styles.checkDescription}>
              This is a <strong>free AI checker</strong> to ensure your CV is
              ready to perform and get interviews.
            </p>

            <button
              className="btn btnPrimary btnLg"
              style={{ marginTop: "24px" }}
              onClick={() => navigate("/analyze")}
            >
              Analyze Your CV
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
