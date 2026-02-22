import { Button, Card, ConfigProvider, Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Text, Paragraph } = Typography;

type Props = {
  onGuideClick: () => void;
};

export function FreeGuideCtaDesktop({ onGuideClick }: Props) {
  const buttonIcon: ReactNode = (
    <span style={{ fontSize: 14, marginRight: 6 }}>💬</span>
  );

  return (
    <Card
      style={{
        borderRadius: 18,
        border: "1px solid rgba(0,0,0,0.05)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,245,240,0.95))",
        boxShadow: "0 14px 34px rgba(0,0,0,0.06)",
      }}
      styles={{ body: { padding: 18 } }}
    >
      {/* HEADER ROW */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 14,
        }}
      >
        {/* Icon Block */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background:
              "color-mix(in srgb, var(--pass-primary) 14%, rgba(0,0,0,0.03))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          📖
        </div>

        {/* Text Block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 19,
              lineHeight: 1.2,
            }}
          >
            2026 Insider Guide to Ahangama
          </Title>

          <Text
            style={{
              fontSize: 13,
              opacity: 0.85,
              display: "block",
              marginTop: 6,
            }}
          >
            Save like a local. Discover our favourite cafés, stays, surf spots &
            hidden gems.
          </Text>

          {/* Badge + Social Proof */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 999,
                background:
                  "color-mix(in srgb, var(--pass-primary) 12%, #ffffff)",
                border: "1px solid rgba(0,0,0,0.06)",
                color: "var(--pass-primary)",
              }}
            >
              Free Download
            </span>

            <Text type="secondary" style={{ fontSize: 12 }}>
              3,200+ downloads
            </Text>
          </div>
        </div>
      </div>

      {/* Supporting line */}
      <Paragraph
        style={{
          marginBottom: 18,
          fontSize: 14,
          lineHeight: 1.5,
          opacity: 0.9,
        }}
      >
        Get the full 2026 Ahangama Guide sent instantly to your WhatsApp →
      </Paragraph>

      {/* CTA */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "var(--pass-primary)",
            colorPrimaryHover: "var(--pass-primary-hover)",
            colorPrimaryActive: "var(--pass-primary-active)",
          },
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={onGuideClick}
          block
          style={{
            borderRadius: 999,
            height: 48,
            fontWeight: 700,
            fontSize: 15,
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          icon={buttonIcon}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.18)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.12)";
          }}
        >
          Get Guide via WhatsApp
        </Button>
      </ConfigProvider>
    </Card>
  );
}

export default FreeGuideCtaDesktop;
