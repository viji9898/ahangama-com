import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Grid,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
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
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.md;
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
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 10, maxWidth: 780 }}>
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
              maxWidth: 900,
              lineHeight: 1.6,
            }}
          >
            Accommodation savings often create the biggest absolute value in the
            pass. In many cases, the hotel discount alone can justify buying it
            before you even use cafes, surf, transport, or wellness perks.
          </Text>
        </div>

        <Card
          styles={{ body: { padding: isSmall ? 16 : 18 } }}
          style={{
            borderRadius: 24,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
          }}
        >
          {(() => {
            const badge = getBadgeStyle(selectedStay.badge);

            return (
              <div style={{ display: "grid", gap: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 14,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "grid", gap: 8, minWidth: 0 }}>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Stay venue
                    </Text>
                    <div
                      style={{
                        width: isSmall ? "100%" : 420,
                        maxWidth: "100%",
                      }}
                    >
                      <Select
                        value={selectedFeaturedStayId}
                        onChange={setSelectedFeaturedStayId}
                        className="ahg-stay-select"
                        popupClassName="ahg-stay-select-dropdown"
                        style={{ width: "100%" }}
                        optionLabelProp="label"
                        options={featuredStayOptions.map((s) => ({
                          value: s.id,
                          label: `${s.name} — $${s.pricePerNight}/night — ${s.discountPercent}% off`,
                        }))}
                        optionRender={(option) => {
                          const stayOption =
                            featuredStayOptions.find(
                              (x) => x.id === option.value,
                            ) ?? featuredStayOptions[0];
                          const optionBadge = getBadgeStyle(stayOption.badge);

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
                                {stayOption.name} — ${stayOption.pricePerNight}
                                /night — {stayOption.discountPercent}% off
                              </div>
                              <Tag
                                color={optionBadge.color}
                                style={{
                                  ...optionBadge.style,
                                  marginInlineEnd: 0,
                                }}
                              >
                                {stayOption.badge}
                              </Tag>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      justifyItems: isSmall ? "start" : "end",
                    }}
                  >
                    <Tag
                      color={badge.color}
                      style={{ ...badge.style, marginInlineEnd: 0 }}
                    >
                      {selectedStay.badge}
                    </Tag>
                    <Text
                      style={{
                        color: "rgba(0,0,0,0.58)",
                        fontWeight: 750,
                        fontSize: 12,
                      }}
                    >
                      Often cheaper than booking platforms
                    </Text>
                  </div>
                </div>

                <Row gutter={[16, 16]} align="stretch">
                  <Col xs={24} lg={10}>
                    <div style={{ display: "grid", gap: 14, height: "100%" }}>
                      <div
                        style={{
                          borderRadius: 20,
                          border: "1px solid rgba(0,0,0,0.08)",
                          background: "rgba(255,255,255,0.72)",
                          padding: 16,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 950,
                            letterSpacing: -0.3,
                            color: "rgba(0,0,0,0.88)",
                            fontSize: 22,
                            lineHeight: 1.1,
                          }}
                        >
                          {selectedStay.name}
                        </div>
                        <Text
                          style={{
                            display: "block",
                            marginTop: 8,
                            color: "rgba(0,0,0,0.62)",
                            fontWeight: 650,
                            lineHeight: 1.55,
                          }}
                        >
                          {selectedStay.description}
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                          gap: 10,
                        }}
                      >
                        {[
                          {
                            label: "Nightly rate",
                            value: formatUsd(selectedStay.pricePerNight),
                          },
                          {
                            label: "Discount",
                            value: `${selectedStay.discountPercent}% off`,
                          },
                          {
                            label: "Stay length",
                            value: `${selectedStay.exampleNights} nights`,
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            style={{
                              borderRadius: 18,
                              border: "1px solid rgba(0,0,0,0.08)",
                              background: "rgba(255,255,255,0.78)",
                              padding: 14,
                            }}
                          >
                            <div
                              style={{
                                color: "rgba(0,0,0,0.5)",
                                fontWeight: 850,
                                fontSize: 11,
                                letterSpacing: 0.9,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                marginTop: 8,
                                color: "rgba(0,0,0,0.86)",
                                fontWeight: 900,
                                fontSize: 18,
                                letterSpacing: -0.3,
                                lineHeight: 1.15,
                              }}
                            >
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Text
                        style={{ color: "rgba(0,0,0,0.56)", fontWeight: 700 }}
                      >
                        {selectedStay.supportingNote}. Stays often drive the
                        biggest absolute savings because the nightly rate is the
                        largest part of most trips.
                      </Text>
                    </div>
                  </Col>

                  <Col xs={24} lg={14}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 22,
                        border: "1px solid rgba(22,163,166,0.22)",
                        background: "rgba(22,163,166,0.10)",
                        padding: isSmall ? 16 : 20,
                        display: "grid",
                        gap: 14,
                      }}
                    >
                      <div style={{ display: "grid", gap: 6 }}>
                        <Text
                          style={{
                            color: "rgba(0,0,0,0.68)",
                            fontWeight: 850,
                            fontSize: 12,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                          }}
                        >
                          Example saving on {selectedStay.exampleNights} nights
                        </Text>

                        <div
                          style={{
                            fontSize: isSmall ? 42 : 54,
                            fontWeight: 950,
                            letterSpacing: -1.4,
                            lineHeight: 0.94,
                            color: "rgba(0,0,0,0.88)",
                          }}
                        >
                          {formatUsd(selectedStay.savings)}
                        </div>

                        <Text
                          style={{
                            color: "rgba(0,0,0,0.60)",
                            fontWeight: 750,
                            fontSize: 14,
                          }}
                        >
                          Direct accommodation savings before adding any other
                          pass perks.
                        </Text>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isSmall
                            ? "1fr"
                            : "repeat(3, minmax(0, 1fr))",
                          gap: 10,
                        }}
                      >
                        {[
                          {
                            label: "Before price",
                            value: formatUsd(selectedStay.originalTotal),
                          },
                          {
                            label: "After price",
                            value: formatUsd(selectedStay.discountedTotal),
                          },
                          {
                            label: "Total savings",
                            value: formatUsd(selectedStay.savings),
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            style={{
                              borderRadius: 18,
                              border: "1px solid rgba(0,0,0,0.08)",
                              background: "rgba(255,255,255,0.72)",
                              padding: 14,
                            }}
                          >
                            <div
                              style={{
                                color: "rgba(0,0,0,0.5)",
                                fontWeight: 850,
                                fontSize: 11,
                                letterSpacing: 0.9,
                                textTransform: "uppercase",
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                marginTop: 8,
                                color: "rgba(0,0,0,0.88)",
                                fontWeight: 950,
                                fontSize: 24,
                                letterSpacing: -0.7,
                                lineHeight: 1,
                              }}
                            >
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <Text
                          style={{ color: "rgba(0,0,0,0.58)", fontWeight: 750 }}
                        >
                          Often cheaper than booking platforms
                        </Text>

                        <Button
                          type="primary"
                          icon={<ArrowRightOutlined />}
                          iconPosition="end"
                          onClick={() => {
                            onSelectStay?.(selectedStay.calculatorStayId);
                          }}
                          style={{
                            borderRadius: 999,
                            fontWeight: 900,
                            border: "none",
                            minHeight: 46,
                            paddingInline: 18,
                            background:
                              "linear-gradient(135deg, rgba(22,163,166,1) 0%, rgba(70,214,182,0.98) 100%)",
                            boxShadow: "0 12px 26px rgba(0,0,0,0.14)",
                          }}
                        >
                          Use this stay in calculator
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>

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
                      Often cheaper than booking platforms
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
                      Then stack cafes, surf, transport, and wellness perks
                    </Tag>
                  </Space>
                </div>
              </div>
            );
          })()}
        </Card>
      </div>
    </section>
  );
}
