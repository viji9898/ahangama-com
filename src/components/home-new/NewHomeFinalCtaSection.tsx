import { Button, Col, Row, Space, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

export function NewHomeFinalCtaSection() {
  return (
    <section id="final-cta" className={styles.section} aria-label="Final call to action">
      <div className={styles.ctaPanel}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} lg={16}>
            <span className={styles.eyebrow}>Final CTA</span>
            <Typography.Title level={2} className={styles.sectionTitle}>
              One clear next step, after the value story is fully established.
            </Typography.Title>
            <Typography.Paragraph className={styles.sectionDescription}>
              This block should stay concise. The rest of the page does the heavy
              lifting so the closing CTA can be direct and calm.
            </Typography.Paragraph>
          </Col>
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Button type="primary" size="large" block href="https://pass.ahangama.com" target="_blank">
                Buy the Ahangama Pass
              </Button>
              <Button size="large" block href="#hero">
                Back to top
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    </section>
  );
}