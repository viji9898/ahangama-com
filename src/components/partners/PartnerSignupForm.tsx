import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
  theme,
} from "antd";
import {
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function PartnerSignupForm() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [venueType, setVenueType] = useState<string[]>([]);
  const [api, contextHolder] = message.useMessage();

  async function handleSubmit(values: any) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        venueType: Array.isArray(values?.venueType)
          ? values.venueType.join(", ")
          : values?.venueType,
      };

      const res = await fetch("/.netlify/functions/send-partner-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/partner-signup/success");
      } else {
        throw new Error("Failed to submit application");
      }
    } catch {
      api.error(
        "Unable to complete sign-up. Please try again or contact us at hello@ahangama.com",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card
          style={{
            background: token.colorFillAlter,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={1} style={{ marginBottom: 8 }}>
              Join 100+ Venues Growing With Ahangama Pass
            </Typography.Title>
            <Typography.Paragraph style={{ marginTop: 0, marginBottom: 16 }}>
              <Typography.Text type="secondary" style={{ fontSize: 16 }}>
                Zero commission. Free marketing. Verified pass holders sent to
                your venue.
              </Typography.Text>
            </Typography.Paragraph>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Space
                size={[16, 8]}
                wrap
                style={{ justifyContent: "center" }}
              >
                <Typography.Text strong>✔ 100+ venues live</Typography.Text>
                <Typography.Text strong>
                  ✔ 1,000+ active pass holders
                </Typography.Text>
                <Typography.Text strong>✔ 0% commission model</Typography.Text>
                <Typography.Text strong>
                  ✔ Featured on Ahangama.com
                </Typography.Text>
              </Space>
            </div>
          </div>
        </Card>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
          <Divider titlePlacement="start">1. Venue Details</Divider>

          <Form.Item
            label="Venue Name"
            name="venueName"
            rules={[{ required: true, message: "Please enter venue name" }]}
          >
            <Input placeholder="Enter venue name" />
          </Form.Item>

          <Form.Item
            label="Location / Area"
            name="location"
            rules={[{ required: true, message: "Please select location" }]}
          >
            <Input placeholder="e.g., Ahangama, Kabalana, Midigama" />
          </Form.Item>

          <Form.Item
            label="Venue Type"
            name="venueType"
            rules={[
              {
                required: true,
                message: "Please select at least one venue type",
              },
            ]}
          >
            <Checkbox.Group
              onChange={(checked) => setVenueType(checked as string[])}
            >
              <Space direction="vertical">
                <Checkbox value="food-beverage">Food & Beverage</Checkbox>
                <Checkbox value="accommodation">
                  Accommodation (Direct Bookings)
                </Checkbox>
                <Checkbox value="experiences">
                  Experiences / Wellness / Retail
                </Checkbox>
                <Checkbox value="other">Other</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          {venueType.includes("other") ? (
            <Form.Item
              label="Other Venue Type (Please Specify)"
              name="otherVenueType"
              rules={[
                {
                  required: true,
                  message: "Please specify other venue type",
                },
              ]}
            >
              <Input placeholder="Please specify..." />
            </Form.Item>
          ) : null}

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Contact Name"
                name="contactName"
                rules={[
                  { required: true, message: "Please enter contact name" },
                ]}
              >
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Role/Position"
                name="contactRole"
                rules={[
                  { required: true, message: "Please enter role/position" },
                ]}
              >
                <Input placeholder="e.g., Manager, Owner" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter email address" },
                  { type: "email", message: "Please enter valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="email@example.com"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone/WhatsApp Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="+94 77 123 4567"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Instagram Handle" name="instagram">
                <Input
                  prefix={<InstagramOutlined />}
                  placeholder="@yourvenue"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Website URL" name="website">
                <Input placeholder="https://yourwebsite.com" />
              </Form.Item>
            </Col>
          </Row>

          <Divider titlePlacement="start">2. Customer Offer</Divider>

          <Form.Item
            label="Offer Type"
            name="offerType"
            rules={[{ required: true, message: "Please select offer type" }]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="percentage">Percentage discount</Checkbox>
                <Checkbox value="fixed">Fixed offer</Checkbox>
                <Checkbox value="complimentary">
                  Complimentary item / upgrade
                </Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            label="Describe the offer clearly (shown to customers)"
            name="offerDescription"
            rules={[{ required: true, message: "Please describe your offer" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="e.g., '10% off total bill', 'Buy 2 get 1 free on mains', 'Complimentary welcome drink'"
            />
          </Form.Item>

          <Form.Item
            label="Offer applies to"
            name="offerAppliesTo"
            rules={[
              {
                required: true,
                message: "Please select what the offer applies to",
              },
            ]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="food-beverage">Food & Beverage</Checkbox>
                <Checkbox value="accommodation">
                  Direct accommodation bookings
                </Checkbox>
                <Checkbox value="experiences">Experiences / Retail</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Divider titlePlacement="start">
            3. How Guests Redeem the Offer
          </Divider>

          <div
            style={{
              background: token.colorFillTertiary,
              padding: 18,
              marginBottom: 20,
              borderRadius: token.borderRadiusLG,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Typography.Paragraph style={{ marginTop: 0 }}>
              <Typography.Text strong>
                Guests can redeem your offer in several ways:
              </Typography.Text>
            </Typography.Paragraph>

            <ul style={{ marginBottom: 16 }}>
              <li>
                <Typography.Text strong>
                  Show Ahangama Pass at venue:
                </Typography.Text>{" "}
                Guests present their digital pass (on phone or printed) when
                ordering or checking in
              </li>
              <li>
                <Typography.Text strong>
                  Mention when booking directly:
                </Typography.Text>{" "}
                Guests can mention "Ahangama Pass" when making reservations by
                phone or in person
              </li>
              <li>
                <Typography.Text strong>QR code verification:</Typography.Text>{" "}
                Staff can scan the guest's pass QR code to verify and log the
                redemption
              </li>
              <li>
                <Typography.Text strong>Staff verification:</Typography.Text>{" "}
                Your team can manually verify the pass and note the redemption
              </li>
            </ul>

            <Typography.Paragraph style={{ marginBottom: 0 }}>
              The redemption process is designed to be simple and flexible for
              both your staff and guests. You choose what works best for your
              venue operations.
            </Typography.Paragraph>
          </div>

          <Divider titlePlacement="start">4. Marketing & Branding</Divider>

          <Typography.Paragraph style={{ marginTop: 0 }}>
            <Typography.Text strong>
              We keep all branding minimal and respectful of your venue's
              aesthetic.
            </Typography.Text>
          </Typography.Paragraph>

          <Typography.Paragraph>
            The venue agrees to display small, tasteful Ahangama Pass branding,
            such as:
          </Typography.Paragraph>

          <ul>
            <li>A small sticker at the counter or entrance</li>
            <li>A QR card at the cashier or reception</li>
            <li>A digital mention where appropriate</li>
          </ul>

          <Form.Item label="Additional Marketing Notes" name="marketingNotes">
            <Input.TextArea
              rows={2}
              placeholder="Any specific preferences for branding or marketing materials"
            />
          </Form.Item>

          <Divider titlePlacement="start">5. Partner Terms (Summary)</Divider>

          <div
            style={{
              background: token.colorFillTertiary,
              padding: 18,
              marginBottom: 20,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <ul style={{ lineHeight: 1.8, marginBottom: 0 }}>
              <li>No fees or commissions</li>
              <li>Non-exclusive partnership</li>
              <li>
                Offers must be honoured when the Ahangama Pass is presented
                before payment
              </li>
              <li>Accommodation offers apply to direct bookings only</li>
              <li>Either party may terminate with 30 days written notice</li>
              <li>No penalties or obligations upon termination</li>
              <li>Minimal branding required</li>
            </ul>
          </div>

          <Divider titlePlacement="start">Confirmation</Divider>

          <div
            style={{
              background: token.colorInfoBg,
              border: `1px solid ${token.colorInfoBorder}`,
              padding: 14,
              borderRadius: token.borderRadiusLG,
              marginBottom: 14,
            }}
          >
            <Typography.Text strong style={{ color: token.colorPrimary }}>
              By submitting this form, you confirm you’re authorized to
              represent this venue, agree to the Ahangama Pass Partner Terms,
              and your venue will go live as an Ahangama Pass partner.
            </Typography.Text>
          </div>

          <Form.Item
            name="agreeToTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Please confirm your authorization and agreement",
                        ),
                      ),
              },
            ]}
          >
            <Checkbox style={{ fontSize: 16 }}>
              <strong>
                I confirm that I am authorized to represent this venue and agree
                to the Ahangama Pass Partner Terms. By submitting this form, my
                venue will go live as an Ahangama Pass partner.
              </strong>
            </Checkbox>
          </Form.Item>

          <Form.Item name="agreeToMarketing" valuePropName="checked">
            <Checkbox>
              I'd like to receive updates, insights, and opportunities from
              Ahangama Pass.
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ textAlign: "center", marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ minWidth: 220, fontSize: 16, height: 50 }}
            >
              Submit & Go Live
            </Button>
          </Form.Item>
        </Form>
        </Card>
      </Space>
    </>
  );
}
