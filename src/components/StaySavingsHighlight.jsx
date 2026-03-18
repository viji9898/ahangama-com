import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Select, Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

const { Title, Text } = Typography;

const featuredStayOptions = [
  {
    id: "samba-ahangama",
    calculatorStayId: "samba",
    name: "Samba Ahangama",
    badge: "Best value",
    badgeTone: "mint",
    pricePerNight: 95,
    discountPercent: 30,
    description: "Relaxed Ahangama stay with the strongest headline savings.",
    exampleNights: 2,
    originalTotal: 190,
    discountedTotal: 133,
    savings: 57,
    supportingNote: "30% off — typically around 20% cheaper than Booking.com",
  },
  {
    id: "unu-boutique-hotel",
    calculatorStayId: "unu",
    name: "UNU Boutique Hotel",
    badge: "Popular",
    badgeTone: "lavender",
    pricePerNight: 225,
    discountPercent: 20,
    description: "Boutique stay option with meaningful pass savings.",
    exampleNights: 2,
    originalTotal: 450,
    discountedTotal: 360,
    savings: 90,
    supportingNote: "20% off — typically cheaper than Booking.com",
  },
  {
    id: "mosvold-villa",
    calculatorStayId: "mosvold",
    name: "Mosvold Villa",
    badge: "Premium",
    badgeTone: "sand",
    pricePerNight: 250,
    discountPercent: 20,
    description:
      "Higher-end stay where the pass unlocks larger absolute savings.",
    exampleNights: 2,
    originalTotal: 500,
    discountedTotal: 400,
    savings: 100,
    supportingNote: "20% off — typically cheaper than Booking.com",
  },
];

