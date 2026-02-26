import { ConfigProvider, Layout } from "antd";
import { PassLanding } from "../components/pass/PassLanding";

export default function PassLandingPage() {
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
      <Layout style={{ minHeight: "100vh", background: "transparent" }}>
        <Layout.Content style={{ padding: 0 }}>
          <PassLanding />
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
}
