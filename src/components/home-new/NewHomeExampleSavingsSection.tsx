import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const sampleSavings = [
  {
    label: "Stay",
    value: "saved $80",
  },
  {
    label: "Cafes",
    value: "saved $25",
  },
  {
    label: "Scooter",
    value: "saved $10",
  },
];

export function NewHomeExampleSavingsSection() {
  return (
    <section
      id="example-savings"
      className={styles.section}
      aria-label="Example savings"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Real example savings</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Make the pass value feel real in one believable trip.
        </Typography.Title>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} align="stretch">
          <Col xs={24} lg={14}>
            <div className={styles.exampleSavingsCard}>
              <p className={styles.cardEyebrow}>Trip example</p>
              <p className={styles.exampleSavingsTitle}>2 weeks in Ahangama</p>
              <ul className={styles.exampleSavingsList}>
                {sampleSavings.map((item) => (
                  <li key={item.label} className={styles.exampleSavingsRow}>
                    <span className={styles.exampleSavingsLabel}>
                      {item.label}
                    </span>
                    <span className={styles.exampleSavingsValue}>
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div className={styles.exampleSavingsComparison}>
              <p className={styles.cardEyebrow}>Comparison</p>
              <div className={styles.exampleSavingsComparisonGrid}>
                <div className={styles.exampleSavingsComparisonRow}>
                  <span className={styles.exampleSavingsComparisonLabel}>
                    Without pass
                  </span>
                  <span className={styles.exampleSavingsComparisonValue}>
                    $320
                  </span>
                </div>
                <div className={styles.exampleSavingsComparisonRow}>
                  <span className={styles.exampleSavingsComparisonLabel}>
                    With pass
                  </span>
                  <span className={styles.exampleSavingsComparisonValue}>
                    $210
                  </span>
                </div>
              </div>
              <div className={styles.exampleSavingsHighlight}>
                <span className={styles.exampleSavingsHighlightLabel}>
                  You save
                </span>
                <Typography.Title
                  level={3}
                  className={styles.exampleSavingsHighlightValue}
                >
                  $110
                </Typography.Title>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
