import { Col, Row, Space, Typography } from "antd";

export function FooterDesktop() {
  const year = new Date().getFullYear();

  const SectionTitle = ({ children }: { children: string }) => (
    <Typography.Text
      strong
      style={{ fontSize: 12, letterSpacing: 0.2, textTransform: "uppercase" }}
    >
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
        <Typography.Text
          type="secondary"
          style={{ fontSize: 12, opacity: 0.65 }}
        >
          {children}
        </Typography.Text>
      );
    }

    return (
      <Typography.Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        style={{ fontSize: 12 }}
      >
        {children}
      </Typography.Link>
    );
  };

  return (
    <div
      style={{
        marginTop: 18,
        background: "var(--venue-card-bg)",
        borderRadius: 16,
        padding: 16,
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Row gutter={[12, 12]} align="top">
        <Col xs={{ span: 24, order: 2 }} md={{ span: 9, order: 0 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Typography.Text strong style={{ fontSize: 13 }}>
              ahangama.com
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Curated destination guides + local privileges for independent
              travellers.
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              © {year} Ahangama.
            </Typography.Text>
          </Space>
        </Col>

        <Col xs={{ span: 8, order: 0 }} md={{ span: 5, order: 0 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <SectionTitle>Quick Links</SectionTitle>
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <ItemLink href="/partner-signup">Partner Signup</ItemLink>
            </Space>
          </Space>
        </Col>

        <Col xs={{ span: 8, order: 0 }} md={{ span: 5, order: 0 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <SectionTitle>Legal</SectionTitle>
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <ItemLink href="/legal#terms">Terms</ItemLink>
              <ItemLink href="/legal#privacy">Privacy</ItemLink>
              <ItemLink href="/legal#faq">FAQ</ItemLink>
              <ItemLink href="/legal#refund-policy">Refund Policy</ItemLink>
            </Space>
          </Space>
        </Col>

        <Col xs={{ span: 8, order: 0 }} md={{ span: 5, order: 0 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <SectionTitle>Contact</SectionTitle>
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <ItemLink href="mailto:team@ahangama.com">Email</ItemLink>
              <ItemLink
                href="https://www.instagram.com/ahangama.pass/"
                external
              >
                Instagram
              </ItemLink>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
