import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import styles from "./css/Article.module.css";

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    api.get(`/articles/${id}/`).then((res) => setArticle(res.data));
  }, [id]);

  if (!article) return <p>Loading...</p>;

  return (
    <main className={styles.resultPage}>
      <section className={styles.resultBox}>
        <h1>{article.title}</h1>

        <small>{new Date(article.created_at).toLocaleString()}</small>

        <hr />

        <p>{article.content}</p>

        <button className="btn btnOutline" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
      </section>
    </main>
  );
}
