import { Button, ConfigProvider, Layout } from "antd";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { GetPassStickyCta } from "../components/GetPassStickyCta";
import { useIsMobile } from "../hooks/useIsMobile";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isHomeRoute =
    location.pathname === "/" || location.pathname.startsWith("/destinations/");
  const shouldShowGlobalStickyCta = !(isMobile && isHomeRoute);

  const contentPadding = isMobile ? 0 : 24;
  const stickyCtaInset = shouldShowGlobalStickyCta ? 88 : 0;
  const contentPaddingBottom = (isMobile ? 0 : 24) + stickyCtaInset;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1001,
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ color: "rgba(0,0,0,0.88)", fontWeight: 700 }}>
          Ahangama
        </div>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "var(--pass-primary)",
              colorPrimaryHover: "var(--pass-primary-hover)",
              colorPrimaryActive: "var(--pass-primary-active)",
            },
          }}
        >
          <a href="https://pass.ahangama.com" target="_blank" rel="noreferrer">
            <Button type="primary">Get Pass</Button>
          </a>
        </ConfigProvider>
      </Layout.Header>

      <Layout.Content
        style={{ padding: contentPadding, paddingBottom: contentPaddingBottom }}
      >
        {children}
      </Layout.Content>

      {shouldShowGlobalStickyCta ? <GetPassStickyCta /> : null}
    </Layout>
  );
}
