import {
  CreditCardOutlined,
  QrcodeOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const steps = [
  {
    icon: <CreditCardOutlined />,
    number: "01",
    title: "Buy the pass",
    body: "Choose your pass and get instant access.",
  },
  {
    icon: <QrcodeOutlined />,
    number: "02",
    title: "Show QR at venues",
    body: "Scan at partner spots across Ahangama.",
  },
  {
    icon: <TagsOutlined />,
    number: "03",
    title: "Get discounts instantly",
    body: "Savings apply right away at checkout.",
  },
];

export function NewHomeHowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className={styles.section}
      aria-label="How it works"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>How it works</span>
        <Typography.Title level={2} className={styles.howItWorksTitle}>
          Three steps from pass to savings
        </Typography.Title>
      </div>

      <div className={styles.sectionPanel}>
        <Row gutter={[20, 20]} className={styles.howItWorksGrid}>
          {steps.map((step, index) => (
            <Col key={step.title} xs={24} md={8}>
              <div className={styles.howItWorksStepCard}>
                <div className={styles.howItWorksIconWrap} aria-hidden="true">
                  {step.icon}
                </div>
                <p className={styles.howItWorksStepNumber}>{step.number}</p>
                <p className={styles.howItWorksStepTitle}>{step.title}</p>
                <p className={styles.howItWorksStepDescription}>{step.body}</p>
                {index < steps.length - 1 ? (
                  <span
                    className={styles.howItWorksConnector}
                    aria-hidden="true"
                  />
                ) : null}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
