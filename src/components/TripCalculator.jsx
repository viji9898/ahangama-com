import { ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import perkStyles from "./TripCalculatorPerks.module.css";

const { Title, Text } = Typography;

const USD_TO_LKR = 320;

const accommodations = [
  {
    id: "samba",
    name: "Samba Ahangama",
    pricePerNightUSD: 95,
    discount: 0.3,
    badge: "Best value",
    comparisonNote: "30% off — typically ~20% cheaper than Booking.com",
  },
  {
    id: "unu",
    name: "UNU Boutique Hotel",
    pricePerNightUSD: 225,
    discount: 0.2,
    badge: "Popular",
    comparisonNote: "20% off — typically cheaper than Booking.com",
  },
  {
    id: "mosvold",
    name: "Mosvold Villa",
    pricePerNightUSD: 250,
    discount: 0.2,
    badge: "Premium",
    comparisonNote: "20% off — typically cheaper than Booking.com",
  },
];

const perkValuesUsd = {
  coffee: 3,
  breakfast: 5,
  dinner: 8,
  surf: 10,
  scooter: 6,
  wellness: 15,
};

const perkOptions = [
  {
    id: "coffee",
    label: "Coffee perks",
    savingsLabel: "Worth ~$3–$6/day",
    venues: ["Kaffi", "Cactus", "Black Honey"],
    example: "Free coffee add-on or drink discount",
  },
  {
    id: "breakfast",
    label: "Breakfast / brunch perks",
    savingsLabel: "Worth ~$5–$10/meal",
    venues: ["Kaffi", "The Kip", "Cactus", "Black Honey"],
    example: "Breakfast combo or free item with meal",
  },
  {
    id: "dinner",
    label: "Dinner perks",
    savingsLabel: "Worth ~$8–$15/meal",
    venues: ["UNU", "Samba", "Teddies", "Meori"],
    example: "Free starter, dessert, or % off dinner",
  },
  {
    id: "surf",
    label: "Surf & activity perks",
    savingsLabel: "Worth ~$10–$20/session",
    venues: ["Board Hut", "Lotus Surf & Wellness"],
    example: "Extra time or discounted board rental",
  },
  {
    id: "scooter",
    label: "Scooter rental perks",
    savingsLabel: "Worth ~$5–$10/rental",
    venues: ["Niya Scooters"],
    example: "Extra hours or reduced daily rate",
  },
  {
    id: "wellness",
    label: "Wellness / massage perks",
    savingsLabel: "Worth ~$15–$30/visit",
    venues: ["Aksaaya Ayurveda", "Shramalaya", "Senses"],
    example: "Treatment add-on or discounted session",
  },
];

const travelStylePerkDefaults = {
  Surf: ["coffee", "breakfast", "surf", "scooter"],
  Chill: ["coffee", "breakfast", "dinner"],
  Wellness: ["coffee", "breakfast", "wellness"],
  Mixed: ["coffee", "breakfast", "dinner", "scooter", "wellness"],
};

const perkIcons = {
  coffee: "☕",
  breakfast: "🍳",
  dinner: "🍽️",
  surf: "🏄",
  scooter: "🛵",
  wellness: "🧘",
};

const travelStyleUsage = {
  Surf: (nights) => ({
    coffee: nights,
    breakfast: nights,
    dinner: nights,
    surf: 1,
    scooter: 1,
    wellness: 0,
  }),
  Chill: (nights) => ({
    coffee: nights,
    breakfast: nights,
    dinner: nights,
    surf: 0,
    scooter: 1,
    wellness: 1,
  }),
  Wellness: (nights) => ({
    coffee: nights,
    breakfast: nights,
    dinner: nights,
    surf: 0,
    scooter: 0,
    wellness: 1,
  }),
  Mixed: (nights) => ({
    coffee: nights,
    breakfast: nights,
    dinner: nights,
    surf: 1,
    scooter: 1,
    wellness: 1,
  }),
};

const presets = [
  {
    key: "escape",
    label: "2-night escape (Samba)",
    nights: 2,
    accommodationId: "samba",
    travelStyle: "Chill",
    perks: ["coffee", "breakfast", "dinner", "scooter"],
  },
  {
    key: "surf",
    label: "3-day surf trip (UNU)",
    nights: 3,
    accommodationId: "unu",
    travelStyle: "Surf",
    perks: ["coffee", "breakfast", "dinner", "surf", "scooter"],
  },
  {
    key: "wellness",
    label: "5-day luxury stay (Mosvold)",
    nights: 5,
    accommodationId: "mosvold",
    travelStyle: "Mixed",
    perks: ["coffee", "breakfast", "dinner", "scooter", "wellness"],
  },
];

function getBookingComparisonLine(discount) {
  if (typeof discount !== "number" || !Number.isFinite(discount)) return null;
  if (discount >= 0.3) return "Significantly cheaper than Booking.com rates";
  if (discount >= 0.2) return "Typically 20% cheaper than Booking.com rates";
  return "Typically cheaper than standard online rates";
}

function formatUsd(amount) {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

function formatLkr(amount) {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(rounded);
}

function getStrengthLabel(totalUsd) {
  if (totalUsd < 30) return { label: "Low", color: "default" };
  if (totalUsd < 60) return { label: "Good", color: "green" };
  if (totalUsd < 100) return { label: "Strong", color: "cyan" };
  return { label: "Excellent", color: "geekblue" };
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
  const [selectedPerks, setSelectedPerks] = useState([
    "coffee",
    "breakfast",
    "dinner",
    "scooter",
    "wellness",
  ]);

  const stayId = selectedStay ?? internalStayId;

  const setStayId = (nextStayId) => {
    onStayChange?.(nextStayId);
    if (selectedStay == null) setInternalStayId(nextStayId);
  };

  const accommodation = useMemo(() => {
    return accommodations.find((a) => a.id === stayId) ?? accommodations[0];
  }, [stayId]);

  const usage = useMemo(() => {
    const resolver = travelStyleUsage[travelStyle] ?? travelStyleUsage.Mixed;
    return resolver(Math.max(1, Math.min(14, Number(nights) || 1)));
  }, [travelStyle, nights]);

  const savings = useMemo(() => {
    const safeNights = Math.max(1, Math.min(14, Number(nights) || 1));

    const originalStayTotalUsd = safeNights * accommodation.pricePerNightUSD;
    const discountedStayTotalUsd =
      originalStayTotalUsd * (1 - accommodation.discount);
    const staySavingsUsd = originalStayTotalUsd - discountedStayTotalUsd;
    const staySavingsPerNightUsd =
      accommodation.pricePerNightUSD * accommodation.discount;

    const perkSavingsUsdByKey = {};
    for (const perkKey of Object.keys(perkValuesUsd)) {
      const isSelected = selectedPerks.includes(perkKey);
      const uses = usage[perkKey] ?? 0;
      perkSavingsUsdByKey[perkKey] = isSelected
        ? perkValuesUsd[perkKey] * uses
        : 0;
    }

    const foodDrinkSavingsUsd =
      (perkSavingsUsdByKey.coffee || 0) +
      (perkSavingsUsdByKey.breakfast || 0) +
      (perkSavingsUsdByKey.dinner || 0);

    const activitySavingsUsd =
      (perkSavingsUsdByKey.surf || 0) + (perkSavingsUsdByKey.scooter || 0);

    const wellnessSavingsUsd = perkSavingsUsdByKey.wellness || 0;

    const totalUsd =
      staySavingsUsd +
      foodDrinkSavingsUsd +
      activitySavingsUsd +
      wellnessSavingsUsd;

    return {
      safeNights,
      originalStayTotalUsd,
      discountedStayTotalUsd,
      staySavingsPerNightUsd,
      staySavingsUsd,
      foodDrinkSavingsUsd,
      activitySavingsUsd,
      wellnessSavingsUsd,
      totalUsd,
    };
  }, [nights, accommodation, selectedPerks, usage]);

  const strength = useMemo(
    () => getStrengthLabel(savings.totalUsd),
    [savings.totalUsd],
  );

  const progress = useMemo(() => {
    const max = 150;
    const pct = Math.max(0, Math.min(100, (savings.totalUsd / max) * 100));
    return Math.round(pct);
  }, [savings.totalUsd]);

  const persuasiveLine = useMemo(() => {
    if (savings.staySavingsUsd >= 50)
      return "Your stay alone almost covers the pass";
    return "This trip could easily make the pass worth it";
  }, [savings.staySavingsUsd]);

  const selectedPerkTags = useMemo(() => {
    const metaByKey = new Map(perkOptions.map((p) => [p.id, p]));
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
            Estimate Your Ahangama Pass Savings
          </Title>
          <Text
            style={{
              display: "block",
              marginTop: 8,
              color: "rgba(0,0,0,0.62)",
              fontWeight: 650,
            }}
          >
            Choose your stay, your style, and see how much value you could
            unlock in just a few days.
          </Text>
        </div>

        <Space size={8} wrap>
          {presets.map((p) => (
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
                setSelectedPerks(p.perks);
              }}
            >
              {p.label}
            </Button>
          ))}
        </Space>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }} align="stretch">
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
                    options={accommodations.map((a) => ({
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
                            {a.name} — ${a.pricePerNightUSD}/night —{" "}
                            {Math.round(a.discount * 100)}% off
                          </span>
                          <Tag
                            style={{ borderRadius: 999, fontWeight: 900 }}
                            color={
                              a.badge === "Best value"
                                ? "cyan"
                                : a.badge === "Popular"
                                  ? "geekblue"
                                  : "gold"
                            }
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
                    You save{" "}
                    <span style={{ fontWeight: 950 }}>
                      {formatUsd(savings.staySavingsPerNightUsd)}
                    </span>{" "}
                    per night
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.54)", fontWeight: 700 }}>
                    {getBookingComparisonLine(accommodation.discount)}
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 650 }}>
                    {accommodation.comparisonNote}
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
                        travelStylePerkDefaults[nextStyle] ??
                        travelStylePerkDefaults.Mixed;
                      setSelectedPerks(defaults);
                    }}
                    options={["Surf", "Chill", "Wellness", "Mixed"]}
                    block
                  />
                </div>
              </div>

              <div>
                <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                  What do you think you’ll use most?
                </Text>
                <Text
                  style={{
                    display: "block",
                    marginTop: 4,
                    color: "rgba(0,0,0,0.55)",
                    fontWeight: 650,
                  }}
                >
                  Select the kinds of places you’re likely to visit. We’ll
                  estimate your savings using real Ahangama Pass partners.
                </Text>

                <div style={{ marginTop: 10 }}>
                  <div className={perkStyles.perkGrid}>
                    {perkOptions.map((p) => {
                      const isSelected = selectedPerks.includes(p.id);
                      const icon = perkIcons[p.id] ?? "";
                      const venuesLine = (p.venues ?? [])
                        .filter(Boolean)
                        .join(" • ");
                      const cardClassName = [
                        perkStyles.perkCard,
                        isSelected ? perkStyles.perkCardSelected : "",
                      ]
                        .filter(Boolean)
                        .join(" ");
                      const badgeClassName = [
                        perkStyles.savingsBadge,
                        isSelected ? perkStyles.savingsBadgeSelected : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      const toggle = () => {
                        setSelectedPerks((prev) => {
                          if (prev.includes(p.id))
                            return prev.filter((x) => x !== p.id);
                          return [...prev, p.id];
                        });
                      };

                      return (
                        <div
                          key={p.id}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          className={cardClassName}
                          onClick={toggle}
                          onKeyDown={(e) => {
                            if (e.key !== "Enter" && e.key !== " ") return;
                            e.preventDefault();
                            toggle();
                          }}
                        >
                          <div className={perkStyles.topRow}>
                            <div className={perkStyles.headerLeft}>
                              {icon ? (
                                <span
                                  className={perkStyles.icon}
                                  aria-hidden="true"
                                >
                                  {icon}
                                </span>
                              ) : null}
                              <span className={perkStyles.titleText}>
                                {p.label}
                              </span>
                            </div>

                            <div className={perkStyles.headerRight}>
                              <Tag className={badgeClassName}>
                                {p.savingsLabel}
                              </Tag>
                              {isSelected ? (
                                <span
                                  className={perkStyles.check}
                                  aria-hidden="true"
                                >
                                  <CheckOutlined />
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className={perkStyles.venues}>{venuesLine}</div>

                          <div className={perkStyles.example}>{p.example}</div>
                        </div>
                      );
                    })}
                  </div>
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
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Your stay savings
                  </Text>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 34,
                      fontWeight: 950,
                      letterSpacing: -0.7,
                      lineHeight: 1.05,
                      transition: "transform 160ms ease, opacity 160ms ease",
                    }}
                  >
                    You save {formatUsd(savings.staySavingsUsd)} on your stay
                  </div>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "rgba(0,0,0,0.58)",
                      fontWeight: 750,
                    }}
                  >
                    That’s before food, surf, transport, and wellness perks.
                  </Text>
                </div>

                {savings.staySavingsUsd > 100 ? (
                  <Tag
                    color="geekblue"
                    style={{ borderRadius: 999, fontWeight: 950 }}
                  >
                    Stay alone justifies the pass
                  </Tag>
                ) : savings.staySavingsUsd > 50 ? (
                  <Tag
                    color="cyan"
                    style={{ borderRadius: 999, fontWeight: 950 }}
                  >
                    Stay covers most of the pass
                  </Tag>
                ) : null}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: "grid",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <Text style={{ color: "rgba(0,0,0,0.60)", fontWeight: 750 }}>
                    Original total
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.78)", fontWeight: 950 }}>
                    {formatUsd(savings.originalStayTotalUsd)}
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
                    With pass
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.78)", fontWeight: 950 }}>
                    {formatUsd(savings.discountedStayTotalUsd)}
                  </Text>
                </div>
                <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 700 }}>
                  {accommodation.discount >= 0.3
                    ? "Significantly cheaper than Booking.com rates"
                    : accommodation.discount >= 0.2
                      ? "Typically 20% cheaper than Booking.com rates"
                      : "Typically cheaper than standard online rates"}
                </Text>
              </div>
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
              <div>
                <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.78)" }}>
                  Estimated total savings
                </Text>
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 950,
                      letterSpacing: -0.8,
                      lineHeight: 1,
                    }}
                  >
                    {formatUsd(savings.totalUsd)}
                  </div>
                  <Text style={{ color: "rgba(0,0,0,0.55)", fontWeight: 750 }}>
                    {formatLkr(savings.totalUsd * USD_TO_LKR)}
                  </Text>
                </div>
              </div>

              <Tag
                color={strength.color}
                style={{
                  borderRadius: 999,
                  fontWeight: 950,
                  paddingInline: 12,
                }}
              >
                {strength.label}
              </Tag>
            </div>

            <div style={{ marginTop: 10 }}>
              <Text style={{ color: "rgba(0,0,0,0.62)", fontWeight: 750 }}>
                Based on a typical{" "}
                <span style={{ fontWeight: 950 }}>{travelStyle}</span> trip in
                Ahangama
              </Text>

              <div style={{ marginTop: 10 }}>
                <Progress
                  percent={progress}
                  showInfo={false}
                  strokeColor="rgba(22,163,166,0.95)"
                  trailColor="rgba(0,0,0,0.06)"
                />
                <Text style={{ color: "rgba(0,0,0,0.55)", fontWeight: 700 }}>
                  {strength.label} value level
                </Text>
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
                  Select a few perks to see your savings add up.
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
              <div style={{ display: "grid", gap: 10 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontWeight: 850, color: "rgba(0,0,0,0.66)" }}>
                    Stay savings
                  </Text>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.82)" }}>
                    {formatUsd(savings.staySavingsUsd)}
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontWeight: 850, color: "rgba(0,0,0,0.66)" }}>
                    Food & drink savings
                  </Text>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.82)" }}>
                    {formatUsd(savings.foodDrinkSavingsUsd)}
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontWeight: 850, color: "rgba(0,0,0,0.66)" }}>
                    Activity savings
                  </Text>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.82)" }}>
                    {formatUsd(savings.activitySavingsUsd)}
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontWeight: 850, color: "rgba(0,0,0,0.66)" }}>
                    Wellness savings
                  </Text>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.82)" }}>
                    {formatUsd(savings.wellnessSavingsUsd)}
                  </Text>
                </div>
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(22,163,166,0.10)",
                  fontWeight: 900,
                  color: "rgba(0,0,0,0.78)",
                }}
              >
                {persuasiveLine}
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
