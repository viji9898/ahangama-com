import { CheckCircleOutlined } from "@ant-design/icons";
import { Col, Row, Space, Typography, theme } from "antd";

const TRUST_ITEMS = [
  "100+ venues live",
  "1,000+ active pass holders",
  "0% commission model",
  "Featured on Ahangama.com",
] as const;

export function PartnerTrustBar() {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        background: "color-mix(in srgb, var(--pass-primary) 4%, #ffffff)",
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        padding: "12px 14px",
      }}
    >
      <Row gutter={[12, 10]} align="middle" justify="center">
        {TRUST_ITEMS.map((text) => (
          <Col key={text} xs={24} sm={12} md={6}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Space size={8} align="center">
                <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                <Typography.Text strong>{text}</Typography.Text>
              </Space>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
