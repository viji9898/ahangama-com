import { Card, Col, Row, Typography } from "antd";

const { Text } = Typography;

type Step = {
  icon: string;
  title: string;
  description: string;
};

type Props = {
  style?: React.CSSProperties;
};

export function HowItWorks({ style }: Props) {
  const steps: Step[] = [
    {
      icon: "🎟️",
      title: "Buy the Ahangama Pass",
      description: "Checkout securely in under a minute.",
    },
    {
      icon: "📱",
      title: "Show it at partner venues",
      description: "Open your pass in Apple/Google Wallet.",
    },
    {
      icon: "💸",
      title: "Save instantly",
      description: "Get the perk on the spot — no codes.",
    },
  ];

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "color-mix(in srgb, var(--pass-primary) 6%, var(--venue-card-bg))",
        boxShadow: "0 14px 34px rgba(0,0,0,0.06)",
        ...style,
      }}
      styles={{ body: { padding: 16 } }}
    >
      <Row gutter={[12, 12]} align="middle" justify="center">
        {steps.map((s) => (
          <Col key={s.title} xs={24} md={8} style={{ display: "flex" }}>
            <Card
              style={{
                width: "100%",
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.70)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                textAlign: "center",
              }}
              styles={{ body: { padding: 14 } }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  margin: "0 auto 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "color-mix(in srgb, var(--pass-primary) 10%, rgba(255,255,255,0.85))",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                  fontSize: 16,
                }}
                aria-hidden
              >
                {s.icon}
              </div>

              <div style={{ fontWeight: 900, fontSize: 13, color: "#222" }}>
                {s.title}
              </div>
              <Text type="secondary" style={{ display: "block", marginTop: 6 }}>
                {s.description}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default HowItWorks;
