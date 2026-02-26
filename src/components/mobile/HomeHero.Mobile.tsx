import { WhatsAppOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import appleWalletIconJpg from "../../assets/apple_wallet_icon.jpg";
import googleWalletIconJpg from "../../assets/google_wallet_icon.jpg";

const { Title, Text } = Typography;

type Props = {
  imageUrl: string;
  passUrl?: string;
  onSeeAllOffers?: () => void;
};

export function HomeHeroMobile({ imageUrl }: Props) {
  const whatsappNumberE164 = "94777908790";
  const prefilledText = "Hi! I'd like the free Ahangama guide via WhatsApp.";
  const whatsappHref = `https://wa.me/${encodeURIComponent(whatsappNumberE164)}?text=${encodeURIComponent(
    prefilledText,
  )}`;

  return (
    <section aria-label="Ahangama Pass hero">
      <div
        style={{
          padding: "22px 16px 16px",
          textAlign: "center",
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.88), rgba(248,245,240,0.88)), url(${imageUrl})`,
          backgroundSize: "auto, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <Title
            level={1}
            style={{
              margin: 0,
              fontSize: 26,
              lineHeight: 1.15,
              letterSpacing: -0.4,
              color: "#1E1E1E",
            }}
          >
            Ahangama Guide 2026
          </Title>

          <Text
            style={{
              display: "block",
              marginTop: 14,
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: 650,
              opacity: 0.56,
              color: "#1E1E1E",
            }}
          >
            Cafés, stays, surf & wellness.
          </Text>

          <Text
            style={{
              display: "block",
              marginTop: 22,
              fontSize: 13,
              lineHeight: 1.4,
              fontWeight: 650,
              opacity: 0.56,
              color: "#1E1E1E",
            }}
          >
            Perks & Privilages with
          </Text>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 14,
                whiteSpace: "nowrap",
                background: "rgba(255,255,255,0.76)",
                border: "2px solid var(--pass-primary)",
                color: "var(--pass-primary)",
                boxShadow: "0 12px 26px rgba(0,0,0,0.08)",
                maxWidth: "100%",
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  letterSpacing: -0.2,
                }}
              >
                Ahangama Pass
              </span>
              <span style={{ display: "inline-flex", gap: 6 }}>
                <img
                  src={appleWalletIconJpg}
                  alt="Apple Wallet"
                  style={{ height: 20, width: "auto", borderRadius: 6 }}
                />
                <img
                  src={googleWalletIconJpg}
                  alt="Google Wallet"
                  style={{ height: 20, width: "auto", borderRadius: 6 }}
                />
              </span>
            </div>
          </div>

          <Text
            style={{
              display: "block",
              marginTop: 18,
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: 650,
              opacity: 0.56,
              color: "#1E1E1E",
            }}
          >
            Show your pass, get the perk — instantly.
          </Text>

          <div
            aria-label="CTA block"
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: 520 }}>
              <Button
                block
                size="large"
                type="default"
                icon={<WhatsAppOutlined />}
                onClick={() => {
                  window.open(whatsappHref, "_blank", "noopener,noreferrer");
                }}
                style={{
                  height: 52,
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 14,
                  paddingInline: 16,
                  background:
                    "color-mix(in srgb, var(--pass-primary) 12%, #ffffff)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  color: "var(--pass-primary)",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                }}
              >
                Get free guide on WhatsApp
              </Button>
            </div>
          </div>

          <div
            aria-label="Trust indicators"
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                flexWrap: "wrap",
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                width: "100%",
                maxWidth: 520,
              }}
            >
              {[
                "✓ Takes 30 seconds",
                "Instant access",
                " 💳 Apple/Google Wallet ready",
              ].map((label, idx, arr) => (
                <span
                  key={label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Text
                    style={{ fontSize: 9, opacity: 0.78, color: "#1E1E1E" }}
                  >
                    {label}
                  </Text>
                  {idx < arr.length - 1 ? (
                    <span aria-hidden style={{ opacity: 0.35 }}>
                      •
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
