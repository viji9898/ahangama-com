import { Button, Card, ConfigProvider, Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Text, Paragraph } = Typography;

type Props = {
  onGuideClick: () => void;
};

export function FreeGuideCtaDesktop({ onGuideClick }: Props) {
  const buttonIcon: ReactNode = (
    <span style={{ fontSize: 14, marginRight: 4 }}>💬</span>
  );

  const prefilledText = "Hi! I'd like the free Ahangama guide via WhatsApp.";
  const whatsappUrl = `https://wa.me/94777879087?text=${encodeURIComponent(prefilledText)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(whatsappUrl)}`;

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "var(--venue-card-bg)",
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        <div
          style={{
            flex: "0 0 60%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
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
                background: "rgba(0,0,0,0.06)",
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
              <Title level={4} style={{ margin: 0, fontSize: 18 }}>
                Free Ahangama Guide
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Comprehensive offline guide
              </Text>
            </div>
          </div>

          <Paragraph
            style={{ marginBottom: 12, fontSize: 14, lineHeight: 1.5 }}
          >
            A practical offline PDF with our favourite cafés, stays, and hidden
            spots. Sent straight to WhatsApp.
          </Paragraph>

          <div style={{ marginTop: "auto" }}>
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
                size="middle"
                onClick={onGuideClick}
                style={{
                  borderRadius: 10,
                  height: 38,
                  fontWeight: 600,
                }}
                icon={buttonIcon}
              >
                Get Guide via WhatsApp
              </Button>
            </ConfigProvider>
          </div>
        </div>

        <div
          style={{
            flex: "0 0 40%",
            minWidth: 160,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 8,
          }}
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={qrCodeUrl}
              alt="WhatsApp QR code"
              style={{
                width: 120,
                height: 120,
                objectFit: "contain",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#fff",
                display: "block",
              }}
              loading="lazy"
            />
          </a>

          <Text
            type="secondary"
            style={{ fontSize: 12, display: "block", width: "100%" }}
          >
            Scan to open in WhatsApp
          </Text>
        </div>
      </div>
    </Card>
  );
}
