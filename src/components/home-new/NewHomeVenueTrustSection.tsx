import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const venueNames = [
  "Hotel partners",
  "Cafe partners",
  "Surf partners",
  "Wellness partners",
  "Dining partners",
  "Local favourites",
];

export function NewHomeVenueTrustSection() {
  return (
    <section id="venue-trust" className={styles.section} aria-label="Venue logos and trust">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Venue trust</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          A lightweight logo wall that signals coverage and quality.
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          For now this uses textual placeholders so we can lock the spacing and
          rhythm. Real logos can drop in later with no layout rewrite.
        </Typography.Paragraph>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[16, 16]} className={styles.logoGrid}>
          {venueNames.map((name) => (
            <Col key={name} xs={12} md={8} lg={4}>
              <div className={styles.logoPill}>
                <p className={styles.logoPillText}>{name}</p>
              </div>
            </Col>
          ))}
        </Row>
        <Typography.Paragraph className={styles.logoSupport}>
          Replace these labels with approved venue marks once the trust section
          content is finalized.
        </Typography.Paragraph>
      </div>
    </section>
  );
}