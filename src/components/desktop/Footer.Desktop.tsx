import { Col, Row, Space, Typography } from "antd";
import styles from "./Footer.Desktop.module.css";

export function FooterDesktop() {
  const year = new Date().getFullYear();

  const SectionTitle = ({ children }: { children: string }) => (
    <Typography.Text strong className={styles.sectionTitle}>
      {children}
    </Typography.Text>
  );

  const ItemLink = ({
    href,
    children,
    external,
  }: {
    href: string;
    children: string;
    external?: boolean;
  }) => {
    if (!href || href === "#") {
      return (
        <Typography.Text type="secondary" className={styles.mutedLink}>
          {children}
        </Typography.Text>
      );
    }

    return (
      <Typography.Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={styles.link}
      >
        {children}
      </Typography.Link>
    );
  };

  return (
    <div className={styles.shell}>
      <div className={styles.topRule} aria-hidden="true" />
      <p className={styles.kicker}>Ahangama pass footer</p>

      <div className={styles.panel}>
        <Row gutter={[0, 0]} align="top">
          <Col xs={{ span: 24, order: 0 }} md={{ span: 9, order: 0 }}>
            <div className={styles.brandCol}>
              <Typography.Text className={styles.brandName}>
                ahangama.com
              </Typography.Text>
              <Typography.Paragraph className={styles.brandCopy}>
                Curated destination guides and local privileges for independent
                travellers.
              </Typography.Paragraph>
              <div className={styles.metaRow}>
                <span className={styles.metaPill}>Ahangama Pass</span>
                <span className={styles.metaPill}>Updated for {year}</span>
              </div>
            </div>
          </Col>

          <Col xs={{ span: 24, order: 1 }} md={{ span: 5, order: 0 }}>
            <div className={styles.sectionCol}>
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <SectionTitle>Quick Links</SectionTitle>
                <div className={styles.linkStack}>
                  <ItemLink href="/partner-signup">Partner Signup</ItemLink>
                </div>
              </Space>
            </div>
          </Col>

          <Col xs={{ span: 24, order: 2 }} md={{ span: 5, order: 0 }}>
            <div className={styles.sectionCol}>
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <SectionTitle>Legal</SectionTitle>
                <div className={styles.linkStack}>
                  <ItemLink href="/legal#terms">Terms</ItemLink>
                  <ItemLink href="/legal#privacy">Privacy</ItemLink>
                  <ItemLink href="/legal#faq">FAQ</ItemLink>
                  <ItemLink href="/legal#refund-policy">Refund Policy</ItemLink>
                </div>
              </Space>
            </div>
          </Col>

          <Col xs={{ span: 24, order: 3 }} md={{ span: 5, order: 0 }}>
            <div className={styles.sectionCol}>
              <Space direction="vertical" size={0} style={{ width: "100%" }}>
                <SectionTitle>Contact</SectionTitle>
                <div className={styles.linkStack}>
                  <ItemLink href="mailto:team@ahangama.com">Email</ItemLink>
                  <ItemLink
                    href="https://www.instagram.com/ahangama.pass/"
                    external
                  >
                    Instagram
                  </ItemLink>
                  <Typography.Text
                    type="secondary"
                    className={styles.mutedLink}
                  >
                    © {year} Ahangama
                  </Typography.Text>
                </div>
              </Space>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
