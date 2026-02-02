import { useEffect, useState } from "react";
import api from "../api";
import styles from "./css/Article.module.css";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function Articles({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <Loading text="Loading articles" />;

  return (
    <main className={styles.articlePage}>
      <div className={styles.headerRow}>
        <h1>Career Articles</h1>

        {user && (
          <button
            type="button"
            className="btn btnPrimary"
            onClick={() => navigate("/articles/create")}
          >
            <i className="fa-solid fa-plus"></i>New Article
          </button>
        )}
      </div>

      {articles.length === 0 && (
        <p className={styles.empty}>No articles available.</p>
      )}

      <div className={styles.list}>
        {articles.map((article) => (
          <article
            key={article.id}
            className={styles.card}
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            <h2>{article.title}</h2>

            <p className={styles.content}>
              {article.content.length > 120
                ? article.content.slice(0, 120) + "..."
                : article.content}
            </p>

            <small className={styles.date}>
              {article.author_username || article.author_email} •{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </small>
          </article>
        ))}
      </div>
    </main>
  );
}
