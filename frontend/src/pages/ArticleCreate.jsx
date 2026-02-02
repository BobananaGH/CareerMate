import { useState } from "react";
import api from "../api";
import styles from "./css/Article.module.css";
import { useNavigate } from "react-router-dom";

export default function ArticleCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and content required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/articles/create/", {
        title,
        content,
      });

      setTitle("");
      setContent("");

      navigate("/articles");
    } catch (err) {
      console.error(err);
      alert("Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <h1>Create Article</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Content"
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />

        <button className="btn btnPrimary" disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </main>
  );
}
