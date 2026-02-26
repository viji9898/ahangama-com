import { Button, Card, ConfigProvider, Typography } from "antd";

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
            Free 2026 Ahangama Guide
          </Title>
          <Text
            type="secondary"
            style={{
              display: "block",
              marginTop: 10,
              fontSize: 13,
              lineHeight: 1.35,
            }}
          >
            Cafés, surf spots, laptop-friendly cafés & hidden gems.
          </Text>

          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#25D366",
                colorPrimaryHover: "#1EBE5C",
                colorPrimaryActive: "#1AA64F",
              },
            }}
          >
            <Button
              block
              type="primary"
              size="large"
              onClick={() => {
                window.open(href, "_blank", "noopener,noreferrer");
              }}
              style={{
                marginTop: 14,
                height: 52,
                borderRadius: 14,
                fontWeight: 800,
                fontSize: 15,
                boxShadow: "0 12px 26px rgba(0,0,0,0.12)",
              }}
            >
              📲 Get the Guide on WhatsApp
            </Button>
          </ConfigProvider>

          <Text
            style={{
              display: "block",
              marginTop: 10,
              fontSize: 12,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            Delivered instantly. No spam.
          </Text>
        </div>
      </div>
    </Card>
  );
}
