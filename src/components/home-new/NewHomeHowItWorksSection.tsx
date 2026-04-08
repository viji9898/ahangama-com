import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const steps = [
  {
    eyebrow: "Step 1",
    title: "Choose your pass",
    body: "Start with a simple, low-friction plan selector that explains duration, use case, and likely value.",
  },
  {
    eyebrow: "Step 2",
    title: "Receive it instantly",
    body: "Keep the journey digital-first with immediate confirmation, wallet compatibility, and minimal setup.",
  },
  {
    eyebrow: "Step 3",
    title: "Use it across town",
    body: "Unlock venue savings with a clean explanation of how scanning and redemption work in practice.",
  },
];

export function NewHomeHowItWorksSection() {
  return (
    <section id="how-it-works" className={styles.section} aria-label="How it works">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>How it works</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          A short, calm explanation of the product flow.
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          This section is intentionally simple. It gives the homepage a clean,
          Stripe-like sequence without introducing extra visual weight.
        </Typography.Paragraph>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} className={styles.stepsGrid}>
          {steps.map((step) => (
            <Col key={step.title} xs={24} md={8}>
              <div className={styles.contentCard}>
                <p className={styles.cardEyebrow}>{step.eyebrow}</p>
                <p className={styles.cardTitle}>{step.title}</p>
                <p className={styles.cardBodyText}>{step.body}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}