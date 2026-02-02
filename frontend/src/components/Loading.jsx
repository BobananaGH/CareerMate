import styles from "./css/Loading.module.css";

export default function Loading({ text = "Loading" }) {
  return (
    <div className={styles.center}>
      {text}
      <span className={styles.dots}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  );
}
