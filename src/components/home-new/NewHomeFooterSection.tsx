import { Col, Row } from "antd";
import styles from "../../pages/home/Home.desktop.new.module.css";

export function NewHomeFooterSection() {
  return (
    <section className={styles.footerWrap} aria-label="Footer">
      <footer className={styles.footerPanel}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className={styles.footerBlock}>
              <p className={styles.footerHeading}>Brand</p>
              <a href="https://ahangama.com" className={styles.footerBrandLink}>
                ahangama.com
              </a>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className={styles.footerBlock}>
              <p className={styles.footerHeading}>Links</p>
              <div className={styles.footerLinkList}>
                <a href="/legal#terms" className={styles.footerLink}>
                  Terms
                </a>
                <a href="/legal#privacy" className={styles.footerLink}>
                  Privacy
                </a>
                <a href="/legal#faq" className={styles.footerLink}>
                  FAQ
                </a>
                <a href="/legal#refund-policy" className={styles.footerLink}>
                  Refund Policy
                </a>
              </div>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div className={styles.footerBlock}>
              <p className={styles.footerHeading}>Contact</p>
              <div className={styles.footerLinkList}>
                <a
                  href="mailto:team@ahangama.com"
                  className={styles.footerLink}
                >
                  Email
                </a>
                <a
                  href="https://www.instagram.com/ahangama.pass/"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.footerLink}
                >
                  Instagram
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </footer>
    </section>
  );
}
