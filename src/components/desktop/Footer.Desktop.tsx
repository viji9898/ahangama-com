import { Col, Row, Space, Typography } from "antd";

export function FooterDesktop() {
  const year = new Date().getFullYear();
  const passBaseUrl = "https://pass.ahangama.com";
  const faqUrl = `${passBaseUrl}/faq`;
  const refundPolicyUrl = `${passBaseUrl}/refund-policy`;
  const termsUrl = `${passBaseUrl}/terms`;
  const privacyUrl = `${passBaseUrl}/privacy`;

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
      <div className="ahg-footer-mobile-extras">
        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.75)",
            padding: 12,
          }}
        >
          <Typography.Text
            strong
            style={{
              display: "block",
              fontSize: 12,
              letterSpacing: 0.2,
              textTransform: "uppercase",
            }}
          >
            How It Works
          </Typography.Text>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
            }}
          >
            {[
              { n: "1", t: "Buy Pass" },
              { n: "2", t: "Show at venue" },
              { n: "3", t: "Save instantly" },
            ].map((step) => (
              <div
                key={step.n}
                style={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: "center",
                  padding: "10px 8px",
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    margin: "0 auto",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: 12,
                    color: "rgba(0,0,0,0.78)",
                    background: "rgba(0,0,0,0.06)",
                  }}
                >
                  {step.n}
                </div>
                <Typography.Text
                  style={{
                    display: "block",
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: 800,
                    color: "rgba(0,0,0,0.75)",
                    lineHeight: "14px",
                  }}
                >
                  {step.t}
                </Typography.Text>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Typography.Link
              href={faqUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12 }}
            >
              FAQ
            </Typography.Link>
            <Typography.Link
              href={refundPolicyUrl}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12 }}
            >
              Refund Policy
            </Typography.Link>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              🔒 Secured by Stripe
            </Typography.Text>
          </div>
        </div>
      </div>

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
              <ItemLink href="?q=cafe">Best Cafés</ItemLink>
              <ItemLink href="?q=surf">Best Surf Spots</ItemLink>
              <ItemLink href="https://pass.ahangama.com" external>
                How it works
              </ItemLink>
              <ItemLink href="/partner-signup">Partner with us</ItemLink>
            </Space>
          </Space>
        </Col>

        <Col xs={{ span: 8, order: 0 }} md={{ span: 5, order: 0 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <SectionTitle>Legal</SectionTitle>
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <ItemLink href={termsUrl} external>
                Terms
              </ItemLink>
              <ItemLink href={privacyUrl} external>
                Privacy
              </ItemLink>
            </Space>
          </Space>
        </Col>

        <Col xs={{ span: 8, order: 0 }} md={{ span: 5, order: 0 }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <SectionTitle>Contact</SectionTitle>
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <ItemLink href="#">Email</ItemLink>
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
