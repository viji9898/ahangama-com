import {
  QrcodeOutlined,
  SafetyCertificateOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const features = [
  {
    icon: <WifiOutlined />,
    title: "Free eSIM",
    body: "Stay connected from day one",
  },
  {
    icon: <QrcodeOutlined />,
    title: "Instant QR access",
    body: "No apps needed",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Works immediately",
    body: "Use it the same day",
  },
];

export function NewHomePassFeaturesSection() {
  return (
    <section
      id="pass-features"
      className={styles.section}
      aria-label="Pass features"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Pass features</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Everything you need to use the pass fast
        </Typography.Title>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} className={styles.featureGrid}>
          {features.map((feature) => (
            <Col key={feature.title} xs={24} md={8}>
              <div className={styles.passFeatureCard}>
                <div className={styles.featureIconWrap}>{feature.icon}</div>
                <p className={styles.passFeatureTitle}>{feature.title}</p>
                <p className={styles.passFeatureDescription}>{feature.body}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
