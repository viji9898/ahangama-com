import { Button, Space, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const PASS_URL = "https://pass.ahangama.com";

export function NewHomeFinalCtaSection() {
  return (
    <section id="final-cta" className={styles.section} aria-label="Final call to action">
      <div className={styles.ctaPanel}>
        <div className={styles.finalCtaWrap}>
          <span className={styles.eyebrow}>Get started</span>
          <Typography.Title level={2} className={styles.finalCtaTitle}>
            Start saving on your Ahangama trip
          </Typography.Title>
          <Typography.Paragraph className={styles.finalCtaSubtext}>
            Access 100+ venues instantly
          </Typography.Paragraph>

          <Space size={14} wrap className={styles.finalCtaActions}>
            <Button
              type="primary"
              size="large"
              href={PASS_URL}
              target="_blank"
              className={styles.finalCtaPrimaryButton}
            >
              Get your pass
            </Button>
            <Button
              size="large"
              href="#example-savings"
              className={styles.finalCtaSecondaryButton}
            >
              View sample savings
            </Button>
          </Space>
        </div>
      </div>
    </section>
  );
}