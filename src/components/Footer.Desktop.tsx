import { Col, Row, Space, Typography } from "antd";

export function FooterDesktop() {
  const year = new Date().getFullYear();

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
      <Row gutter={[24, 16]} align="top">
        <Col xs={24} md={10}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Typography.Text strong>ahangama.com</Typography.Text>
            <Typography.Text type="secondary">
              Curated destination guides + local privileges for independent
              travellers.
            </Typography.Text>
            <Typography.Text type="secondary">© {year} Ahangama.</Typography.Text>
          </Space>
        </Col>

        <Col xs={24} md={7}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Typography.Text strong>Quick Links</Typography.Text>
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <Typography.Text>About</Typography.Text>
              <Typography.Text>Partner with us</Typography.Text>
              <Typography.Text>Card terms</Typography.Text>
            </Space>
          </Space>
        </Col>

        <Col xs={24} md={7}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Typography.Text strong>Connect</Typography.Text>
            <Typography.Link href="https://ahangama.com" target="_blank" rel="noreferrer">
              ahangama.com
            </Typography.Link>
            <Typography.Link
              href="https://www.instagram.com/ahangama.pass/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram: ahangama.pass
            </Typography.Link>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
