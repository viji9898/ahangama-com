import { Card, Space, Typography } from "antd";
import { PartnerSignupForm } from "../../components/partners/PartnerSignupForm";

export default function PartnersMobile() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          Partner sign up
        </Typography.Title>
        <Typography.Text type="secondary">
          Apply to become an Ahangama Pass partner.
        </Typography.Text>
      </Space>

      <Card style={{ marginTop: 16 }}>
        <PartnerSignupForm />
      </Card>
    </div>
  );
}
