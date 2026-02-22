import { Button, ConfigProvider } from "antd";

export function GetPassStickyCta() {
  const barHeight = 64;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        background: "var(--venue-card-bg)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: barHeight,
        }}
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
          <a href="https://pass.ahangama.com" style={{ width: "50vw" }}>
            <Button type="primary" size="large" block>
              Get Pass
            </Button>
          </a>
        </ConfigProvider>
      </div>
    </div>
  );
}
