import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Progress,
  Row,
  Select,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

import {
  ACCOMMODATIONS,
  calculateTripValueUnlock,
  TRAVEL_STYLE_DEFAULT_TILES,
  VALUE_TILE_ICONS,
  VALUE_TILES,
} from "../utils/tripValueUnlock";

const { Title, Text } = Typography;

const TRIP_LENGTH_OPTIONS = [2, 3, 5, 7, 10, 14];
const TRAVEL_STYLE_OPTIONS = ["Surf", "Chill", "Wellness", "Mixed"];

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
  if (strength === "Excellent") {
    return { label: "Excellent", color: "geekblue" };
  }
  if (strength === "Strong") return { label: "Strong", color: "cyan" };
  if (strength === "Good") return { label: "Good", color: "green" };
  return { label: "Light", color: "default" };
}

function compactValueRange(label) {
  if (!label) return "";
  return String(label)
    .replace(/^Usually\s+worth\s+/i, "")
    .trim();
}

function buildStepButtonStyle({ selected, locked }) {
  return {
    width: "100%",
    textAlign: "left",
    borderRadius: 18,
    border: selected
      ? "1px solid rgba(22,163,166,0.26)"
      : "1px solid rgba(0,0,0,0.08)",
    background: locked
      ? "rgba(255,255,255,0.78)"
      : selected
        ? "rgba(22,163,166,0.10)"
        : "rgba(255,255,255,0.76)",
    padding: 14,
    cursor: locked ? "default" : "pointer",
    boxShadow: selected ? "0 12px 28px rgba(0,0,0,0.08)" : "none",
    opacity: locked ? 0.96 : 1,
  };
}

