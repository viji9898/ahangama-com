import { Card, Grid, Typography } from "antd";
import appleWalletIconJpg from "../../assets/apple_wallet_icon.jpg";
import googleWalletIconJpg from "../../assets/google_wallet_icon.jpg";

type Props = {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

export function HeroAhangamaPass(_props: Props) {
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.md;
  const backgroundImageUrl =
    "https://ahangama-pass.s3.eu-west-2.amazonaws.com/admin/hero_desktop.jpg";

  return (
    <div style={{ width: "100%", marginBottom: 12 }}>
      <Card
        style={{
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.06)",
          backgroundImage: `radial-gradient(900px circle at 50% 0%, color-mix(in srgb, var(--pass-primary) 14%, rgba(255,255,255,0)) 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, rgba(255,255,255,0.82), rgba(248,245,240,0.82)), url(${backgroundImageUrl})`,
          backgroundSize: "auto, auto, cover",
          backgroundPosition: "center, center, center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          boxShadow: "0 16px 38px rgba(0,0,0,0.06)",
        }}
        styles={{
          body: {
            padding: isSmall ? "20px 16px 14px" : "28px 26px 18px",
          },
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
          <Typography.Title
            level={1}
            style={{
              margin: 0,
              fontSize: isSmall ? 26 : 34,
              lineHeight: 1.05,
              letterSpacing: -0.4,
            }}
          >
            <h1>Ahangama Guide 2026</h1>
          </Typography.Title>

          <Typography.Text
            type="secondary"
            style={{
              display: "block",
              marginTop: 6,
              fontSize: isSmall ? 13 : 14,
              lineHeight: 1.5,
              fontWeight: 650,
              opacity: 0.9,
            }}
          >
            Cafés, stays, surf & wellness. Show your pass, get the perk —
            instantly.
          </Typography.Text>

          <div style={{ marginTop: isSmall ? 12 : 14 }}>
            <Typography.Title
              level={1}
              style={{
                margin: 0,
                fontSize: isSmall ? 26 : 34,
                lineHeight: 1.05,
                letterSpacing: -0.4,
              }}
            >
              <h2>
                Perks & Privilages <small>with</small>{" "}
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
                      style={{ height: 22, width: "auto", borderRadius: 6 }}
                    />
                    <img
                      src={googleWalletIconJpg}
                      alt="Google Wallet"
                      style={{ height: 22, width: "auto", borderRadius: 6 }}
                    />
                  </span>
                </span>
              </h2>
            </Typography.Title>
          </div>

          <div
            style={{
              marginTop: isSmall ? 12 : 14,
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
                  <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                    {label}
                  </Typography.Text>
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
      </Card>
    </div>
  );
}

export function HeroDesktop(props: Props) {
  return <HeroAhangamaPass {...props} />;
}
