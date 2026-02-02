import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./css/Article.module.css";
import Loading from "../components/Loading";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api.get(`/articles/${id}/`).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) return <Loading text="Loading article" />;

  return (
    <main className={styles.resultPage}>
      <section className={styles.resultBox}>
        <h1>{article.title}</h1>

        <small>
          By {article.author_username || article.author_email} •{" "}
          {new Date(article.created_at).toLocaleString()}
        </small>

        <hr />

        <p>{article.content}</p>

        <button className="btn btnOutline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </section>
    </main>
  );
}
