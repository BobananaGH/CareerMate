import styles from "./css/Card.module.css";

export default function Card({ title, children, footer, actions, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <h2>{title}</h2>

      <div className={styles.body}>{children}</div>

      {footer && <small className={styles.footer}>{footer}</small>}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
