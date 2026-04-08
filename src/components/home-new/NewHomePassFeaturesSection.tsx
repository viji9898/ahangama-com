import {
  EnvironmentOutlined,
  MobileOutlined,
  ThunderboltOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const features = [
  {
    icon: <WifiOutlined />,
    title: "Travel eSIM",
    body: "Position connectivity as part of the pass ecosystem, not a separate afterthought.",
  },
  {
    icon: <MobileOutlined />,
    title: "Wallet ready",
    body: "Fast setup, mobile-first delivery, and a clearer digital product story on arrival.",
  },
  {
    icon: <ThunderboltOutlined />,
    title: "Instant redemption",
    body: "Remove friction from the explanation so the product feels immediate and premium.",
  },
  {
    icon: <EnvironmentOutlined />,
    title: "Local coverage",
    body: "Signal useful breadth across Ahangama while keeping the presentation editorial and calm.",
  },
];

export function NewHomePassFeaturesSection() {
  return (
    <section id="pass-features" className={styles.section} aria-label="Pass features">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Pass features</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Product features can sit in a refined grid instead of a feature dump.
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          The content here is deliberately modular. We can replace any card with
          richer copy, screenshots, or partner detail without changing the page shell.
        </Typography.Paragraph>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} className={styles.featureGrid}>
          {features.map((feature) => (
            <Col key={feature.title} xs={24} sm={12}>
              <div className={styles.featureCard}>
                <div className={styles.featureIconWrap}>{feature.icon}</div>
                <p className={styles.cardTitle} style={{ marginTop: 18 }}>
                  {feature.title}
                </p>
                <p className={styles.featureDescription}>{feature.body}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}