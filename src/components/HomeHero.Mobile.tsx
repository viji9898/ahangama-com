import { Button, Typography } from "antd";

const { Title, Text } = Typography;

type Props = {
  imageUrl: string;
  passUrl?: string;
  onSeeAllOffers?: () => void;
};

export function HomeHeroMobile({
  imageUrl,
  passUrl = "https://pass.ahangama.com",
  onSeeAllOffers,
}: Props) {
  return (
    <section aria-label="Ahangama Pass hero">
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          minHeight: 120,
          height: 165,
          zIndex: 1,
          background: `url('${imageUrl}') center center/cover no-repeat`,
        }}
      />

      <div style={{ padding: "14px 16px 12px" }}>
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
          Save at 100+ venues across Ahangama
        </Title>

        <Text
          style={{
            display: "block",
            marginTop: 10,
            fontSize: 14,
            lineHeight: 1.4,
            opacity: 0.82,
            color: "#1E1E1E",
          }}
        >
          One Pass. Instant perks. Cafés, surf, wellness & stays.
        </Text>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <Button
            block
            size="large"
            href={passUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: 46,
              borderRadius: 12,
              fontWeight: 900,
              background: "#111",
              borderColor: "#111",
              color: "#fff",
            }}
          >
            Get the Ahangama Pass
          </Button>

          <Button
            block
            size="large"
            type="default"
            onClick={onSeeAllOffers}
            style={{
              height: 46,
              borderRadius: 12,
              fontWeight: 900,
              background: "transparent",
              borderColor: "rgba(0,0,0,0.18)",
              color: "#111",
            }}
          >
            See All Offers
          </Button>
        </div>

        <div
          aria-label="Trust indicators"
          style={{
            marginTop: 12,
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.72)",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.88 }}>
            ⭐ 4.7 avg partner rating
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.88 }}>
            🏝 100+ venues
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.88 }}>
            💳 Works instantly
          </div>
        </div>
      </div>
    </section>
  );
}
