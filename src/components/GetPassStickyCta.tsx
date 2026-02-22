export function GetPassStickyCta() {
  return (
    <div className="ahg-sticky-cta-bar">
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          minHeight: "var(--ahg-mobile-cta-height)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minWidth: 0,
            maxWidth: "min(560px, 70vw)",
            fontWeight: 800,
            fontSize: 16,
            lineHeight: "20px",
            color: "#2F3E3A",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
          }}
        >
          Ahangama Pass — From $18
        </div>

        <a
          href="https://pass.ahangama.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ahg-mobile-cta-button"
        >
          Get Pass
        </a>
      </div>
    </div>
  );
}
