import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Project.module.css";

export default function Landing({ user }) {
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user?.role || user?.is_staff);

  return (
    <>
      {/* ================= HERO ================= */}

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            Build Your Career With <span>CareerMate</span>
          </h1>

          <p>
            AI-powered CV analysis, career coaching, and job matching —
            everything you need to land your next opportunity.
          </p>

          <div className={styles.heroActions}>
            <button
              className="btn btnPrimary btnLg"
              onClick={() => navigate("/analyze")}
            >
              Analyze My CV
            </button>

            <button
              className="btn btnOutline btnLg"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className={styles.features}>
        <h2>All-in-one Career Platform</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>📄 AI CV Analyzer</h3>
            <p>
              Upload your CV and receive instant feedback, skill extraction, and
              improvement suggestions.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>🤖 Career AI Coach</h3>
            <p>
              Chat with AI for career advice, personalized roadmaps, and mock
              interview preparation.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>💼 Job Marketplace</h3>
            <p>
              Discover jobs matched to your skills and apply directly to
              recruiters.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3>📊 Recruiter Dashboard</h3>
            <p>
              Recruiters can post jobs, review candidates, and manage hiring
              pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className={styles.steps}>
        <h2>How It Works</h2>

        <div className={styles.stepGrid}>
          <div className={styles.step}>
            <span>1</span>
            <h4>Upload CV</h4>
            <p>Upload your resume and let AI analyze your profile.</p>
          </div>

          <div className={styles.step}>
            <span>2</span>
            <h4>Get Insights</h4>
            <p>Receive feedback, skill gaps, and career roadmap.</p>
          </div>

          <div className={styles.step}>
            <span>3</span>
            <h4>Apply Jobs</h4>
            <p>Apply to relevant jobs and track application status.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA (ONLY WHEN LOGGED OUT) ================= */}

      {!isLoggedIn && (
        <section className={styles.cta}>
          <h2>Start Building Your Career Today</h2>
          <p>No credit card required.</p>

          <button
            className="btn btnPrimary btnLg"
            onClick={() => navigate("/login")}
          >
            Get Started Free
          </button>
        </section>
      )}
    </>
  );
}
