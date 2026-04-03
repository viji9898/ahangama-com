import { Button, ConfigProvider } from "antd";
import styles from "./GuideDownloadSection.module.css";

const whatsappNumberE164 = "94777908790";
const prefilledText =
  "Hi! I'd like to download the Ahangama Guide for 2026 via WhatsApp.";

export default function GuideDownloadSection({ className }) {
  const whatsappUrl = `https://wa.me/${encodeURIComponent(whatsappNumberE164)}?text=${encodeURIComponent(prefilledText)}`;

  return (
    <section
      aria-label="Download the Ahangama guide"
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <div className={styles.topRule} aria-hidden="true" />
      <p className={styles.kicker}>Plan with the local guide</p>

      <div className={styles.grid}>
        <div className={styles.copy}>
          <div className={styles.eyebrow}>2026 guide</div>
          <p className={styles.title}>Download the Ahangama Guide for 2026</p>
          <p className={styles.text}>
            Get the latest local recommendations for cafes, stays, surf spots,
            and must-know Ahangama picks sent straight to WhatsApp.
          </p>
        </div>

        <div className={styles.actions}>
          <p className={styles.statValue}>Free</p>
          <p className={styles.statLabel}>Delivered instantly on WhatsApp</p>

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
              Get the Guide on WhatsApp
            </Button>
          </ConfigProvider>

          <p className={styles.meta}>One tap. No spam.</p>
        </div>
      </div>
    </section>
  );
}