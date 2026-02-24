import { Card, Col, Row, Space, Typography } from "antd";
import { PartnerSignupForm } from "../../components/partners/PartnerSignupForm";

export default function PartnersDesktop() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Partner sign up
        </Typography.Title>
        <Typography.Text type="secondary">
          Apply to become an Ahangama Pass partner.
        </Typography.Text>
      </Space>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="What happens next">
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
                Once you submit, our team receives your details and you’ll get a
                confirmation email.
              </Typography.Paragraph>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                Please include an offer description if you have one — we can
                always refine it together.
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Partner application">
            <PartnerSignupForm />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
