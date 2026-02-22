type Props = {
  href?: string;
  label?: string;
  className?: string;
};

export function GetPassBarMobile({
  href = "https://pass.ahangama.com",
  label = "Get Your Pass",
  className = "ahg-floating-getpass-btn",
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        width: "100%",
        background: "#2F3E3A",
        borderRadius: "18px 18px 0 0",
        overflow: "hidden",
        boxShadow: "0 -2px 16px rgba(79,111,134,0.10)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{
          display: "block",
          width: "100%",
          background: "transparent",
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: 20,
          padding: "18px 0 16px 0",
          textAlign: "center",
          textDecoration: "none",
          letterSpacing: 0.5,
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      >
        {label}
      </a>
    </div>
  );
}
