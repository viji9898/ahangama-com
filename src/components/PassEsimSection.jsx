import styles from "./PassEsimSection.module.css";

const esimStats = [
  { value: "30", label: "days included" },
  { value: "50GB", label: "high-speed data" },
];

export default function PassEsimSection({ className }) {
  return (
    <section
      aria-label="Ahangama Pass eSIM"
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <div className={styles.topRule} aria-hidden="true" />
      <p className={styles.kicker}>Included with the Ahangama Pass</p>

      <div className={styles.grid} role="list" aria-label="eSIM benefits">
        <div
          className={[styles.item, styles.feature].join(" ")}
          role="listitem"
        >
          <div className={styles.eyebrow}>Free eSIM</div>
          <p className={styles.featureTitle}>Stay connected from day one</p>
          {/* <p className={styles.featureCopy}>
            Every Ahangama Pass now includes a complimentary travel eSIM so you land with data ready.
          </p> */}
        </div>

        {esimStats.map((stat) => (
          <div key={stat.label} className={styles.item} role="listitem">
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
