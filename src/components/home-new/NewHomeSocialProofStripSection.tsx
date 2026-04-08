import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const metrics = [
  {
    value: "100+",
    label: "partner venues",
    description: "Cafes, stays, surf, wellness, and experiences across Ahangama.",
  },
  {
    value: "4.8/5",
    label: "traveller sentiment",
    description: "Positioned as a confidence-building strip directly under the hero.",
  },
  {
    value: "2-3x",
    label: "value clarity",
    description: "A quick snapshot that frames the pass around practical savings.",
  },
  {
    value: "Instant",
    label: "digital access",
    description: "Delivered fast, ready for wallet, and easy to explain at a glance.",
  },
];

export function NewHomeSocialProofStripSection() {
  return (
    <section id="social-proof" className={styles.section} aria-label="Social proof and savings strip">
      <div className={styles.stripPanel}>
        <Row gutter={[16, 16]}>
          {metrics.map((metric) => (
            <Col key={metric.label} xs={24} sm={12} lg={6}>
              <div className={styles.metricCard}>
                <p className={styles.metricLabel}>{metric.label}</p>
                <Typography.Title level={2} className={styles.metricValue}>
                  {metric.value}
                </Typography.Title>
                <Typography.Paragraph className={styles.metricDescription}>
                  {metric.description}
                </Typography.Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}