import {
  Button,
  ConfigProvider,
  Layout,
  Modal,
  QRCode,
  Space,
  Typography,
  theme,
} from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GetPassStickyCta } from "../components/GetPassStickyCta";
import { useIsMobile } from "../hooks/useIsMobile";

type Props = {
  children: ReactNode;
};

export function AppShell({ children }: Props) {
  const { token } = theme.useToken();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [helpOpen, setHelpOpen] = useState(false);

  const headerHeightPx = 64;

  const whatsappUrl = useMemo(() => {
    const phone = "94777908790";
    const text = encodeURIComponent("Hi, I need help with the Ahangama Pass.");
    return `https://wa.me/${phone}?text=${text}`;
  }, []);

  function handleHelpClick() {
    if (isMobile) {
      window.location.href = whatsappUrl;
      return;
    }

    setHelpOpen(true);
  }

  const isHomeRoute =
    location.pathname === "/" || location.pathname.startsWith("/destinations/");
  const shouldShowGlobalStickyCta = !(isMobile && isHomeRoute);

  const contentPadding = isMobile ? 0 : 24;
  const stickyCtaInset = shouldShowGlobalStickyCta ? 88 : 0;
  const contentPaddingBottom = (isMobile ? 0 : 24) + stickyCtaInset;

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
          ["--app-shell-header-height" as any]: `${headerHeightPx}px`,
        }}
      >
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
          <Link
            to="/"
            style={{
              color: "rgba(0,0,0,0.88)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Ahangama
          </Link>

          <Space size={10} align="center">
            <Button icon={<WhatsAppOutlined />} onClick={handleHelpClick}>
              Need help?
            </Button>
          </Space>
        </Layout.Header>

        <Layout.Content
          style={{
            padding: contentPadding,
            paddingBottom: contentPaddingBottom,
          }}
        >
          {children}
        </Layout.Content>

        {shouldShowGlobalStickyCta ? <GetPassStickyCta /> : null}
        <Modal
          open={helpOpen}
          onCancel={() => setHelpOpen(false)}
          footer={null}
          centered
          title="Need help?"
        >
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <Typography.Text type="secondary">
              Scan the QR code to message us on WhatsApp, or click the button
              below.
            </Typography.Text>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: 12,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorFillAlter,
              }}
            >
              <QRCode value={whatsappUrl} />
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button type="primary" block>
                Message on WhatsApp
              </Button>
            </a>
          </Space>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
}
