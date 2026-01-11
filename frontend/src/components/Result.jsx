import React from "react";
import styles from "./css/Project.module.css";

export default function ResultPage() {
  const result = localStorage.getItem("cv_result");
  const filename = localStorage.getItem("cv_filename");

  return (
    <div
      className={styles.resultBox}
      style={{
        maxWidth: "900px",
        margin: "80px auto",
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        whiteSpace: "pre-wrap",
        lineHeight: 1.7,
      }}
    >
      <h1>📄 Kết quả phân tích CV</h1>
      <p>
        <strong>File:</strong> {filename || "Không có file"}
      </p>
      <hr />
      <br />
      <div>
        {result ? result : "❌ Không có dữ liệu. Vui lòng upload CV trước."}
      </div>

      {/* Back button */}
      <button
        className={styles.backButton}
        onClick={() => (window.location.href = "/")} // redirect to Landing
        style={{
          marginTop: "30px",
          display: "inline-block",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        ⬅ Quay lại upload
      </button>
    </div>
  );
}
