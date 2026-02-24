import { Link } from "react-router-dom";
import { Button, Card, Result, Space, Typography, theme } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function PartnerSignupSuccessPage() {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" }}>
      <Result
        status="success"
        title={
          <Title
            level={2}
            style={{ color: token.colorSuccess, marginBottom: 0 }}
          >
            🎉 Welcome to the Ahangama Pass Partner Network!
          </Title>
        }
        subTitle={
          <div style={{ marginTop: 24 }}>
            <Paragraph style={{ fontSize: 16, marginBottom: 24 }}>
              Thank you for joining our partner program! Your venue is now{" "}
              <strong>live as an Ahangama Pass partner</strong>.
            </Paragraph>
          </div>
        }
        extra={[
          <Link key="home" to="/">
            <Button type="primary" size="large" icon={<HomeOutlined />}>
              Back to Home
            </Button>
          </Link>,
          <Link key="partners" to="/partners">
            <Button size="large">View All Partners</Button>
          </Link>,
        ]}
      />

      <div style={{ marginTop: 40 }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Title level={4}>
                <CheckCircleOutlined
                  style={{ color: token.colorSuccess, marginRight: 8 }}
                />
                What's Next?
              </Title>
              <Paragraph>
                You'll receive a confirmation email with detailed partnership
                terms and information about how guests will redeem offers at
                your venue.
              </Paragraph>
            </div>

            <div>
              <Title level={4}>
                <MailOutlined
                  style={{ color: token.colorInfo, marginRight: 8 }}
                />
                Confirmation Email Sent
              </Title>
              <Paragraph>
                We've sent partnership details and terms to your email address.
                Please check your inbox (and spam folder) for important
                information.
              </Paragraph>
            </div>

            <div>
              <Title level={4}>
                <WhatsAppOutlined
                  style={{ color: token.colorSuccess, marginRight: 8 }}
                />
                Partner Support
              </Title>
              <Paragraph>
                Need help or have questions? Our partner support team is ready
                to assist:
              </Paragraph>
              <div
                style={{
                  background: token.colorInfoBg,
                  padding: 16,
                  borderRadius: token.borderRadiusLG,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Text strong style={{ fontSize: 16 }}>
                  📱 WhatsApp: +94 77 790 8790
                </Text>
                <br />
                <Text type="secondary">
                  Available for offer updates, marketing materials, staff
                  guidance, and any questions
                </Text>
              </div>
            </div>

            <div>
              <Title level={4}>Venue Visibility</Title>
              <Paragraph>
                Your venue will be featured across <strong>Ahangama.com</strong>
                and our visitor touchpoints, giving you increased visibility
                among local and international travelers.
              </Paragraph>
            </div>

            <div
              style={{
                background: token.colorWarningBg,
                padding: 20,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorWarningBorder}`,
                textAlign: "center",
              }}
            >
              <Title
                level={4}
                style={{ color: token.colorWarning, marginBottom: 12 }}
              >
                🌟 Thank You for Supporting Local Ahangama
              </Title>
              <Text>
                We're excited to drive thoughtful, high-quality visitors your
                way and build something valuable for Ahangama together.
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
