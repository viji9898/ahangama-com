import { Typography } from "antd";

const { Text } = Typography;

type Props = {
  usedCountText?: string;
  ratingText?: string;
};

export function SocialProofMobile({
  usedCountText = "Used by 2,000+ visitors in Ahangama",
  ratingText = "★★★★★ 4.8 average partner ratings",
}: Props) {
  return (
    <section aria-label="Social proof">
      <div style={{ padding: "0 8px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.72)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 16,
            padding: "14px 14px",
            textAlign: "center",
            boxShadow: "0 10px 26px rgba(0,0,0,0.04)",
          }}
        >
          <Text
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 900,
              lineHeight: 1.25,
              color: "rgba(0,0,0,0.88)",
            }}
          >
            {usedCountText}
          </Text>
          <Text
            style={{
              display: "block",
              marginTop: 6,
              fontSize: 13,
              fontWeight: 800,
              lineHeight: 1.25,
              color: "rgba(0,0,0,0.62)",
            }}
          >
            {ratingText}
          </Text>
        </div>
      </div>
    </section>
  );
}
