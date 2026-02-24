import { Button, Layout, Modal, QRCode, Space, Typography, theme } from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";

type Props = {
  children: ReactNode;
};

export function PartnerSignupShell({ children }: Props) {
  const { token } = theme.useToken();
  const isMobile = useIsMobile();
  const [helpOpen, setHelpOpen] = useState(false);

  const whatsappUrl = useMemo(() => {
    const phone = "94777908790";
    const text = encodeURIComponent("Hi, I need with the partner sgn up form.");
    return `https://wa.me/${phone}?text=${text}`;
  }, []);

  function handleHelpClick() {
    if (isMobile) {
      window.location.href = whatsappUrl;
      return;
    }

    setHelpOpen(true);
  }

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
        <Space size={10} align="center">
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
          {!isMobile ? (
            <Typography.Text type="secondary">Partner sign-up</Typography.Text>
          ) : null}
        </Space>

        <Space size={10} align="center">
          <Button icon={<WhatsAppOutlined />} onClick={handleHelpClick}>
            Need help?
          </Button>
        </Space>
      </Layout.Header>

      <Layout.Content style={{ padding: 0 }}>{children}</Layout.Content>

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
  );
}
