import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const PASS_URL = "https://pass.ahangama.com";

const passes = [
  {
    duration: "15 day",
    price: "USD 30",
    note: "Best for shorter stays",
    isPopular: true,
  },
  {
    duration: "30 day",
    price: "USD 50",
    note: "More time, better value",
  },
  {
    duration: "90 day",
    price: "USD 100",
    note: "Built for long stays",
  },
];

export function NewHomePassOptionsSection() {
  return (
    <section
      id="pass-options"
      className={styles.section}
      aria-label="Pass options"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Pass options</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Choose the pass that fits your trip
        </Typography.Title>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} className={styles.passOptionsGrid}>
          {passes.map((pass) => (
            <Col key={pass.duration} xs={24} md={8}>
              <a
                href={PASS_URL}
                target="_blank"
                rel="noreferrer"
                className={styles.passOptionLink}
              >
                <div
                  className={[
                    styles.passOptionCard,
                    pass.isPopular ? styles.passOptionCardFeatured : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {pass.isPopular ? (
                    <span className={styles.passOptionBadge}>Most popular</span>
                  ) : null}
                  <p className={styles.passOptionDuration}>{pass.duration}</p>
                  <p className={styles.passOptionPrice}>{pass.price}</p>
                  <p className={styles.passOptionNote}>{pass.note}</p>
                </div>
              </a>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
