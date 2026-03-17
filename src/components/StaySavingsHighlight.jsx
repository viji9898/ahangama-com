import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { useMemo } from "react";

const { Title, Text } = Typography;

const featuredStays = [
  {
    id: "samba",
    name: "Samba Ahangama",
    pricePerNightUSD: 95,
    discount: 0.3,
    badge: "Best value",
    summary: "Relaxed Ahangama stay with the strongest headline savings.",
    comparisonNote: "30% off — typically around 20% cheaper than Booking.com",
    exampleNights: 2,
  },
  {
    id: "unu",
    name: "UNU Boutique Hotel",
    pricePerNightUSD: 225,
    discount: 0.2,
    badge: "Popular",
    summary: "Boutique stay option with meaningful pass savings.",
    comparisonNote: "20% off — typically cheaper than Booking.com",
    exampleNights: 2,
  },
  {
    id: "mosvold",
    name: "Mosvold Villa",
    pricePerNightUSD: 250,
    discount: 0.2,
    badge: "Premium",
    summary: "Higher-end stay where the pass unlocks larger absolute savings.",
    comparisonNote: "20% off — typically cheaper than Booking.com",
    exampleNights: 2,
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
  const computed = useMemo(() => {
    return featuredStays.map((stay) => {
      const originalTotal = stay.pricePerNightUSD * stay.exampleNights;
      const discountedTotal = originalTotal * (1 - stay.discount);
      const savings = originalTotal - discountedTotal;

      return {
        ...stay,
        originalTotal,
        discountedTotal,
        savings,
      };
    });
  }, []);

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
          style={{ color: "rgba(0,0,0,0.62)", fontWeight: 650, maxWidth: 920 }}
        >
          Selected Ahangama Pass stays offer direct discounts that can make the
          pass worth it before you even use your food, surf, scooter, or
          wellness perks.
        </Text>

        <div
          style={{
            marginTop: 6,
            padding: "10px 12px",
            borderRadius: 18,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.72)",
            fontWeight: 950,
            color: "rgba(0,0,0,0.80)",
          }}
        >
          Save on your stay first. Everything else is a bonus.
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Row gutter={[14, 14]} align="stretch">
          {computed.map((stay) => {
            const badge = getBadgeStyle(stay.badge);
            const discountPct = Math.round(stay.discount * 100);

            return (
              <Col key={stay.id} xs={24} md={8}>
                <Card
                  hoverable
                  onClick={() => onSelectStay?.(stay.id)}
                  styles={{ body: { padding: 16 } }}
                  style={{
                    height: "100%",
                    borderRadius: 22,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.78)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "grid", gap: 10 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 10,
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
                          {stay.name}
                        </div>
                        <Text
                          style={{
                            display: "block",
                            marginTop: 6,
                            color: "rgba(0,0,0,0.62)",
                            fontWeight: 750,
                          }}
                        >
                          ${stay.pricePerNightUSD}/night • {discountPct}% off
                        </Text>
                      </div>

                      <Tag color={badge.color} style={badge.style}>
                        {stay.badge}
                      </Tag>
                    </div>

                    <Text
                      style={{ color: "rgba(0,0,0,0.62)", fontWeight: 650 }}
                    >
                      {stay.summary}
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
                        Example saving on {stay.exampleNights} nights
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
                        Save {formatUsd(stay.savings)}
                      </div>

                      <Text
                        style={{
                          display: "block",
                          marginTop: 6,
                          color: "rgba(0,0,0,0.58)",
                          fontWeight: 750,
                        }}
                      >
                        From {formatUsd(stay.originalTotal)} to{" "}
                        {formatUsd(stay.discountedTotal)} with the pass
                      </Text>
                    </div>

                    <Text
                      style={{ color: "rgba(0,0,0,0.52)", fontWeight: 650 }}
                    >
                      {stay.comparisonNote}
                    </Text>

                    <div style={{ marginTop: 2 }}>
                      <Button
                        type="text"
                        icon={<ArrowRightOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStay?.(stay.id);
                        }}
                        style={{ paddingInline: 0, fontWeight: 850 }}
                      >
                        Use this stay in calculator
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
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
