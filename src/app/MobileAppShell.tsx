import { ConfigProvider, Layout } from "antd";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function MobileAppShell({ children }: Props) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--pass-primary)",
          colorPrimaryHover: "var(--pass-primary-hover)",
          colorPrimaryActive: "var(--pass-primary-active)",
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          // Used by page-level sticky UI to offset below the global header.
          // Mobile shell has no header, so this is 0.
          ["--app-shell-header-height" as any]: "0px",
        }}
      >
        <Layout.Content style={{ padding: 0, paddingBottom: 0 }}>
          {children}
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
