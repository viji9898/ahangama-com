import styles from "./GetPassStickyCta.module.css";

export function GetPassStickyCta() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Ahangama Pass</span>
          <p className={styles.title}>
            Get the pass and start saving across Ahangama
          </p>
          <p className={styles.subtext}>
            Stays, cafes, surf, transport, wellness, and more from $30.
          </p>
        </div>

        <a
          href="https://pass.ahangama.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
        >
          Get Pass
        </a>
      </div>
    </div>
  );
}
