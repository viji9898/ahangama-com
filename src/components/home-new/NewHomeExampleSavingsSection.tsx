import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const sampleSavings = [
  "Morning coffee and breakfast credit",
  "Two surf or wellness redemptions",
  "Dinner or sunset drinks at partner venues",
  "One premium perk that pushes total value past the pass price",
];

export function NewHomeExampleSavingsSection() {
  return (
    <section id="example-savings" className={styles.section} aria-label="Example savings">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Example savings</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Show the economics without making the page feel like a calculator.
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          This is a narrative savings section for now. Later we can wire live
          data, venue-level examples, or a more precise trip-based calculator.
        </Typography.Paragraph>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} align="stretch">
          <Col xs={24} lg={14}>
            <div className={styles.contentCard}>
              <p className={styles.cardEyebrow}>3 day sample stay</p>
              <p className={styles.cardTitle}>A believable itinerary beats abstract claims.</p>
              <ul className={styles.list}>
                {sampleSavings.map((item) => (
                  <li key={item} className={styles.listItem}>
                    <span className={styles.listBullet} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div className={styles.contentCard}>
              <p className={styles.cardEyebrow}>Savings snapshot</p>
              <Typography.Title level={3} className={styles.cardValue}>
                Save by day two
              </Typography.Title>
              <Typography.Paragraph className={styles.cardBodyText}>
                The page only needs one strong example at this stage: enough to
                signal value while keeping the composition clean.
              </Typography.Paragraph>
              <div className={styles.heroMeta}>
                <span className={styles.microPill}>Flexible placeholder copy</span>
                <span className={styles.microPill}>Ready for real venue data</span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}