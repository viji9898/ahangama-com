import { Button, Col, Row, Space, Typography } from "antd";
import appleWalletIconJpg from "../../assets/apple_wallet_icon.jpg";
import googleWalletIconJpg from "../../assets/google_wallet_icon.jpg";
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
                Save $50–$150 on your Ahangama trip
              </Typography.Title>
              <Typography.Paragraph className={styles.heroDescription}>
                One pass. Instant discounts at 100+ places.
              </Typography.Paragraph>
              <Typography.Paragraph className={styles.heroMicroProof}>
                Cafes • Stays • Surf • Wellness
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
                  className={styles.heroSecondaryButton}
                >
                  See how it works
                </Button>
              </Space>

              <Typography.Paragraph className={styles.heroTrustLine}>
                Works instantly • No app needed • Takes 30 seconds
              </Typography.Paragraph>

              <div className={styles.heroWalletSupport}>
                <div className={styles.heroWalletItem}>
                  <span>Add to Wallet</span>
                  <img
                    src={appleWalletIconJpg}
                    alt="Apple Wallet"
                    className={styles.heroWalletIcon}
                    draggable={false}
                  />
                  <img
                    src={googleWalletIconJpg}
                    alt="Google Wallet"
                    className={styles.heroWalletIcon}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </Col>

          <Col xs={{ span: 24, order: 1 }} lg={{ span: 13, order: 2 }}>
            <div className={styles.heroVisual}>
              <div className={styles.heroVisualStage}>
                <div
                  className={styles.heroPassMockup}
                  aria-label="Ahangama pass preview"
                >
                  <div className={styles.heroPassMediaWrap}>
                    <img
                      src={heroPassAppleWalletPng}
                      alt="Ahangama pass shown in an Apple Wallet style card"
                      className={styles.heroPassImage}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
