import { ArrowDownOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const PASS_URL = "https://pass.ahangama.com";

export function NewHomeHeroSection() {
  return (
    <section id="hero" className={styles.section} aria-label="Hero">
      <div className={styles.heroShell}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={13}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Ahangama Pass</span>
              <Typography.Title level={1} className={styles.heroTitle}>
                Travel lighter. Save more. <span className={styles.heroAccent}>Stay local.</span>
              </Typography.Title>
              <Typography.Paragraph className={styles.heroDescription}>
                A refined homepage scaffold for the next desktop experience:
                clear value, calm layout, and room to expand each section
                without adding noise.
              </Typography.Paragraph>

              <Space size={14} wrap className={styles.heroActions}>
                <Button type="primary" size="large" href={PASS_URL} target="_blank">
                  Get the pass
                </Button>
                <Button size="large" href="#how-it-works" icon={<ArrowDownOutlined />}>
                  See how it works
                </Button>
              </Space>

              <div className={styles.heroMeta}>
                <span className={styles.heroMetaPill}>1200px centered layout</span>
                <span className={styles.heroMetaPill}>Soft neutral background</span>
                <span className={styles.heroMetaPill}>Responsive Ant Design grid</span>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={11}>
            <div className={styles.heroVisual}>
              <div className={styles.heroHighlightCard}>
                <p className={styles.heroHighlightLabel}>This first pass focuses on structure</p>
                <p className={styles.heroHighlightValue}>10 sections</p>
                <p className={styles.heroHighlightText}>
                  Each section lives in its own component so we can redesign,
                  reorder, and deepen the content incrementally.
                </p>
              </div>

              <div className={styles.heroMiniGrid}>
                <div className={styles.contentCard}>
                  <p className={styles.cardEyebrow}>Design direction</p>
                  <p className={styles.cardTitle}>Minimal and premium</p>
                  <p className={styles.cardBodyText}>
                    Borrowing the soft gradients and rounded surfaces already
                    present in the current desktop experience.
                  </p>
                </div>
                <div className={styles.contentCard}>
                  <p className={styles.cardEyebrow}>Built for iteration</p>
                  <p className={styles.cardTitle}>Section by section</p>
                  <p className={styles.cardBodyText}>
                    Hero, trust, map, testimonials, and CTA are all isolated for
                    follow-up instructions.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}