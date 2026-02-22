type ExampleCardProps = {
  title: string;
  detail: string;
  saved: string;
};

function ExampleCard({ title, detail, saved }: ExampleCardProps) {
  return (
    <div
      style={{
        padding: "10px 10px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.85)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 12,
          opacity: 0.75,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {detail}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800 }}>{saved}</div>
    </div>
  );
}

export function SavingsSummary() {
  return (
    <section
      aria-label="Savings summary"
      className="ahg-savings-summary"
      style={{
        width: "100%",
        margin: "16px 0 18px",
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,248,245,0.95))",
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
            How Much Can You Save?
          </div>
          <div
            style={{
              fontSize: 13,
              opacity: 0.8,
              marginTop: 4,
              lineHeight: 1.35,
            }}
          >
            Most visitors save between <strong>$45–$120</strong> during a 2-week
            stay.
          </div>
        </div>

        <div
          className="ahg-savings-summary-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          <ExampleCard title="Cafés" detail="5 café visits" saved="$18 saved" />
          <ExampleCard title="Surf" detail="2 surf rentals" saved="$12 saved" />
          <ExampleCard
            title="Wellness"
            detail="1 spa session"
            saved="$20 saved"
          />
        </div>
      </div>
    </section>
  );
}
