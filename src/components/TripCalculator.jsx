import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import ValueProfileSelector from "./ValueProfileSelector";

import {
  ACCOMMODATIONS,
  calculateTripValueUnlock,
  TRAVEL_STYLE_DEFAULT_TILES,
  TRIP_PRESETS,
  VALUE_TILES,
} from "../utils/tripValueUnlock";

const { Title, Text } = Typography;

function getBadgeColor(badge) {
  if (badge === "Best value") return "cyan";
  if (badge === "Popular") return "geekblue";
  if (badge === "Premium") return "gold";
  return "default";
}

function formatUsd(amount) {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

function getStrengthMeta(strength) {
  if (strength === "Excellent")
    return { label: "Excellent", color: "geekblue" };
  if (strength === "Strong") return { label: "Strong", color: "cyan" };
  if (strength === "Good") return { label: "Good", color: "green" };
  return { label: "Light", color: "default" };
}

export default function TripCalculator({
  onGetPassClick,
  onViewSampleItineraryClick,
  selectedStay,
  onStayChange,
  className,
}) {
  const [nights, setNights] = useState(2);
  const [internalStayId, setInternalStayId] = useState("samba");
  const [travelStyle, setTravelStyle] = useState("Mixed");
  const [selectedPerks, setSelectedPerks] = useState(
    TRAVEL_STYLE_DEFAULT_TILES.Mixed,
  );

  const stayId = selectedStay ?? internalStayId;

  const setStayId = (nextStayId) => {
    onStayChange?.(nextStayId);
    if (selectedStay == null) setInternalStayId(nextStayId);
  };

  const result = useMemo(() => {
    return calculateTripValueUnlock({
      nights,
      accommodationId: stayId,
      travelStyle,
      selectedTiles: selectedPerks,
    });
  }, [nights, stayId, travelStyle, selectedPerks]);

  const strengthMeta = useMemo(
    () => getStrengthMeta(result.strength),
    [result.strength],
  );

  const selectedPerkTags = useMemo(() => {
    const metaByKey = new Map(VALUE_TILES.map((p) => [p.id, p]));
    return selectedPerks
      .map((k) => metaByKey.get(k))
      .filter(Boolean)
      .map((p) => ({ key: p.id, label: p.label }));
  }, [selectedPerks]);

  return (
    <section
      aria-label="Trip Calculator"
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 950, letterSpacing: -0.6 }}
          >
            Estimate Your Ahangama Pass Value
          </Title>
          <Text
            style={{
              display: "block",
              marginTop: 8,
              color: "rgba(0,0,0,0.62)",
              fontWeight: 650,
            }}
          >
            Not a discount calculator — a meaningful value unlock tool.
          </Text>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }} align="stretch">
        <Col xs={24} md={24}>
          <Space size={8} wrap>
            {TRIP_PRESETS.map((p) => (
              <Button
                key={p.key}
                size="middle"
                style={{
                  borderRadius: 999,
                  fontWeight: 850,
                  borderColor: "rgba(0,0,0,0.14)",
                  background: "rgba(255,255,255,0.82)",
                }}
                onClick={() => {
                  setNights(p.nights);
                  setStayId(p.accommodationId);
                  setTravelStyle(p.travelStyle);
                  setSelectedPerks(p.tiles);
                }}
              >
                {p.label}
              </Button>
            ))}
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Card
            styles={{ body: { padding: 16 } }}
            style={{
              height: "100%",
              borderRadius: 22,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.76)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 18px 44px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                  Number of nights
                </Text>
                <div style={{ marginTop: 8 }}>
                  <InputNumber
                    min={1}
                    max={14}
                    value={nights}
                    onChange={(v) => setNights(v ?? 2)}
                    style={{ width: "100%", borderRadius: 14 }}
                  />
                </div>
              </div>

              <div>
                <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                  Accommodation
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Select
                    value={stayId}
                    onChange={setStayId}
                    style={{ width: "100%" }}
                    options={ACCOMMODATIONS.map((a) => ({
                      value: a.id,
                      label: (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <span style={{ fontWeight: 850 }}>
                            {a.name} — ${a.publicRateUsd}/night —{" "}
                            {Math.round(a.passDiscount * 100)}% off
                          </span>
                          <Tag
                            style={{ borderRadius: 999, fontWeight: 900 }}
                            color={getBadgeColor(a.badge)}
                          >
                            {a.badge}
                          </Tag>
                        </div>
                      ),
                    }))}
                  />
                </div>

                <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
                  <Text style={{ color: "rgba(0,0,0,0.58)", fontWeight: 750 }}>
                    Nightly value unlocked:{" "}
                    <span style={{ fontWeight: 950 }}>
                      {formatUsd(result.meta.stayValuePerNight)}
                    </span>
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.54)", fontWeight: 750 }}>
                    {result.narrative.stayLine}
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 650 }}>
                    {result.meta.platformLine}
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 650 }}>
                    {result.meta.stayWhy}
                  </Text>
                </div>
              </div>

              <div>
                <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                  Travel style
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Segmented
                    value={travelStyle}
                    onChange={(next) => {
                      const nextStyle = String(next);
                      setTravelStyle(nextStyle);

                      const defaults =
                        TRAVEL_STYLE_DEFAULT_TILES[nextStyle] ??
                        TRAVEL_STYLE_DEFAULT_TILES.Mixed;
                      setSelectedPerks(defaults);
                    }}
                    options={["Surf", "Chill", "Wellness", "Mixed"]}
                    block
                  />
                </div>
              </div>

              <div>
                <div style={{ marginTop: 6 }}>
                  <ValueProfileSelector
                    selectedKeys={selectedPerks}
                    selectedStayId={stayId}
                    stayValuePerNight={result.meta.stayValuePerNight}
                    onToggleKey={(key) => {
                      setSelectedPerks((prev) => {
                        if (prev.includes(key))
                          return prev.filter((x) => x !== key);
                        return [...prev, key];
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            styles={{ body: { padding: 16 } }}
            style={{
              height: "100%",
              borderRadius: 22,
              border: "1px solid rgba(22,163,166,0.22)",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 26px 64px rgba(0,0,0,0.12)",
            }}
          >
            <div
              style={{
                borderRadius: 18,
                border: "1px solid rgba(22,163,166,0.22)",
                background: "rgba(22,163,166,0.10)",
                padding: 14,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Estimated value unlocked
                  </Text>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 40,
                      fontWeight: 950,
                      letterSpacing: -0.8,
                      lineHeight: 1.02,
                    }}
                  >
                    {formatUsd(result.totalValue)}
                  </div>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "rgba(0,0,0,0.60)",
                      fontWeight: 750,
                    }}
                  >
                    {result.narrative.subheadline}
                  </Text>
                </div>

                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <Tag
                    color={strengthMeta.color}
                    style={{
                      borderRadius: 999,
                      fontWeight: 950,
                      paddingInline: 12,
                    }}
                  >
                    Pass value: {strengthMeta.label}
                  </Tag>
                  <Text style={{ color: "rgba(0,0,0,0.58)", fontWeight: 750 }}>
                    Based on how you plan to use the pass
                  </Text>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "rgba(0,0,0,0.60)", fontWeight: 750 }}>
                    Public price equivalent
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.82)", fontWeight: 950 }}>
                    {formatUsd(result.publicPriceEquivalent)}
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "rgba(0,0,0,0.60)", fontWeight: 750 }}>
                    With Ahangama Pass value
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.82)", fontWeight: 950 }}>
                    {formatUsd(result.passAdjustedValue)}
                  </Text>
                </div>
                <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 700 }}>
                  Accommodation usually drives the biggest saving.
                </Text>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div>
                <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                  Biggest wins
                </Text>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {(result.highlights ?? []).map((h) => (
                    <Tag
                      key={`${h.label}:${h.value}`}
                      style={{
                        borderRadius: 999,
                        fontWeight: 900,
                        background: "rgba(255,255,255,0.88)",
                        borderColor: "rgba(0,0,0,0.12)",
                        color: "rgba(0,0,0,0.78)",
                      }}
                    >
                      {h.label}: {h.value}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                  Value breakdown
                </Text>

                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  {["stay", "activity", "transport", "food", "wellness"].map(
                    (key) => {
                      const item = result.breakdown?.[key];
                      const total = Number(item?.total) || 0;
                      if (total <= 0) return null;
                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 12,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: 850,
                              color: "rgba(0,0,0,0.66)",
                            }}
                          >
                            {item.label}
                          </Text>
                          <Text
                            style={{
                              fontWeight: 950,
                              color: "rgba(0,0,0,0.82)",
                            }}
                          >
                            {formatUsd(total)}
                          </Text>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            {selectedPerkTags.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                <Space size={[6, 6]} wrap>
                  {selectedPerkTags.map((p) => (
                    <Tag
                      key={p.key}
                      style={{
                        borderRadius: 999,
                        fontWeight: 850,
                        background: "rgba(22,163,166,0.10)",
                        borderColor: "rgba(22,163,166,0.20)",
                        color: "rgba(0,0,0,0.78)",
                      }}
                    >
                      {p.label}
                    </Tag>
                  ))}
                </Space>
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                <Text style={{ color: "rgba(0,0,0,0.55)", fontWeight: 700 }}>
                  Select a couple of tiles to reveal your biggest wins.
                </Text>
              </div>
            )}

            <div
              style={{
                marginTop: 14,
                borderTop: "1px solid rgba(0,0,0,0.08)",
                paddingTop: 14,
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(22,163,166,0.10)",
                  fontWeight: 900,
                  color: "rgba(0,0,0,0.78)",
                }}
              >
                {result.narrative.ctaMessage}
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={onGetPassClick}
                style={{
                  borderRadius: 999,
                  fontWeight: 900,
                  border: "none",
                  background:
                    "linear-gradient(135deg, rgba(22,163,166,1) 0%, rgba(70,214,182,0.98) 100%)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.14)",
                }}
              >
                Get the Pass
              </Button>

              <Button
                type="text"
                onClick={onViewSampleItineraryClick}
                icon={<ArrowRightOutlined />}
              >
                View sample itinerary
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
