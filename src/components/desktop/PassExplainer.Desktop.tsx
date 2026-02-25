import { Col, Row, Typography } from "antd";

type PassTier = {
  title: string;
  price: string;
  note: string;
};

const TIERS: PassTier[] = [
  {
    title: "15-Day Pass",
    price: "USD 18",
    note: "Best for short stays",
  },
  {
    title: "30-Day Pass",
    price: "USD 30",
    note: "Great for a month",
  },
  {
    title: "90-Day Pass",
    price: "USD 60",
    note: "For the full season",
  },
];

export function PassExplainerDesktop() {
  return (
    <div>
      <Typography.Paragraph style={{ marginTop: 0, marginBottom: 10 }}>
        The Ahangama Pass is a digital savings pass that gives you exclusive
        perks and discounts at curated cafés, stays, experiences, wellness
        spots, and surf partners across Ahangama.
      </Typography.Paragraph>

      <Row gutter={[10, 10]} align="stretch">
        {TIERS.map((tier) => (
          <Col key={tier.title} xs={24} sm={8}>
            <div
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.92)",
                borderRadius: 12,
                padding: 12,
                height: "100%",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 13, color: "#222" }}>
                {tier.title}
              </div>
              <div style={{ marginTop: 4, fontWeight: 900, fontSize: 18 }}>
                {tier.price}
              </div>
              <div style={{ marginTop: 2, fontSize: 12, color: "#666" }}>
                {tier.note}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
