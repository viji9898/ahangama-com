import { LockOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

export function NewHomeLockedMapPreviewSection() {
  return (
    <section id="map-preview" className={styles.section} aria-label="Locked map preview">
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Map preview</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Tease the network without giving the whole map away.
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          This locked preview sets up the premium feel: useful enough to create
          intent, restrained enough to preserve the value of the pass.
        </Typography.Paragraph>
      </div>

      <div className={styles.mapShell}>
        <div className={styles.mapStage}>
          <div className={styles.mapGlow} aria-hidden="true" />
          <div className={styles.mapPin} style={{ top: "18%", left: "22%" }} />
          <div className={styles.mapPin} style={{ top: "48%", left: "58%" }} />
          <div className={styles.mapPin} style={{ top: "28%", left: "74%" }} />
          <div className={styles.mapPath} style={{ top: "26%", left: "25%", width: 220, transform: "rotate(11deg)" }} />
          <div className={styles.mapPath} style={{ top: "42%", left: "58%", width: 120, transform: "rotate(-38deg)" }} />

          <div className={styles.mapOverlayCard}>
            <p className={styles.mapLabel}>Locked preview</p>
            <Typography.Title level={3} className={styles.cardTitle}>
              Full venue map unlocks with the pass
            </Typography.Title>
            <Typography.Paragraph className={styles.cardBodyText}>
              Keep this card short. The goal is to preview breadth, not explain
              every venue inside the homepage itself.
            </Typography.Paragraph>
            <Button type="primary" icon={<LockOutlined />} href="https://pass.ahangama.com" target="_blank">
              Unlock full map
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}