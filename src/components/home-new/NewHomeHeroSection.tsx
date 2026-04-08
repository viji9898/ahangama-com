import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import heroPassAppleWalletPng from "../../assets/hero_pass_apple_wallet.png";
import styles from "../../pages/home/Home.desktop.new.module.css";

const PASS_URL = "https://pass.ahangama.com";

export function NewHomeHeroSection() {
  return (
    <section id="hero" className={styles.section} aria-label="Hero">
      <div className={styles.heroShell}>
        <Row gutter={[32, 32]} align="middle" className={styles.heroRow}>
          <Col xs={{ span: 24, order: 2 }} lg={{ span: 11, order: 1 }}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Ahangama Pass</span>
              <Typography.Title level={1} className={styles.heroTitle}>
                Save $50–$150 on your{" "}
                <span className={styles.heroAccent}>Ahangama trip</span>
              </Typography.Title>
              <Typography.Paragraph className={styles.heroDescription}>
                One pass. 100+ places. Cafes, stays, surf, wellness.
              </Typography.Paragraph>

              <Space size={14} wrap className={styles.heroActions}>
                <Button
                  type="primary"
                  size="large"
                  href={PASS_URL}
                  target="_blank"
                  className={styles.heroPrimaryButton}
                >
                  Get your pass
                </Button>
                <Button
                  size="large"
                  href="#how-it-works"
                  icon={<ArrowRightOutlined />}
                  className={styles.heroSecondaryButton}
                >
                  See how it works
                </Button>
              </Space>

              <Typography.Paragraph className={styles.heroTrustLine}>
                100+ venues • Instant QR • Same-day use
              </Typography.Paragraph>
            </div>
          </Col>

          <Col xs={{ span: 24, order: 1 }} lg={{ span: 13, order: 2 }}>
            <div className={styles.heroVisual}>
              <div className={styles.heroVisualStage}>
                <div className={styles.heroPassHalo} aria-hidden="true" />

                <div
                  className={styles.heroPassMockup}
                  aria-label="Ahangama pass preview"
                >
                  <div className={styles.heroPassTopRow}>
                    <div>
                      <p className={styles.heroPassLabel}>
                        Ahangama Savings Pass
                      </p>
                      <p className={styles.heroPassTitle}>Wallet-ready</p>
                    </div>
                    <span className={styles.heroPassChip}>Ready now</span>
                  </div>

                  <div className={styles.heroPassMediaWrap}>
                    <img
                      src={heroPassAppleWalletPng}
                      alt="Ahangama pass shown in an Apple Wallet style card"
                      className={styles.heroPassImage}
                      draggable={false}
                    />
                  </div>

                  <div className={styles.heroPassBottomRow}>
                    <div>
                      <p className={styles.heroPassMetricLabel}>
                        Typical trip savings
                      </p>
                      <p className={styles.heroPassMetricValue}>$50–$150</p>
                    </div>
                    <div>
                      <p className={styles.heroPassMetricLabel}>Access</p>
                      <p className={styles.heroPassMetricValue}>100+ venues</p>
                    </div>
                  </div>
                </div>

                <div className={styles.heroVisualNote}>
                  <span
                    className={styles.heroVisualNoteDot}
                    aria-hidden="true"
                  />
                  <span>Use it the day you buy.</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