function formatUsd(amount) {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

function getBadgeStyle(badge) {
  if (badge === "Best value") {
    return {
      color: "cyan",
      style: {
        borderRadius: 999,
        fontWeight: 950,
        background: "rgba(22,163,166,0.14)",
        borderColor: "rgba(22,163,166,0.25)",
        color: "rgba(0,0,0,0.78)",
      },
    };
  }

  if (badge === "Popular") {
    return {
      color: "geekblue",
      style: {
        borderRadius: 999,
        fontWeight: 950,
        background: "rgba(64, 99, 255, 0.12)",
        borderColor: "rgba(64, 99, 255, 0.22)",
        color: "rgba(0,0,0,0.78)",
      },
    };
  }

  return {
    color: "gold",
    style: {
      borderRadius: 999,
      fontWeight: 950,
      background: "rgba(214, 173, 0, 0.14)",
      borderColor: "rgba(214, 173, 0, 0.24)",
      color: "rgba(0,0,0,0.78)",
    },
  };
}

export default function StaySavingsHighlight({ onSelectStay, className }) {
  const [selectedFeaturedStayId, setSelectedFeaturedStayId] = useState(
    featuredStayOptions[0]?.id ?? "samba-ahangama",
  );

  const selectedStay = useMemo(() => {
    return (
      featuredStayOptions.find((s) => s.id === selectedFeaturedStayId) ??
      featuredStayOptions[0]
    );
  }, [selectedFeaturedStayId]);

  return (
    <section
      aria-label="Featured stay savings"
      className={className}
      style={{
        width: "100%",
        borderRadius: 32,
        padding: 24,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "radial-gradient(900px circle at 10% 0%, rgba(255,255,255,0.88), rgba(255,255,255,0) 60%), linear-gradient(135deg, rgba(255,209,232,0.42) 0%, rgba(205,255,239,0.44) 100%)",
        boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ marginTop: 16 }}>
        <Row gutter={[14, 14]} align="top">
          <Col xs={24} md={12}>
            <div style={{ display: "grid", gap: 10 }}>
              <Text
                style={{
                  fontWeight: 900,
                  letterSpacing: 0.4,
                  color: "rgba(0,0,0,0.62)",
                }}
              >
                Featured stay savings
              </Text>

              <Title
                level={2}
                style={{ margin: 0, fontWeight: 950, letterSpacing: -0.6 }}
              >
                Big savings start with where you stay
              </Title>

              <Text
                style={{
                  color: "rgba(0,0,0,0.62)",
                  fontWeight: 650,
                  maxWidth: 920,
                }}
              >
                Selected Ahangama Pass stays offer direct discounts that can
                make the pass worth it before you even use your food, surf,
                scooter, or wellness perks.
              </Text>
            </div>
            <br></br>
            <Card
              styles={{ body: { padding: 16 } }}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
              }}
            >
              <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                Stay venue
              </Text>
              <div style={{ marginTop: 8 }}>
                <Select
                  value={selectedFeaturedStayId}
                  onChange={setSelectedFeaturedStayId}
                  style={{ width: "100%" }}
                  optionLabelProp="label"
                  options={featuredStayOptions.map((s) => ({
                    value: s.id,
                    label: `${s.name} — $${s.pricePerNight}/night — ${s.discountPercent}% off`,
                  }))}
                  optionRender={(option) => {
                    const s =
                      featuredStayOptions.find((x) => x.id === option.value) ??
                      featuredStayOptions[0];
                    const badge = getBadgeStyle(s.badge);

                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <div style={{ fontWeight: 850 }}>
                          {s.name} — ${s.pricePerNight}/night —{" "}
                          {s.discountPercent}% off
                        </div>
                        <Tag
                          color={badge.color}
                          style={{ ...badge.style, marginInlineEnd: 0 }}
                        >
                          {s.badge}
                        </Tag>
                      </div>
                    );
                  }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              styles={{ body: { padding: 16 } }}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
              }}
            >
              {(() => {
                const badge = getBadgeStyle(selectedStay.badge);

                return (
                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 950,
                            letterSpacing: -0.2,
                            color: "rgba(0,0,0,0.86)",
                            fontSize: 16,
                            lineHeight: 1.2,
                          }}
                        >
                          {selectedStay.name}
                        </div>
                        <Text
                          style={{
                            display: "block",
                            marginTop: 6,
                            color: "rgba(0,0,0,0.62)",
                            fontWeight: 750,
                          }}
                        >
                          ${selectedStay.pricePerNight}/night •{" "}
                          {selectedStay.discountPercent}% off
                        </Text>
                      </div>

                      <Tag color={badge.color} style={badge.style}>
                        {selectedStay.badge}
                      </Tag>
                    </div>

                    <Text
                      style={{ color: "rgba(0,0,0,0.62)", fontWeight: 650 }}
                    >
                      {selectedStay.description}
                    </Text>

                    <div
                      style={{
                        borderRadius: 18,
                        border: "1px solid rgba(22,163,166,0.22)",
                        background: "rgba(22,163,166,0.10)",
                        padding: 14,
                      }}
                    >
                      <Text
                        style={{
                          display: "block",
                          color: "rgba(0,0,0,0.70)",
                          fontWeight: 850,
                        }}
                      >
                        Example saving on {selectedStay.exampleNights} nights
                      </Text>

                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 34,
                          fontWeight: 950,
                          letterSpacing: -0.7,
                          lineHeight: 1.05,
                          color: "rgba(0,0,0,0.86)",
                        }}
                      >
                        Save {formatUsd(selectedStay.savings)}
                      </div>

                      <Text
                        style={{
                          display: "block",
                          marginTop: 6,
                          color: "rgba(0,0,0,0.58)",
                          fontWeight: 750,
                        }}
                      >
                        From {formatUsd(selectedStay.originalTotal)} to{" "}
                        {formatUsd(selectedStay.discountedTotal)} with the pass
                      </Text>
                    </div>

                    <Text
                      style={{ color: "rgba(0,0,0,0.52)", fontWeight: 650 }}
                    >
                      {selectedStay.supportingNote}
                    </Text>

                    <div style={{ marginTop: 2 }}>
                      <Button
                        type="text"
                        icon={<ArrowRightOutlined />}
                        onClick={() => {
                          onSelectStay?.(selectedStay.calculatorStayId);
                        }}
                        style={{ paddingInline: 0, fontWeight: 850 }}
                      >
                        Use this stay in calculator
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </Card>
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.72)",
            padding: 12,
          }}
        >
          <Space
            size={[8, 8]}
            wrap
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Tag
              style={{
                borderRadius: 999,
                fontWeight: 900,
                background: "rgba(22,163,166,0.12)",
                borderColor: "rgba(22,163,166,0.20)",
                color: "rgba(0,0,0,0.78)",
              }}
            >
              Up to 30% off selected stays
            </Tag>
            <Tag
              style={{
                borderRadius: 999,
                fontWeight: 900,
                background: "rgba(255,255,255,0.95)",
                borderColor: "rgba(0,0,0,0.14)",
                color: "rgba(0,0,0,0.78)",
              }}
            >
              Typically cheaper than Booking.com
            </Tag>
            <Tag
              style={{
                borderRadius: 999,
                fontWeight: 900,
                background: "rgba(255,209,232,0.26)",
                borderColor: "rgba(0,0,0,0.10)",
                color: "rgba(0,0,0,0.78)",
              }}
            >
              Then stack food, surf, scooter, and wellness perks
            </Tag>
          </Space>
        </div>
      </div>
    </section>
  );
}