export default function TripCalculator({
  onGetPassClick,
  onViewSampleItineraryClick,
  selectedStay,
  onStayChange,
  className,
}) {
  const [currentStep, setCurrentStep] = useState(1);
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

  const accommodation = useMemo(() => {
    return (
      ACCOMMODATIONS.find((item) => item.id === stayId) ?? ACCOMMODATIONS[0]
    );
  }, [stayId]);

  const valueTileById = useMemo(
    () => new Map(VALUE_TILES.map((item) => [item.id, item])),
    [],
  );

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

  const valueSourceOptions = useMemo(() => {
    return [
      {
        key: "stay",
        icon: "🏨",
        title: "Stay value",
        hint: `${accommodation.name} • ${formatUsd(result.meta.stayValuePerNight)}/night`,
        selected: true,
        locked: true,
      },
      {
        key: "surf",
        icon: VALUE_TILE_ICONS.surf,
        title: "Surf & activity value",
        hint: compactValueRange(valueTileById.get("surf")?.valueRangeLabel),
        selected: selectedPerks.includes("surf"),
      },
      {
        key: "scooter",
        icon: VALUE_TILE_ICONS.scooter,
        title: "Scooter & transport value",
        hint: compactValueRange(valueTileById.get("scooter")?.valueRangeLabel),
        selected: selectedPerks.includes("scooter"),
      },
      {
        key: "coffee",
        icon: VALUE_TILE_ICONS.coffee,
        title: "Coffee perks",
        hint: compactValueRange(valueTileById.get("coffee")?.valueRangeLabel),
        selected: selectedPerks.includes("coffee"),
      },
      {
        key: "breakfast",
        icon: VALUE_TILE_ICONS.breakfast,
        title: "Breakfast perks",
        hint: compactValueRange(
          valueTileById.get("breakfast")?.valueRangeLabel,
        ),
        selected: selectedPerks.includes("breakfast"),
      },
      {
        key: "dinner",
        icon: VALUE_TILE_ICONS.dinner,
        title: "Dinner perks",
        hint: compactValueRange(valueTileById.get("dinner")?.valueRangeLabel),
        selected: selectedPerks.includes("dinner"),
      },
      {
        key: "wellness",
        icon: VALUE_TILE_ICONS.wellness,
        title: "Wellness extras",
        hint: compactValueRange(valueTileById.get("wellness")?.valueRangeLabel),
        selected: selectedPerks.includes("wellness"),
      },
    ];
  }, [
    accommodation.name,
    result.meta.stayValuePerNight,
    selectedPerks,
    valueTileById,
  ]);

  const stepTitle =
    currentStep === 1
      ? "Select trip length"
      : currentStep === 2
        ? "Select travel style"
        : "Select where value comes from";

  const stepSupporting =
    currentStep === 1
      ? "Choose the rough length of your Ahangama trip so we can estimate realistic value."
      : currentStep === 2
        ? "Your travel style preselects the value sources you are most likely to use."
        : "Turn value drivers on or off. Stay value is already included from your selected stay.";

  const handleTripLengthSelect = (value) => {
    setNights(value);
    setCurrentStep(2);
  };

  const handleTravelStyleChange = (next) => {
    const nextStyle = String(next);
    setTravelStyle(nextStyle);
    setSelectedPerks(
      TRAVEL_STYLE_DEFAULT_TILES[nextStyle] ?? TRAVEL_STYLE_DEFAULT_TILES.Mixed,
    );
    setCurrentStep(3);
  };

  const handleTogglePerk = (key) => {
    if (key === "stay") return;

    setSelectedPerks((prev) => {
      if (prev.includes(key)) {
        return prev.filter((item) => item !== key);
      }
      return [...prev, key];
    });
  };

  return (
    <section
      aria-label="Trip Calculator"
      className={className}
      style={{
        width: "100%",
        borderRadius: 28,
        padding: 18,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        background:
          "radial-gradient(900px circle at 10% 0%, rgba(255,255,255,0.88), rgba(255,255,255,0) 60%), linear-gradient(135deg, rgba(255,209,232,0.42) 0%, rgba(205,255,239,0.44) 100%)",
        boxShadow: "0 14px 36px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <Title
          level={2}
          style={{
            margin: 0,
            fontWeight: 950,
            letterSpacing: -0.6,
            fontSize: 32,
            lineHeight: 1.05,
          }}
        >
          Estimate Your Ahangama Pass Value
        </Title>
        <Text
          style={{
            color: "rgba(0,0,0,0.62)",
            fontWeight: 650,
            fontSize: 14,
          }}
        >
          A simpler step-by-step way to see where the pass pays off fastest.
        </Text>
      </div>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }} align="stretch">
        <Col xs={24} lg={11}>
          <Card
            styles={{ body: { padding: 16 } }}
            style={{
              height: "100%",
              borderRadius: 22,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gap: 10 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.78)" }}>
                    Step {currentStep} of 3
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.55)", fontWeight: 700 }}>
                    {Math.round((currentStep / 3) * 100)}% complete
                  </Text>
                </div>

                <Progress
                  percent={(currentStep / 3) * 100}
                  showInfo={false}
                  strokeColor="#16a3a6"
                  trailColor="rgba(0,0,0,0.08)"
                  size="small"
                />

                <div>
                  <Title
                    level={3}
                    style={{ margin: 0, fontWeight: 950, letterSpacing: -0.4 }}
                  >
                    {stepTitle}
                  </Title>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "rgba(0,0,0,0.60)",
                      fontWeight: 650,
                    }}
                  >
                    {stepSupporting}
                  </Text>
                </div>
              </div>

              {currentStep === 1 ? (
                <Row gutter={[10, 10]}>
                  {TRIP_LENGTH_OPTIONS.map((option) => {
                    const selected = nights === option;
                    return (
                      <Col xs={12} sm={8} key={option}>
                        <button
                          type="button"
                          onClick={() => handleTripLengthSelect(option)}
                          style={buildStepButtonStyle({
                            selected,
                            locked: false,
                          })}
                        >
                          <div
                            style={{
                              color: "rgba(0,0,0,0.88)",
                              fontWeight: 950,
                              fontSize: 22,
                              letterSpacing: -0.5,
                              lineHeight: 1,
                            }}
                          >
                            {option}
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              color: "rgba(0,0,0,0.58)",
                              fontWeight: 750,
                              fontSize: 13,
                            }}
                          >
                            nights
                          </div>
                        </button>
                      </Col>
                    );
                  })}
                </Row>
              ) : null}

              {currentStep === 2 ? (
                <div style={{ display: "grid", gap: 12 }}>
                  <Row gutter={[10, 10]}>
                    {TRAVEL_STYLE_OPTIONS.map((option) => {
                      const selected = travelStyle === option;
                      return (
                        <Col xs={12} sm={12} key={option}>
                          <button
                            type="button"
                            onClick={() => handleTravelStyleChange(option)}
                            style={buildStepButtonStyle({
                              selected,
                              locked: false,
                            })}
                          >
                            <div
                              style={{
                                color: "rgba(0,0,0,0.88)",
                                fontWeight: 900,
                                fontSize: 18,
                                letterSpacing: -0.3,
                                lineHeight: 1.1,
                              }}
                            >
                              {option}
                            </div>
                            <div
                              style={{
                                marginTop: 8,
                                color: "rgba(0,0,0,0.58)",
                                fontWeight: 750,
                                fontSize: 13,
                              }}
                            >
                              travel style
                            </div>
                          </button>
                        </Col>
                      );
                    })}
                  </Row>
                  <Text style={{ color: "rgba(0,0,0,0.56)", fontWeight: 700 }}>
                    We use this to preselect the most relevant perks before you
                    fine-tune them.
                  </Text>
                </div>
              ) : null}

              {currentStep === 3 ? (
                <Row gutter={[10, 10]}>
                  {valueSourceOptions.map((option) => (
                    <Col xs={24} sm={12} key={option.key}>
                      <button
                        type="button"
                        onClick={() => handleTogglePerk(option.key)}
                        disabled={option.locked}
                        style={buildStepButtonStyle({
                          selected: option.selected,
                          locked: option.locked,
                        })}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{ display: "flex", gap: 10, minWidth: 0 }}
                          >
                            <span style={{ fontSize: 18, lineHeight: 1 }}>
                              {option.icon}
                            </span>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  color: "rgba(0,0,0,0.86)",
                                  fontWeight: 900,
                                  fontSize: 14,
                                  lineHeight: 1.2,
                                }}
                              >
                                {option.title}
                              </div>
                              <div
                                style={{
                                  marginTop: 6,
                                  color: "rgba(0,0,0,0.56)",
                                  fontWeight: 700,
                                  fontSize: 12,
                                  lineHeight: 1.35,
                                }}
                              >
                                {option.hint}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              flex: "0 0 auto",
                              color: option.selected
                                ? "rgba(22,163,166,0.95)"
                                : "rgba(0,0,0,0.32)",
                              fontWeight: 950,
                              fontSize: 13,
                            }}
                          >
                            {option.locked
                              ? "Included"
                              : option.selected
                                ? "Selected"
                                : "Add"}
                          </div>
                        </div>
                      </button>
                    </Col>
                  ))}
                </Row>
              ) : null}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="default"
                  disabled={currentStep === 1}
                  onClick={() =>
                    setCurrentStep((step) => Math.max(1, step - 1))
                  }
                  style={{ borderRadius: 999, fontWeight: 850 }}
                >
                  Previous step
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="primary"
                    onClick={() =>
                      setCurrentStep((step) => Math.min(3, step + 1))
                    }
                    style={{
                      borderRadius: 999,
                      fontWeight: 900,
                      border: "none",
                      background:
                        "linear-gradient(135deg, rgba(22,163,166,1) 0%, rgba(70,214,182,0.98) 100%)",
                      boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
                    }}
                  >
                    Next step
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={13}>
          <Card
            styles={{ body: { padding: 14 } }}
            style={{
              height: "100%",
              borderRadius: 20,
              border: "1px solid rgba(22,163,166,0.22)",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                  Selected stay
                </Text>
                <Select
                  value={stayId}
                  onChange={setStayId}
                  className="ahg-stay-select"
                  popupClassName="ahg-stay-select-dropdown"
                  style={{ width: "100%" }}
                  options={ACCOMMODATIONS.map((item) => ({
                    value: item.id,
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
                          {item.name} — ${item.publicRateUsd}/night —{" "}
                          {Math.round(item.passDiscount * 100)}% off
                        </span>
                        <Tag
                          style={{ borderRadius: 999, fontWeight: 900 }}
                          color={getBadgeColor(item.badge)}
                        >
                          {item.badge}
                        </Tag>
                      </div>
                    ),
                  }))}
                />
                <Text style={{ color: "rgba(0,0,0,0.56)", fontWeight: 700 }}>
                  Nightly stay value unlocked:{" "}
                  {formatUsd(result.meta.stayValuePerNight)}
                </Text>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(22,163,166,0.22)",
                  background: "rgba(22,163,166,0.10)",
                  padding: 12,
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
                    <Text
                      style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}
                    >
                      Estimated value unlocked
                    </Text>
                    <div
                      style={{
                        marginTop: 4,
                        fontSize: 38,
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
                        marginTop: 4,
                        color: "rgba(0,0,0,0.60)",
                        fontWeight: 750,
                      }}
                    >
                      {result.narrative.subheadline}
                    </Text>
                  </div>

                  <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
                    <Tag
                      color={strengthMeta.color}
                      style={{
                        borderRadius: 999,
                        fontWeight: 950,
                        paddingInline: 10,
                        marginInlineEnd: 0,
                      }}
                    >
                      Pass value: {strengthMeta.label}
                    </Tag>
                    <Text
                      style={{ color: "rgba(0,0,0,0.58)", fontWeight: 750 }}
                    >
                      Updates live as you complete each step
                    </Text>
                  </div>
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{ color: "rgba(0,0,0,0.60)", fontWeight: 750 }}
                    >
                      Public price equivalent
                    </Text>
                    <Text
                      style={{ color: "rgba(0,0,0,0.82)", fontWeight: 950 }}
                    >
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
                    <Text
                      style={{ color: "rgba(0,0,0,0.60)", fontWeight: 750 }}
                    >
                      With Ahangama Pass value
                    </Text>
                    <Text
                      style={{ color: "rgba(0,0,0,0.82)", fontWeight: 950 }}
                    >
                      {formatUsd(result.passAdjustedValue)}
                    </Text>
                  </div>
                  <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 700 }}>
                    {result.narrative.stayLine}
                  </Text>
                </div>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <div>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Biggest wins
                  </Text>
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {(result.highlights ?? []).map((item) => (
                      <Tag
                        key={`${item.label}:${item.value}`}
                        style={{
                          borderRadius: 999,
                          fontWeight: 900,
                          background: "rgba(255,255,255,0.88)",
                          borderColor: "rgba(0,0,0,0.12)",
                          color: "rgba(0,0,0,0.78)",
                        }}
                      >
                        {item.label}: {item.value}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Value breakdown
                  </Text>
                  <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
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

              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  paddingTop: 12,
                  display: "grid",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: "8px 10px",
                    borderRadius: 14,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(22,163,166,0.10)",
                    fontWeight: 900,
                    color: "rgba(0,0,0,0.78)",
                  }}
                >
                  {result.narrative.ctaMessage}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Button
                    type="primary"
                    size="middle"
                    onClick={onGetPassClick}
                    style={{
                      borderRadius: 999,
                      fontWeight: 900,
                      border: "none",
                      background:
                        "linear-gradient(135deg, rgba(22,163,166,1) 0%, rgba(70,214,182,0.98) 100%)",
                      boxShadow: "0 10px 22px rgba(0,0,0,0.14)",
                    }}
                  >
                    Get the pass
                  </Button>

                  <Button
                    type="text"
                    onClick={onViewSampleItineraryClick}
                    icon={<ArrowRightOutlined />}
                  >
                    View sample itinerary
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
