import { Button, Card, Typography } from "antd";
import type { ReactNode } from "react";

const { Text, Title } = Typography;

type Props = {
  whatsappNumberE164?: string;
  prefilledText?: string;
};

export function FreeGuideWhatsAppCtaMobile({
  whatsappNumberE164 = "94777908790",
  prefilledText = "Hi! I'd like the free Ahangama guide via WhatsApp.",
}: Props) {
  const href = `https://wa.me/${encodeURIComponent(whatsappNumberE164)}?text=${encodeURIComponent(
    prefilledText,
  )}`;

  const buttonIcon: ReactNode = (
    <span style={{ fontSize: 14, marginRight: 6 }}>💬</span>
  );

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.78)",
        boxShadow: "0 10px 26px rgba(0,0,0,0.04)",
        margin: "0 8px",
      }}
      styles={{ body: { padding: 14 } }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title
            level={5}
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.2,
              letterSpacing: -0.2,
            }}
          >
            Get the free 2026 Ahangama guide
          </Title>
          <Text
            type="secondary"
            style={{
              display: "block",
              marginTop: 6,
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            Instant WhatsApp delivery. Cafés, surf, stays & hidden gems.
          </Text>

          <Button
            block
            type="default"
            size="large"
            icon={buttonIcon}
            onClick={() => {
              window.open(href, "_blank", "noopener,noreferrer");
            }}
            style={{
              marginTop: 12,
              height: 48,
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 13,
              paddingInline: 18,

              background:
                "color-mix(in srgb, var(--pass-primary) 12%, #ffffff)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "var(--pass-primary)",
              boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.16)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.10)";
            }}
          >
            Get Free Guide on WhatsApp
          </Button>

          <Text
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 12,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            No spam. One message.
          </Text>
        </div>
      </div>
    </Card>
  );
}
