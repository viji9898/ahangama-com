import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
  message,
  theme,
} from "antd";
import {
  InstagramOutlined,
  LineChartOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PartnerTrustBar } from "./PartnerTrustBar";

const VENUE_TYPE_OPTIONS = [
  "Food & Beverage",
  "Accommodation",
  "Wellness",
  "Surf",
  "Retail",
  "Coworking",
  "Transport",
  "Retail",
  "Laundry",
  "Experiences / Tours",
  "Other",
] as const;

const LOCATION_OPTIONS = ["Ahangama", "Kabalana", "Midigama", "Other"] as const;

const OFFER_PRESETS = [
  { label: "10% Off", description: "10% off total bill" },
  { label: "15% Off", description: "15% off total bill" },
  { label: "Buy 1 Get 1", description: "Buy 1 get 1 free" },
  { label: "Free Welcome Drink", description: "Free welcome drink" },
  {
    label: "Late Checkout",
    description: "Late checkout (subject to availability)",
  },
  { label: "Free Dessert", description: "Free dessert" },
  { label: "Complimentary Item", description: "Complimentary item" },
  { label: "Upgrade", description: "Room upgrade (subject to availability)" },
] as const;

function VenueTypePills({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange?: (nextValue: string[]) => void;
}) {
  const { token } = theme.useToken();

  return (
    <Space size={[10, 10]} wrap>
      {VENUE_TYPE_OPTIONS.map((option) => {
        const selected = value.includes(option);

        return (
          <Tag.CheckableTag
            key={option}
            checked={selected}
            onChange={(checked) => {
              const nextValue = checked
                ? Array.from(new Set([...value, option]))
                : value.filter((v) => v !== option);
              onChange?.(nextValue);
            }}
            style={{
              border: `1px solid ${
                selected ? "var(--pass-primary)" : token.colorBorderSecondary
              }`,
              background: selected
                ? "color-mix(in srgb, var(--pass-primary) 10%, #ffffff)"
                : token.colorBgContainer,
              color: selected ? "var(--pass-primary)" : token.colorText,
              borderRadius: 999,
              padding: "6px 12px",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
              marginInlineEnd: 0,
            }}
          >
            {option}
          </Tag.CheckableTag>
        );
      })}
    </Space>
  );
}

function LocationPills({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (nextValue?: string) => void;
}) {
  const { token } = theme.useToken();

  return (
    <Space size={[10, 10]} wrap>
      {LOCATION_OPTIONS.map((option) => {
        const selected = value === option;

        return (
          <Tag.CheckableTag
            key={option}
            checked={selected}
            onChange={(checked) => {
              onChange?.(checked ? option : undefined);
            }}
            style={{
              border: `1px solid ${
                selected ? "var(--pass-primary)" : token.colorBorderSecondary
              }`,
              background: selected
                ? "color-mix(in srgb, var(--pass-primary) 10%, #ffffff)"
                : token.colorBgContainer,
              color: selected ? "var(--pass-primary)" : token.colorText,
              borderRadius: 999,
              padding: "6px 12px",
              fontWeight: 600,
              cursor: "pointer",
              userSelect: "none",
              marginInlineEnd: 0,
            }}
          >
            {option}
          </Tag.CheckableTag>
        );
      })}
    </Space>
  );
}

