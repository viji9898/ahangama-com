import { Button, ConfigProvider } from "antd";
import styles from "./TeamAdviceSection.module.css";

const whatsappNumberE164 = "94777908790";
const prefilledText =
  "Hi! I need advice on the best offers for where to stay, visa help, international driving permit support, and visa renewal.";

const adviceTopics = [
  "Best offers on where to stay",
  "Visa advice",
  "International driving permits",
  "Visa renewal",
];

export default function TeamAdviceSection({ className }) {
  const whatsappUrl = `https://wa.me/${encodeURIComponent(whatsappNumberE164)}?text=${encodeURIComponent(prefilledText)}`;

  return (
    <section
      aria-label="Connect with our team"
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <div className={styles.topRule} aria-hidden="true" />
      <p className={styles.kicker}>Need local help</p>

      <div className={styles.grid}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>Connect with our team</div>
          <p className={styles.title}>Get advice before you book or renew</p>
          <p className={styles.text}>
            Chat with the Ahangama team for guidance on stays, visas, driving
            permit support, and the best offers available right now.
          </p>

          <div className={styles.tags}>
            {adviceTopics.map((topic) => (
              <span key={topic} className={styles.tag}>
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <p className={styles.statValue}>WhatsApp</p>
          <p className={styles.statLabel}>Fast answers from the local team</p>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#25D366",
                colorPrimaryHover: "#1EBE5C",
                colorPrimaryActive: "#1AA64F",
              },
            }}
          >
            <Button
              block
              type="primary"
              size="large"
              onClick={() => {
                window.open(whatsappUrl, "_blank", "noopener,noreferrer");
              }}
              style={{
                marginTop: 4,
                minHeight: 48,
                borderRadius: 14,
                fontWeight: 900,
                fontSize: 15,
                boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
              }}
            >
              Start WhatsApp conversation
            </Button>
          </ConfigProvider>

          <p className={styles.meta}>One tap to speak with the team.</p>
        </div>
      </div>
    </section>
  );
}
