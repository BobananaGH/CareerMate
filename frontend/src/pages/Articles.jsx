import { useEffect, useState } from "react";
import api from "../api";
import styles from "./css/Articles.module.css";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get("/articles/");
      setArticles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading articles…</p>;

  return (
    <main className={styles.articlePage}>
      <h1>Career Articles</h1>

      {articles.length === 0 && (
        <p className={styles.empty}>No articles available.</p>
      )}

      <div className={styles.list}>
        {articles.map((article) => (
          <article key={article.id} className={styles.card}>
            <h2>{article.title}</h2>

            <p className={styles.content}>{article.content}</p>

            <small className={styles.date}>
              {new Date(article.created_at).toLocaleDateString()}
            </small>
          </article>
        ))}
      </div>
    </main>
  );
}
