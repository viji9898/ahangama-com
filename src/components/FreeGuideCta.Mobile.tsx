import { Button, Card, ConfigProvider, Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Text, Paragraph } = Typography;

type Props = {
  onGuideClick: () => void;
  guideUrl?: string;
};

export default function FreeGuideCtaMobile({ onGuideClick, guideUrl }: Props) {
  const resolvedGuideUrl =
    guideUrl ??
    "https://wa.me/94777879087?text=" +
      encodeURIComponent("Hi! I'd like the free Ahangama guide via WhatsApp.");

  const buttonIcon: ReactNode = (
    <span style={{ fontSize: 14, marginRight: 4 }}>💬</span>
  );

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "color-mix(in srgb, var(--pass-primary) 6%, var(--venue-card-bg))",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background:
              "color-mix(in srgb, var(--pass-primary) 12%, rgba(0,0,0,0.04))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          📄
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 6 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 800,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(0,0,0,0.08)",
                color: "#2F3E3A",
                letterSpacing: 0.2,
              }}
            >
              2026 • Free Guide
            </span>
          </div>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 18,
            }}
          >
            2026 Insider Guide to Ahangama
          </Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 4,
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              Our curated list of favourite cafés, stays, surf spots & hidden
              gems.
            </Text>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: 999,
                background:
                  "color-mix(in srgb, var(--pass-primary) 10%, #ffffff)",
                border: "1px solid rgba(0,0,0,0.06)",
                color: "var(--pass-primary)",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Free Download
            </span>
          </div>

          <div style={{ marginTop: 6 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              3,200+ downloads
            </Text>
          </div>
        </div>
      </div>

      <Paragraph
        style={{
          marginBottom: 16,
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        Get the guide sent straight to WhatsApp.
      </Paragraph>

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
          type="default"
          size="large"
          onClick={onGuideClick}
          block
          style={{
            borderRadius: 999,
            height: 44,
            fontWeight: 700,
            background: "color-mix(in srgb, var(--pass-primary) 12%, #ffffff)",
            border: "1px solid rgba(0,0,0,0.08)",
            color: "var(--pass-primary)",
            boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          icon={buttonIcon}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 26px rgba(0,0,0,0.10)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
          }}
        >
          Get Guide via WhatsApp
        </Button>

        <div style={{ marginTop: 8, textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: 11, opacity: 0.75 }}>
            No spam • one message
          </Text>
        </div>

        {/* Keeps QR value available for parity with desktop; not rendered on mobile */}
        <a
          href={resolvedGuideUrl}
          target="_blank"
          rel="noreferrer"
          style={{ display: "none" }}
        />
      </ConfigProvider>
    </Card>
  );
}