export function PartnerSignupForm() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedOfferPresets, setSelectedOfferPresets] = useState<string[]>(
    [],
  );
  const [activePanelKeys, setActivePanelKeys] = useState<string[]>(["venue"]);
  const [visitedPanelKeys, setVisitedPanelKeys] = useState<string[]>(["venue"]);
  const [api, contextHolder] = message.useMessage();
  const selectedLocation = Form.useWatch("location", form);

  const venueName = Form.useWatch("venueName", form);
  const otherLocation = Form.useWatch("otherLocation", form);
  const venueType = Form.useWatch("venueType", form);
  const contactName = Form.useWatch("contactName", form);
  const contactRole = Form.useWatch("contactRole", form);
  const email = Form.useWatch("email", form);
  const phone = Form.useWatch("phone", form);

  const offerDescription = Form.useWatch("offerDescription", form);
  const offerAppliesTo = Form.useWatch("offerAppliesTo", form);

  const agreeToTerms = Form.useWatch("agreeToTerms", form);

  const venueComplete =
    typeof venueName === "string" &&
    venueName.trim().length > 0 &&
    typeof selectedLocation === "string" &&
    selectedLocation.length > 0 &&
    (selectedLocation !== "Other" ||
      (typeof otherLocation === "string" && otherLocation.trim().length > 0)) &&
    Array.isArray(venueType) &&
    venueType.length > 0 &&
    typeof contactName === "string" &&
    contactName.trim().length > 0 &&
    typeof contactRole === "string" &&
    contactRole.trim().length > 0 &&
    typeof email === "string" &&
    email.trim().length > 0 &&
    typeof phone === "string" &&
    phone.trim().length > 0;

  const offerComplete =
    typeof offerDescription === "string" &&
    offerDescription.trim().length > 0 &&
    Array.isArray(offerAppliesTo) &&
    offerAppliesTo.length > 0;

  const operationsComplete =
    visitedPanelKeys.includes("redemption") &&
    visitedPanelKeys.includes("marketing");

  const termsComplete = Boolean(agreeToTerms);

  const currentStep = !venueComplete
    ? 0
    : !offerComplete
      ? 1
      : !operationsComplete
        ? 2
        : !termsComplete
          ? 3
          : 3;

  async function handleSubmit(values: any) {
    setLoading(true);
    try {
      const payload = {
        ...values,
        location:
          values?.location === "Other" && values?.otherLocation
            ? values.otherLocation
            : values?.location,
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

            <PartnerTrustBar />
          </div>
        </Card>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
          >
            <div style={{ marginBottom: 16 }}>
              <Typography.Text type="secondary">
                Step {currentStep + 1} of 4
              </Typography.Text>
              <Steps
                size="small"
                current={currentStep}
                items={[
                  {
                    title: "Venue",
                    status: venueComplete ? "finish" : "process",
                  },
                  {
                    title: "Offer",
                    status: offerComplete
                      ? "finish"
                      : currentStep > 1
                        ? "finish"
                        : currentStep === 1
                          ? "process"
                          : "wait",
                  },
                  {
                    title: "Operations",
                    status: operationsComplete
                      ? "finish"
                      : currentStep === 2
                        ? "process"
                        : currentStep > 2
                          ? "finish"
                          : "wait",
                  },
                  {
                    title: "Terms",
                    status: termsComplete
                      ? "finish"
                      : currentStep === 3
                        ? "process"
                        : "wait",
                  },
                ]}
              />
            </div>

            <Collapse
              activeKey={activePanelKeys}
              onChange={(keys) => {
                const next = Array.isArray(keys)
                  ? (keys as string[])
                  : [keys as string];

                setActivePanelKeys(next);
                setVisitedPanelKeys((prev) =>
                  Array.from(new Set([...prev, ...next])),
                );
              }}
              items={[
                {
                  key: "venue",
                  label: "Venue Details",
                  children: (
                    <>
                      <Form.Item
                        label="Venue Name"
                        name="venueName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter venue name",
                          },
                        ]}
                      >
                        <Input placeholder="Enter venue name" />
                      </Form.Item>

                      <Form.Item
                        label="Location / Area"
                        name="location"
                        rules={[
                          { required: true, message: "Please select location" },
                        ]}
                      >
                        <LocationPills />
                      </Form.Item>

                      {selectedLocation === "Other" ? (
                        <Form.Item
                          label="Other Location / Area"
                          name="otherLocation"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your location",
                            },
                          ]}
                        >
                          <Input placeholder="Enter location / area" />
                        </Form.Item>
                      ) : null}

                      <Form.Item
                        label="Venue Type"
                        name="venueType"
                        rules={[
                          {
                            validator: (_, value) =>
                              Array.isArray(value) && value.length > 0
                                ? Promise.resolve()
                                : Promise.reject(
                                    new Error(
                                      "Please select at least one venue type",
                                    ),
                                  ),
                          },
                        ]}
                      >
                        <VenueTypePills />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Contact Name"
                            name="contactName"
                            rules={[
                              {
                                required: true,
                                message: "Please enter contact name",
                              },
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
                              {
                                required: true,
                                message: "Please enter role/position",
                              },
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
                              {
                                required: true,
                                message: "Please enter email address",
                              },
                              {
                                type: "email",
                                message: "Please enter valid email",
                              },
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
                              {
                                required: true,
                                message: "Please enter phone number",
                              },
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
                    </>
                  ),
                },
                {
                  key: "offer",
                  label: "Offer",
                  children: (
                    <>
                      <div style={{ marginTop: -6, marginBottom: 14 }}>
                        <Typography.Text strong>Quick presets</Typography.Text>
                        <div style={{ marginTop: 10 }}>
                          <Space size={[8, 8]} wrap>
                            {OFFER_PRESETS.map((preset) => {
                              const selected = selectedOfferPresets.includes(
                                preset.label,
                              );

                              return (
                                <Button
                                  key={preset.label}
                                  size="small"
                                  shape="round"
                                  onClick={() => {
                                    const nextSelected = selected
                                      ? selectedOfferPresets.filter(
                                          (v) => v !== preset.label,
                                        )
                                      : Array.from(
                                          new Set([
                                            ...selectedOfferPresets,
                                            preset.label,
                                          ]),
                                        );

                                    setSelectedOfferPresets(nextSelected);

                                    if (nextSelected.length > 0) {
                                      const nextDescription = nextSelected
                                        .map(
                                          (label) =>
                                            OFFER_PRESETS.find(
                                              (p) => p.label === label,
                                            )?.description,
                                        )
                                        .filter(Boolean)
                                        .join(", ");

                                      form.setFieldsValue({
                                        offerDescription: nextDescription,
                                      });
                                    }
                                  }}
                                  style={{
                                    borderColor: selected
                                      ? "var(--pass-primary)"
                                      : token.colorBorderSecondary,
                                    background: selected
                                      ? "var(--pass-primary)"
                                      : token.colorBgContainer,
                                    color: selected
                                      ? "#ffffff"
                                      : token.colorText,
                                    fontWeight: 600,
                                    height: 28,
                                    paddingInline: 12,
                                    fontSize: 13,
                                  }}
                                >
                                  {preset.label}
                                </Button>
                              );
                            })}
                          </Space>
                        </div>
                      </div>

                      <Form.Item
                        label="Describe the offer clearly (shown to customers)"
                        name="offerDescription"
                        rules={[
                          {
                            required: true,
                            message: "Please describe your offer",
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={3}
                          onChange={(event) => {
                            if (selectedOfferPresets.length === 0) return;

                            const generated = selectedOfferPresets
                              .map(
                                (label) =>
                                  OFFER_PRESETS.find((p) => p.label === label)
                                    ?.description,
                              )
                              .filter(Boolean)
                              .join(", ");

                            if (generated && event.target.value !== generated) {
                              setSelectedOfferPresets([]);
                            }
                          }}
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
                            <Checkbox value="food-beverage">
                              Food & Beverage
                            </Checkbox>
                            <Checkbox value="accommodation">
                              Direct accommodation bookings
                            </Checkbox>
                            <Checkbox value="experiences">
                              Experiences / Retail
                            </Checkbox>
                          </Space>
                        </Checkbox.Group>
                      </Form.Item>

                      <Card
                        size="small"
                        style={{
                          marginBottom: 0,
                          border: `1px solid ${token.colorBorderSecondary}`,
                          background:
                            "color-mix(in srgb, var(--pass-primary) 4%, #ffffff)",
                        }}
                      >
                        <Space size={8} align="center">
                          <LineChartOutlined
                            style={{ color: "var(--pass-primary)" }}
                          />
                          <Typography.Text strong>
                            💡 ROI highlight:
                          </Typography.Text>
                        </Space>

                        <Typography.Paragraph
                          style={{ marginTop: 10, marginBottom: 0 }}
                        >
                          <Space direction="vertical" size={6}>
                            <Typography.Text>
                              <TeamOutlined style={{ marginRight: 8 }} />
                              👥 If just <strong>2</strong> pass holders visit
                              per day and spend{" "}
                              <DollarCircleOutlined
                                style={{ marginRight: 6 }}
                              />
                              💵 <strong>$15</strong> each,
                            </Typography.Text>
                            <Typography.Text>
                              that&apos;s <strong>$900/month</strong> 📈 in
                              additional revenue.
                            </Typography.Text>
                          </Space>
                        </Typography.Paragraph>
                      </Card>
                    </>
                  ),
                },
                {
                  key: "redemption",
                  label: "Redemption",
                  children: (
                    <div
                      style={{
                        background: token.colorFillTertiary,
                        padding: 18,
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
                          Guests present their digital pass (on phone or
                          printed) when ordering or checking in
                        </li>
                        <li>
                          <Typography.Text strong>
                            Mention when booking directly:
                          </Typography.Text>{" "}
                          Guests can mention "Ahangama Pass" when making
                          reservations by phone or in person
                        </li>
                        <li>
                          <Typography.Text strong>
                            QR code verification:
                          </Typography.Text>{" "}
                          Staff can scan the guest's pass QR code to verify and
                          log the redemption
                        </li>
                        <li>
                          <Typography.Text strong>
                            Staff verification:
                          </Typography.Text>{" "}
                          Your team can manually verify the pass and note the
                          redemption
                        </li>
                      </ul>

                      <Typography.Paragraph style={{ marginBottom: 0 }}>
                        The redemption process is designed to be simple and
                        flexible for both your staff and guests. You choose what
                        works best for your venue operations.
                      </Typography.Paragraph>
                    </div>
                  ),
                },
                {
                  key: "marketing",
                  label: "Marketing",
                  children: (
                    <>
                      <Typography.Paragraph style={{ marginTop: 0 }}>
                        <Typography.Text strong>
                          We keep all branding minimal and respectful of your
                          venue's aesthetic.
                        </Typography.Text>
                      </Typography.Paragraph>

                      <Typography.Paragraph>
                        The venue agrees to display small, tasteful Ahangama
                        Pass branding, such as:
                      </Typography.Paragraph>

                      <ul>
                        <li>A small sticker at the counter or entrance</li>
                        <li>A QR card at the cashier or reception</li>
                        <li>A digital mention where appropriate</li>
                      </ul>

                      <Form.Item
                        label="Additional Marketing Notes"
                        name="marketingNotes"
                      >
                        <Input.TextArea
                          rows={2}
                          placeholder="Any specific preferences for branding or marketing materials"
                        />
                      </Form.Item>
                    </>
                  ),
                },
                {
                  key: "terms",
                  label: "Terms",
                  children: (
                    <>
                      <div
                        style={{
                          background: token.colorFillTertiary,
                          padding: 18,
                          marginBottom: 16,
                          borderRadius: token.borderRadiusLG,
                        }}
                      >
                        <ul style={{ lineHeight: 1.8, marginBottom: 0 }}>
                          <li>No fees or commissions</li>
                          <li>Non-exclusive partnership</li>
                          <li>
                            Offers must be honoured when the Ahangama Pass is
                            presented before payment
                          </li>
                          <li>
                            Accommodation offers apply to direct bookings only
                          </li>
                          <li>
                            Either party may terminate with 30 days written
                            notice
                          </li>
                          <li>No penalties or obligations upon termination</li>
                          <li>Minimal branding required</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background: token.colorInfoBg,
                          border: `1px solid ${token.colorInfoBorder}`,
                          padding: 14,
                          borderRadius: token.borderRadiusLG,
                          marginBottom: 14,
                        }}
                      >
                        <Typography.Text
                          strong
                          style={{ color: token.colorPrimary }}
                        >
                          By submitting this form, you confirm you’re authorized
                          to represent this venue, agree to the Ahangama Pass
                          Partner Terms, and your venue will go live as an
                          Ahangama Pass partner.
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
                            I confirm that I am authorized to represent this
                            venue and agree to the Ahangama Pass Partner Terms.
                            By submitting this form, my venue will go live as an
                            Ahangama Pass partner.
                          </strong>
                        </Checkbox>
                      </Form.Item>

                      <Form.Item
                        name="agreeToMarketing"
                        valuePropName="checked"
                      >
                        <Checkbox>
                          I'd like to receive updates, insights, and
                          opportunities from Ahangama Pass.
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
                    </>
                  ),
                },
              ]}
            />
          </Form>
        </Card>
      </Space>
    </>
  );
}
