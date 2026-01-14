import styles from "./css/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} CareerMate. All rights reserved.</p>
    </footer>
  );
}
