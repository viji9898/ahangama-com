import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  InputNumber,
  Progress,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";

const { Title, Text } = Typography;

const USD_TO_LKR = 320;

const stays = [
  {
    id: "samba",
    name: "Samba Ahangama",
    pricePerNightUSD: 95,
    discount: 0.3,
    badge: "Best value",
    comparisonNote: "30% off — typically around 20% cheaper than Booking.com",
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

const presets = [
  {
    key: "escape",
    label: "2-night escape (Samba)",
    nights: 2,
    stayId: "samba",
  },
  {
    key: "boutique",
    label: "3-night boutique stay (UNU)",
    nights: 3,
    stayId: "unu",
  },
  {
    key: "luxury",
    label: "5-night luxury stay (Mosvold)",
    nights: 5,
    stayId: "mosvold",
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

function formatLkr(amount) {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
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

function getBookingLine(stayId) {
  return stayId === "samba"
    ? "Significantly cheaper than Booking.com rates"
    : "Typically cheaper than Booking.com rates";
}

function getSavingsLevelLabel(savingsUsd) {
  if (savingsUsd < 40) return { label: "Good", color: "green" };
  if (savingsUsd < 80) return { label: "Strong", color: "cyan" };
  return { label: "Excellent", color: "geekblue" };
}

export default function StaySavingsCalculator({
  defaultStayId,
  defaultNights,
  onStayChange,
  onGetPassClick,
  onViewAllStayPartnersClick,
  className,
}) {
  const [stayId, setStayId] = useState(defaultStayId ?? "samba");
  const [nights, setNights] = useState(
    typeof defaultNights === "number" && Number.isFinite(defaultNights)
      ? defaultNights
      : 2,
  );

  const stay = useMemo(() => {
    return stays.find((s) => s.id === stayId) ?? stays[0];
  }, [stayId]);

  const safeNights = useMemo(() => {
    const n = Number(nights) || 1;
    return Math.max(1, Math.min(30, Math.round(n)));
  }, [nights]);

  const computed = useMemo(() => {
    const originalTotal = safeNights * stay.pricePerNightUSD;
    const discountAmount = originalTotal * stay.discount;
    const discountedTotal = originalTotal - discountAmount;
    const savingsPerNight = stay.pricePerNightUSD * stay.discount;
    const lkrSavings = discountAmount * USD_TO_LKR;

    return {
      originalTotal,
      discountAmount,
      discountedTotal,
      savingsPerNight,
      lkrSavings,
    };
  }, [safeNights, stay]);

  const savingsTag = useMemo(() => {
    const s = computed.discountAmount;
    if (s >= 100)
      return { label: "Stay alone justifies the pass", color: "geekblue" };
    if (s >= 50)
      return { label: "Stay covers most of the pass", color: "cyan" };
    return { label: "Strong accommodation value", color: "green" };
  }, [computed.discountAmount]);

  const savingsLevel = useMemo(
    () => getSavingsLevelLabel(computed.discountAmount),
    [computed.discountAmount],
  );

  const savingsBarPercent = useMemo(() => {
    const max = 120;
    const pct = (computed.discountAmount / max) * 100;
    return Math.max(0, Math.min(100, Math.round(pct)));
  }, [computed.discountAmount]);

  const handleStayChange = (nextStayId) => {
    setStayId(nextStayId);
    onStayChange?.(nextStayId);
  };

  return (
    <section
      aria-label="Stay savings calculator"
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
      <div>
        <Title
          level={2}
          style={{ margin: 0, fontWeight: 950, letterSpacing: -0.6 }}
        >
          Estimate your stay savings
        </Title>
        <Text
          style={{
            display: "block",
            marginTop: 8,
            color: "rgba(0,0,0,0.62)",
            fontWeight: 650,
            maxWidth: 980,
          }}
        >
          Choose your stay and number of nights to see how much you could save
          on accommodation alone with the Ahangama Pass.
        </Text>

        <div style={{ marginTop: 12 }}>
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
                  handleStayChange(p.stayId);
                }}
              >
                {p.label}
              </Button>
            ))}
          </Space>
        </div>
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
                    max={30}
                    value={safeNights}
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
                    onChange={handleStayChange}
                    style={{ width: "100%" }}
                    optionLabelProp="label"
                    options={stays.map((s) => {
                      const discountPct = Math.round(s.discount * 100);
                      const badge = getBadgeStyle(s.badge);

                      return {
                        value: s.id,
                        label: `${s.name} — $${s.pricePerNightUSD}/night — ${discountPct}% off`,
                        search: `${s.name} ${s.pricePerNightUSD} ${discountPct} ${s.badge}`,

                        // AntD Select uses `label` for the input display (optionLabelProp)
                        // and `children`/`label` rendering for dropdown depending on version.
                        // We keep label as string and provide a rich `label` via `optionRender` below.
                      };
                    })}
                    optionRender={(option) => {
                      const s =
                        stays.find((x) => x.id === option.value) ?? stays[0];
                      const discountPct = Math.round(s.discount * 100);
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
                            {s.name} — ${s.pricePerNightUSD}/night —{" "}
                            {discountPct}% off
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

                <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
                  <Text style={{ color: "rgba(0,0,0,0.58)", fontWeight: 750 }}>
                    You save{" "}
                    <span style={{ fontWeight: 950 }}>
                      {formatUsd(computed.savingsPerNight)}
                    </span>{" "}
                    per night
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.54)", fontWeight: 700 }}>
                    {getBookingLine(stayId)}
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 650 }}>
                    {stay.comparisonNote}
                  </Text>
                </div>

                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    borderRadius: 16,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.72)",
                    fontWeight: 850,
                    color: "rgba(0,0,0,0.72)",
                  }}
                >
                  Tip: the pass can be worth it from your hotel booking alone.
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
                      color: "rgba(0,0,0,0.86)",
                    }}
                  >
                    You save {formatUsd(computed.discountAmount)} on your stay
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

                <Tag
                  color={savingsTag.color}
                  style={{ borderRadius: 999, fontWeight: 950 }}
                >
                  {savingsTag.label}
                </Tag>
              </div>

              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Text style={{ color: "rgba(0,0,0,0.62)", fontWeight: 800 }}>
                    {savingsLevel.label} savings
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.62)", fontWeight: 800 }}>
                    {formatUsd(computed.discountAmount)}
                  </Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Progress
                    percent={savingsBarPercent}
                    showInfo={false}
                    strokeColor={
                      savingsLevel.color === "geekblue"
                        ? "rgba(64, 99, 255, 0.95)"
                        : savingsLevel.color === "cyan"
                          ? "rgba(22,163,166,0.95)"
                          : "rgba(34,197,94,0.95)"
                    }
                    trailColor="rgba(0,0,0,0.06)"
                  />
                  <Text style={{ color: "rgba(0,0,0,0.55)", fontWeight: 700 }}>
                    Under $40 = Good • $40–$80 = Strong • $80+ = Excellent
                  </Text>
                </div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
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
                    {formatUsd(computed.originalTotal)}
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
                    {formatUsd(computed.discountedTotal)}
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
                    Savings per night
                  </Text>
                  <Text style={{ color: "rgba(0,0,0,0.78)", fontWeight: 950 }}>
                    {formatUsd(computed.savingsPerNight)}
                  </Text>
                </div>

                <Text style={{ color: "rgba(0,0,0,0.52)", fontWeight: 700 }}>
                  {getBookingLine(stayId)}
                </Text>
              </div>

              <div
                style={{
                  marginTop: 12,
                  padding: "10px 12px",
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                <Text style={{ color: "rgba(0,0,0,0.62)", fontWeight: 850 }}>
                  {formatLkr(computed.lkrSavings)} approximate savings
                </Text>
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
                onClick={() => {
                  if (onGetPassClick) return onGetPassClick();
                  window.open(
                    "https://pass.ahangama.com",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
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
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  onViewAllStayPartnersClick?.();
                }}
              >
                View all stay partners
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
