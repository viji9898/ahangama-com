import { Button, Typography } from "antd";

const { Title, Text } = Typography;

type Props = {
  imageUrl: string;
  passUrl?: string;
  onSeeAllOffers?: () => void;
};

export function HomeHeroMobile({ ...props }: Props) {
  const { passUrl = "https://pass.ahangama.com", onSeeAllOffers } = props;

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
            Ahangama Pass <br /> save instantly at 100+ venues.
          </Title>

          <Text
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 13,
              lineHeight: 1.45,
              fontWeight: 800,
              opacity: 0.92,
              color: "#1E1E1E",
            }}
          >
            Unlock the best of Ahangama.
          </Text>

          <Text
            style={{
              display: "block",
              marginTop: 8,
              fontSize: 13,
              lineHeight: 1.5,
              fontWeight: 650,
              opacity: 0.86,
              color: "#1E1E1E",
            }}
          >
            Cafés, stays, surf & wellness. Show your pass, get the perk —
            instantly.
          </Text>

          <Text
            style={{
              display: "block",
              marginTop: 6,
              fontSize: 11,
              opacity: 0.78,
              color: "#1E1E1E",
            }}
          >
            2,000+ travellers · Apple Wallet & Google Wallet
          </Text>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 14,
              alignItems: "center",
            }}
          >
            <Button
              block
              size="large"
              href={passUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ahg-mobile-cta-button"
              style={{
                height: 46,
                fontWeight: 900,
                borderRadius: 999,
                border: "none",
                maxWidth: 420,
              }}
            >
              Get Ahangama Pass
            </Button>

            <Button
              block
              size="large"
              type="default"
              onClick={onSeeAllOffers}
              style={{
                height: 46,
                borderRadius: 999,
                padding: "0 18px",
                fontWeight: 900,
                background: "rgba(255,255,255,0.70)",
                border: "1px solid rgba(0,0,0,0.10)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
                color: "#111",
                maxWidth: 420,
              }}
            >
              See what’s included
            </Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 11, opacity: 0.75, color: "#1E1E1E" }}>
              ✓ Takes 30 seconds · Instant access
            </Text>
          </div>

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
                "🔒 Secure checkout",
                "⚡ Instant delivery",
                "💳 Apple/Google Wallet ready",
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
