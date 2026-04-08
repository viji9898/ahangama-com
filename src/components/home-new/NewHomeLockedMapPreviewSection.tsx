import { LockOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

const PASS_URL = "https://pass.ahangama.com";

export function NewHomeLockedMapPreviewSection() {
  return (
    <section
      id="map-preview"
      className={styles.section}
      aria-label="Locked map preview"
    >
      <div className={styles.mapShell}>
        <Row
          gutter={[28, 28]}
          align="middle"
          className={styles.mapPreviewLayout}
        >
          <Col xs={24} lg={9}>
            <div className={styles.mapPreviewCopy}>
              <span className={styles.eyebrow}>Map preview</span>
              <Typography.Title level={2} className={styles.mapPreviewTitle}>
                Explore 100+ venues
              </Typography.Title>
              <Typography.Paragraph className={styles.mapPreviewDescription}>
                Cafes, stays, surf, wellness and more
              </Typography.Paragraph>
            </div>
          </Col>

          <Col xs={24} lg={15}>
            <div className={styles.mapStage} aria-hidden="true">
              <div className={styles.mapGlow} />
              <div
                className={styles.mapPin}
                style={{ top: "16%", left: "18%" }}
              />
              <div
                className={styles.mapPin}
                style={{ top: "24%", left: "58%" }}
              />
              <div
                className={styles.mapPin}
                style={{ top: "36%", left: "74%" }}
              />
              <div
                className={styles.mapPin}
                style={{ top: "48%", left: "34%" }}
              />
              <div
                className={styles.mapPin}
                style={{ top: "62%", left: "54%" }}
              />
              <div
                className={styles.mapPin}
                style={{ top: "72%", left: "24%" }}
              />
              <div
                className={styles.mapPath}
                style={{
                  top: "23%",
                  left: "20%",
                  width: 220,
                  transform: "rotate(8deg)",
                }}
              />
              <div
                className={styles.mapPath}
                style={{
                  top: "34%",
                  left: "53%",
                  width: 124,
                  transform: "rotate(24deg)",
                }}
              />
              <div
                className={styles.mapPath}
                style={{
                  top: "56%",
                  left: "32%",
                  width: 142,
                  transform: "rotate(11deg)",
                }}
              />
              <div className={styles.mapPreviewLock}>
                <div className={styles.mapPreviewOverlayCard}>
                  <p className={styles.mapLabel}>Protected access</p>
                  <Typography.Title
                    level={3}
                    className={styles.mapPreviewOverlayTitle}
                  >
                    Unlock full access with the pass
                  </Typography.Title>
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    href={PASS_URL}
                    target="_blank"
                    className={styles.mapPreviewButton}
                  >
                    Get your pass
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
