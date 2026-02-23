import { Card } from "antd";

type BreakdownItem = {
  icon: string;
  title: string;
  detail: string;
  saved: string;
};

function SavingsBreakdownCard({ icon, title, detail, saved }: BreakdownItem) {
  return (
    <Card
      size="small"
      style={{
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.82)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
      }}
      styles={{ body: { padding: 12 } }}
    >
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background:
              "color-mix(in srgb, var(--pass-primary) 10%, rgba(0,0,0,0.03))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              lineHeight: "16px",
              color: "#2F3E3A",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 12,
              opacity: 0.78,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {detail}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 13,
              fontWeight: 900,
              color: "var(--pass-primary)",
              letterSpacing: 0.1,
            }}
          >
            {saved}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SavingsBreakdownMobile() {
  const items: BreakdownItem[] = [
    { icon: "☕", title: "Cafés", detail: "5 visits", saved: "$18 saved" },
    { icon: "🌊", title: "Surf", detail: "2 rentals", saved: "$12 saved" },
    {
      icon: "🧘",
      title: "Wellness",
      detail: "1 session",
      saved: "$20 saved",
    },
    { icon: "🛏", title: "Stays", detail: "2 nights", saved: "$35 saved" },
  ];

  return (
    <section
      aria-label="How much you can save"
      style={{
        width: "100%",
        margin: "16px 0 18px",
        padding: "14px 16px",
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(250,248,245,0.92))",
        boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: -0.1,
            }}
          >
            You could save $85 in 14 days
          </div>
          <div
            style={{
              fontSize: 13,
              opacity: 0.85,
              marginTop: 6,
              lineHeight: 1.35,
            }}
          >
            Most visitors recover the cost of the pass in{" "}
            <strong>3–4 uses</strong>.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {items.map((item) => (
            <SavingsBreakdownCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
