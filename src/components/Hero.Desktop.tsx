import { Typography } from "antd";

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
          style={{ margin: 0, fontSize: 36, lineHeight: 1.15 }}
        >
          Save at 100+ venues across Ahangama.
        </Typography.Title>

        <Typography.Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
          With the Ahangama Pass.
        </Typography.Title>
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
