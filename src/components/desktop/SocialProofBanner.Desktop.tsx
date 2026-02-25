import { Card, Col, Grid, Row, Typography } from "antd";

const { Text } = Typography;

type Metric = {
  value: string;
  label: string;
};

type Props = {
  metrics?: Metric[];
};

export function SocialProofBannerDesktop({ metrics }: Props) {
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.md;

  const resolvedMetrics: Metric[] = metrics ?? [
    {
      value: "2,300+",
      label: "travellers already using Ahangama Pass",
    },
    {
      value: "$68",
      label: "average member savings in 10 days",
    },
    {
      value: "100+",
      label: "partner venues across Ahangama",
    },
  ];

  return (
    <section aria-label="Social proof">
      <Card
        style={{
          width: "100%",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.06)",
          background:
            "color-mix(in srgb, var(--pass-primary) 6%, rgba(255,255,255,0.86))",
          boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
        }}
        styles={{
          body: {
            padding: isSmall ? "14px 16px" : "16px 18px",
          },
        }}
      >
        <Row gutter={[12, 12]} align="middle" justify="center">
          {resolvedMetrics.map((m, idx) => (
            <Col
              key={m.value}
              xs={24}
              md={8}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  padding: isSmall ? "6px 0" : "4px 0",
                  borderLeft:
                    !isSmall && idx > 0
                      ? "1px solid rgba(0,0,0,0.06)"
                      : undefined,
                }}
              >
                <Text
                  style={{
                    display: "block",
                    fontSize: isSmall ? 18 : 20,
                    fontWeight: 950,
                    lineHeight: 1.1,
                    color: "rgba(0,0,0,0.88)",
                    letterSpacing: -0.2,
                  }}
                >
                  {m.value}
                </Text>
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    marginTop: 6,
                    fontSize: isSmall ? 13 : 13,
                    fontWeight: 700,
                    opacity: 0.9,
                    lineHeight: 1.25,
                  }}
                >
                  {m.label}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </section>
  );
}
