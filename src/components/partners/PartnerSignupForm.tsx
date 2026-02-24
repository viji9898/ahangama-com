import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { type FormEvent, useMemo, useState } from "react";

type VenueType =
  | "Food & Beverage"
  | "Accommodation"
  | "Experience / Wellness"
  | "Retail"
  | "Other";

export function PartnerSignupForm() {
  const [submitting, setSubmitting] = useState(false);
  const [api, contextHolder] = message.useMessage();

  const [venueType, setVenueType] = useState<VenueType | null>(null);
  const [offerType, setOfferType] = useState<string[]>([]);
  const [offerAppliesTo, setOfferAppliesTo] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToMarketing, setAgreeToMarketing] = useState(false);

  const venueTypeOptions = useMemo(
    () =>
      [
        "Food & Beverage",
        "Accommodation",
        "Experience / Wellness",
        "Retail",
        "Other",
      ].map((v) => ({ label: v, value: v })),
    [],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const venueName = String(formData.get("venueName") || "").trim();
    const contactName = String(formData.get("contactName") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!venueName || !contactName || !email) {
      api.error("Please fill the required fields.");
      return;
    }

    if (!agreeToTerms) {
      api.error("Please confirm you agree to the partner terms.");
      return;
    }

    const payload = {
      venueName,
      venueType,
      otherVenueType: String(formData.get("otherVenueType") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      contactName,
      contactRole: String(formData.get("contactRole") || "").trim(),
      email,
      phone: String(formData.get("phone") || "").trim(),
      instagram: String(formData.get("instagram") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      offerType,
      offerDescription: String(formData.get("offerDescription") || "").trim(),
      offerAppliesTo,
      marketingNotes: String(formData.get("marketingNotes") || "").trim(),
      agreeToTerms,
      agreeToMarketing,
    };

    try {
      setSubmitting(true);
      const res = await fetch("/.netlify/functions/send-partner-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const messageText =
          typeof data?.error === "string" && data.error.trim()
            ? data.error.trim()
            : "Submission failed. Please try again.";
        api.error(messageText);
        return;
      }

      api.success("Thanks — your partnership application was submitted.");
      form.reset();
    } catch {
      api.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {contextHolder}
      <form onSubmit={onSubmit}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div>
            <Typography.Text strong>Venue name</Typography.Text>
            <Input name="venueName" placeholder="e.g. Cafe XYZ" required />
          </div>

          <div>
            <Typography.Text strong>Venue type</Typography.Text>
            <Select
              style={{ width: "100%" }}
              placeholder="Select a type"
              options={venueTypeOptions}
              value={venueType ?? undefined}
              onChange={(value) => setVenueType(value as VenueType)}
            />
          </div>

          {venueType === "Other" ? (
            <div>
              <Typography.Text strong>Other venue type</Typography.Text>
              <Input
                name="otherVenueType"
                placeholder="Describe your venue"
                required
              />
            </div>
          ) : (
            <input type="hidden" name="otherVenueType" value="" />
          )}

          <div>
            <Typography.Text strong>Location (optional)</Typography.Text>
            <Input name="location" placeholder="Ahangama / Weligama / etc" />
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <div>
            <Typography.Text strong>Contact name</Typography.Text>
            <Input name="contactName" placeholder="Your name" required />
          </div>

          <div>
            <Typography.Text strong>Role (optional)</Typography.Text>
            <Input name="contactRole" placeholder="Owner / Manager / etc" />
          </div>

          <div>
            <Typography.Text strong>Email</Typography.Text>
            <Input
              name="email"
              placeholder="you@venue.com"
              type="email"
              required
            />
          </div>

          <div>
            <Typography.Text strong>Phone / WhatsApp (optional)</Typography.Text>
            <Input name="phone" placeholder="+94 ..." />
          </div>

          <div>
            <Typography.Text strong>Instagram (optional)</Typography.Text>
            <Input name="instagram" placeholder="@handle or link" />
          </div>

          <div>
            <Typography.Text strong>Website (optional)</Typography.Text>
            <Input name="website" placeholder="https://..." />
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <div>
            <Typography.Text strong>Offer type (optional)</Typography.Text>
            <Checkbox.Group
              value={offerType}
              onChange={(values) => setOfferType(values as string[])}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Checkbox value="Percentage discount">Percentage discount</Checkbox>
                <Checkbox value="Complimentary item">Complimentary item</Checkbox>
                <Checkbox value="Free upgrade">Free upgrade</Checkbox>
                <Checkbox value="Fixed offer">Fixed offer</Checkbox>
              </Space>
            </Checkbox.Group>
          </div>

          <div>
            <Typography.Text strong>Offer description (optional)</Typography.Text>
            <Input.TextArea
              name="offerDescription"
              placeholder="Describe your offer (e.g. 10% off total bill)"
              rows={4}
            />
          </div>

          <div>
            <Typography.Text strong>Applies to (optional)</Typography.Text>
            <Checkbox.Group
              value={offerAppliesTo}
              onChange={(values) => setOfferAppliesTo(values as string[])}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" size={6} style={{ width: "100%" }}>
                <Checkbox value="Total bill">Total bill</Checkbox>
                <Checkbox value="Room rate">Room rate</Checkbox>
                <Checkbox value="Experiences">Experiences</Checkbox>
                <Checkbox value="Retail">Retail</Checkbox>
              </Space>
            </Checkbox.Group>
          </div>

          <div>
            <Typography.Text strong>Marketing notes (optional)</Typography.Text>
            <Input.TextArea
              name="marketingNotes"
              placeholder="Anything we should know for the listing"
              rows={3}
            />
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Checkbox
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            >
              I agree to the partner terms
            </Checkbox>
            <Checkbox
              checked={agreeToMarketing}
              onChange={(e) => setAgreeToMarketing(e.target.checked)}
            >
              I’m happy to receive partner updates
            </Checkbox>
          </Space>

          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        </Space>
      </form>
    </>
  );
}
