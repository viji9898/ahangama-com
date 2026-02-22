import { Button, Card, ConfigProvider, Typography } from "antd";
import type { ReactNode } from "react";

const { Title, Text, Paragraph } = Typography;

type Props = {
  onGuideClick: () => void;
};

export default function FreeGuideCtaMobile({ onGuideClick }: Props) {
  const buttonIcon: ReactNode = (
    <span style={{ fontSize: 14, marginRight: 4 }}>💬</span>
  );

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "var(--venue-card-bg)",
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
        <div style={{ flex: 1 }}>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 18,
            }}
          >
            Free Ahangama Guide
          </Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Comprehensive offline guide
          </Text>
        </div>
      </div>

      <Paragraph
        style={{
          marginBottom: 16,
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        A practical offline PDF with our favourite cafés, stays, and hidden
        spots. Sent straight to WhatsApp.
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
          type="primary"
          size="large"
          onClick={onGuideClick}
          block
          style={{
            borderRadius: 10,
            height: 44,
            fontWeight: 600,
          }}
          icon={buttonIcon}
        >
          Get Guide via WhatsApp
        </Button>
      </ConfigProvider>
    </Card>
  );
}
