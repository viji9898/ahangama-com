import { Button, Card, ConfigProvider, Grid, Space, Typography } from "antd";

type Props = {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
};

export function HeroAhangamaPass({ onPrimaryClick, onSecondaryClick }: Props) {
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
            Ahangama Pass — save instantly at 100+ venues.
          </Typography.Title>

          <Typography.Text
            style={{
              display: "block",
              marginTop: 6,
              fontSize: isSmall ? 13 : 14,
              lineHeight: 1.45,
              fontWeight: 700,
              opacity: 0.92,
            }}
          >
            Unlock the best of Ahangama.
          </Typography.Text>

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

          <Typography.Text
            type="secondary"
            style={{
              display: "block",
              marginTop: 5,
              fontSize: 11,
              opacity: 0.8,
            }}
          >
            2,000+ travellers · Apple Wallet & Google Wallet
          </Typography.Text>

          <div style={{ marginTop: isSmall ? 12 : 14 }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "var(--pass-primary)",
                  colorPrimaryHover: "var(--pass-primary-hover)",
                  colorPrimaryActive: "var(--pass-primary-active)",
                },
              }}
            >
              <Space
                size={10}
                direction={isSmall ? "vertical" : "horizontal"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Button
                  type="primary"
                  size="middle"
                  className="ahg-mobile-cta-button"
                  onClick={onPrimaryClick}
                  style={{
                    width: isSmall ? "100%" : undefined,
                  }}
                >
                  Get Ahangama Pass
                </Button>

                <Button
                  type="default"
                  size="middle"
                  onClick={onSecondaryClick}
                  style={{
                    height: 42,
                    borderRadius: 999,
                    padding: "0 18px",
                    fontWeight: 800,
                    background: "rgba(255,255,255,0.70)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
                    width: isSmall ? "100%" : "fit-content",
                  }}
                >
                  See what’s included
                </Button>
              </Space>
            </ConfigProvider>

            <div style={{ marginTop: 6 }}>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                ✓ Takes 30 seconds · Instant access
              </Typography.Text>
            </div>
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
