import { Typography } from "antd";
import styles from "./AhangamaStatsBar.module.css";

const stats = [
  { value: "1,200+", label: "Passes activated" },
  { value: "$200+", label: "Average savings per trip" },
  { value: "120+", label: "Partner venues" },
];

export default function AhangamaStatsBar({ className }) {
  return (
    <section
      aria-label="Ahangama Pass stats"
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <Typography.Title level={3} className={styles.title}>
        Join travellers saving more in Ahangama
      </Typography.Title>

      <div className={styles.grid} role="list" aria-label="Key stats">
        {stats.map((stat) => (
          <div key={stat.label} className={styles.item} role="listitem">
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
