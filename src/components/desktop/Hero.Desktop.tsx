import { Button, ConfigProvider, Typography } from "antd";

type Props = {
  image?: string;
};

export function HeroDesktop({ image }: Props) {
  return (
    <div
      style={{
        background: "var(--venue-card-bg)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 28,
        width: "100%",
        minHeight: 240,
        padding: 24,
        marginBottom: 16,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography.Title
          level={2}
          style={{ margin: 0, fontSize: 36, lineHeight: 1.12 }}
        >
          One Pass. 100+ Perks Across Ahangama.
        </Typography.Title>

        <Typography.Text
          type="secondary"
          style={{
            display: "block",
            marginTop: 10,
            fontSize: 16,
            lineHeight: 1.45,
          }}
        >
          Save on cafés, stays, surf, wellness & experiences — instantly.
        </Typography.Text>

        <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
          <Typography.Text style={{ fontSize: 14 }}>
            ✔ Save 10–20% at top cafés
          </Typography.Text>
          <Typography.Text style={{ fontSize: 14 }}>
            ✔ Free drinks, upgrades & perks
          </Typography.Text>
          <Typography.Text style={{ fontSize: 14 }}>
            ✔ Instant access via QR pass
          </Typography.Text>
        </div>

        <div
          style={{ marginTop: 18, display: "flex", flexDirection: "column" }}
        >
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "var(--pass-primary)",
                colorPrimaryHover: "var(--pass-primary-hover)",
                colorPrimaryActive: "var(--pass-primary-active)",
              },
            }}
          >
            <a
              href="https://pass.ahangama.com"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-block", width: "fit-content" }}
            >
              <Button
                type="primary"
                size="large"
                style={{
                  height: 46,
                  padding: "0 20px",
                  borderRadius: 14,
                  fontWeight: 700,
                  boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                  transition: "transform 140ms ease, box-shadow 140ms ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 26px rgba(0,0,0,0.14)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 22px rgba(0,0,0,0.12)";
                }}
              >
                Get Your Pass
              </Button>
            </a>
          </ConfigProvider>

          <Typography.Text
            type="secondary"
            style={{ marginTop: 10, fontSize: 12 }}
          >
            Used by 2,000+ travellers this season
          </Typography.Text>
        </div>
      </div>
      <div
        style={{
          flex: "0 0 420px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {image ? (
          <img
            src={image}
            alt="Hero"
            style={{
              width: "100%",
              height: 240,
              objectFit: "cover",
              borderRadius: 16,
              display: "block",
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
