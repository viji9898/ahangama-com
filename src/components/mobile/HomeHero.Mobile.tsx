import { Typography } from "antd";
import appleWalletIconJpg from "../../assets/apple_wallet_icon.jpg";
import googleWalletIconJpg from "../../assets/google_wallet_icon.jpg";

const { Title, Text } = Typography;

type Props = {
  imageUrl: string;
  passUrl?: string;
  onSeeAllOffers?: () => void;
};

export function HomeHeroMobile({ ...props }: Props) {
  void props;

  const backgroundImageUrl =
    "https://ahangama-pass.s3.eu-west-2.amazonaws.com/admin/hero_desktop.jpg";

  return (
    <section aria-label="Ahangama Pass hero">
      <div
        style={{
          padding: "18px 16px 12px",
          textAlign: "center",
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.88), rgba(248,245,240,0.88)), url(${backgroundImageUrl})`,
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
            Ahanagama Guide 2026
          </Title>

          <Text
            style={{
              display: "block",
              marginTop: 12,
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: 650,
              opacity: 0.56,
              color: "#1E1E1E",
            }}
          >
            Cafés, stays, surf & wellness.
          </Text>

          <div style={{ marginTop: 10 }}>
            <Title
              level={2}
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.05,
                letterSpacing: -0.4,
                color: "#1E1E1E",
              }}
            >
              <h2>
                Perks & Privilages{" "}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    color: "#000",
                    border: "2px solid #000",
                    padding: "2px 10px",
                    borderRadius: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ahangama Pass
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
                </span>
              </h2>
            </Title>
          </div>

          <Text
            style={{
              display: "block",
              marginTop: 10,
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
            aria-label="Trust indicators"
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
                gap: 8,
                flexWrap: "wrap",
                padding: "8px 12px",
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
                    gap: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 11, opacity: 0.78, color: "#1E1E1E" }}
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
