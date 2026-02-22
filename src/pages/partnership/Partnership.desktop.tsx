import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { type FormEvent, useState } from "react";

function encodeForm(data: Record<string, string>) {
  return new URLSearchParams(data).toString();
}

export default function PartnershipDesktop() {
  const [submitting, setSubmitting] = useState(false);
  const [api, contextHolder] = message.useMessage();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: Record<string, string> = {
      "form-name": "partnership",
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      setSubmitting(true);
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeForm(payload),
      });
      api.success("Thanks — we will get back to you.");
      form.reset();
    } catch {
      api.error("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {contextHolder}
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          Partnership
        </Typography.Title>
        <Typography.Text type="secondary">
          Send a quick note and we’ll reply.
        </Typography.Text>
      </Space>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Partner with us">
            <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
              Tell us about your venue or offer. We’ll get back to you.
            </Typography.Paragraph>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Contact form">
            <form
              name="partnership"
              method="POST"
              data-netlify="true"
              onSubmit={onSubmit}
            >
              <input type="hidden" name="form-name" value="partnership" />
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Input name="name" placeholder="Name" required />
                <Input name="email" placeholder="Email" type="email" required />
                <Input.TextArea
                  name="message"
                  placeholder="Message"
                  rows={6}
                  required
                />
                <Button type="primary" htmlType="submit" loading={submitting}>
                  Submit
                </Button>
              </Space>
            </form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
