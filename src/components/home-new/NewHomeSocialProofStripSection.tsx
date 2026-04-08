import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const metrics = [
  {
    value: "Save $60+",
    label: "Stay discounts",
  },
  {
    value: "Save $20+",
    label: "Cafes & food",
  },
  {
    value: "Save $15+",
    label: "Experiences",
  },
];

export function NewHomeSocialProofStripSection() {
  return (
    <section id="social-proof" className={styles.section} aria-label="Savings highlight">
      <div className={styles.stripPanel}>
        <div className={styles.stripHeader}>
          <Typography.Title level={2} className={styles.stripTitle}>
            Most travellers save $45–$120 in 2 weeks
          </Typography.Title>
        </div>

        <Row gutter={[16, 16]} justify="center">
          {metrics.map((metric) => (
            <Col key={metric.label} xs={24} sm={8} lg={8}>
              <div className={styles.metricCard}>
                <p className={styles.metricLabel}>{metric.label}</p>
                <Typography.Title level={2} className={styles.metricValue}>
                  {metric.value}
                </Typography.Title>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}