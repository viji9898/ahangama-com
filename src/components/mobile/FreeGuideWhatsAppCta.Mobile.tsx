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
                marginTop: 12,
                height: 44,
                borderRadius: 12,
                fontWeight: 900,
              }}
            >
              Get Free Guide on WhatsApp
            </Button>
          </ConfigProvider>

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
