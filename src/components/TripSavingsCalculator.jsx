import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Card,
  Col,
  InputNumber,
  Row,
  Segmented,
  Space,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useMemo, useState } from "react";
import { calculateTripSavings } from "../utils/savingsEngine";
import styles from "./TripSavingsCalculator.module.css";

const { Title, Text } = Typography;

function formatUsd(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

const PRESETS = [
  { label: "2 days", nights: 2 },
  { label: "5 days", nights: 5 },
  { label: "14 days", nights: 14 },
];

function getPresetDefaults(nights) {
  const n = Math.max(1, Math.min(60, Number(nights) || 2));
  if (n <= 2) {
    return {
      breakfasts: 1,
      lunches: 1,
      dinners: 1,
      scooterDays: 1,
      vehicleDays: 0,
      surfSessions: 1,
      wellnessSessions: 0,
      experienceSessions: 0,
      coworkingDays: 0,
    };
  }

  if (n <= 5) {
    return {
      breakfasts: 1,
      lunches: 1,
      dinners: 1,
      scooterDays: 3,
      vehicleDays: 0,
      surfSessions: 1,
      wellnessSessions: 1,
      experienceSessions: 0,
      coworkingDays: 0,
    };
  }

  return {
    breakfasts: 1,
    lunches: 1,
    dinners: 1,
    scooterDays: Math.round(n / 2),
    vehicleDays: 0,
    surfSessions: 3,
    wellnessSessions: 2,
    experienceSessions: 1,
    coworkingDays: 5,
  };
}

export default function TripSavingsCalculator({ className }) {
  const [preset, setPreset] = useState(PRESETS[1].label);
  const [nights, setNights] = useState(5);
  const [activeOnly, setActiveOnly] = useState(true);

  const [breakfasts, setBreakfasts] = useState(1);
  const [lunches, setLunches] = useState(1);
  const [dinners, setDinners] = useState(1);
  const [scooterDays, setScooterDays] = useState(3);
  const [vehicleDays, setVehicleDays] = useState(0);
  const [surfSessions, setSurfSessions] = useState(1);
  const [wellnessSessions, setWellnessSessions] = useState(1);
  const [experienceSessions, setExperienceSessions] = useState(0);
  const [coworkingDays, setCoworkingDays] = useState(0);

  const result = useMemo(() => {
    return calculateTripSavings({
      nights,
      breakfasts,
      lunches,
      dinners,
      scooterDays,
      vehicleDays,
      surfSessions,
      wellnessSessions,
      experienceSessions,
      coworkingDays,
      activeOnly,
    });
  }, [
    nights,
    breakfasts,
    lunches,
    dinners,
    scooterDays,
    vehicleDays,
    surfSessions,
    wellnessSessions,
    experienceSessions,
    coworkingDays,
    activeOnly,
  ]);

  const breakdown = result?.breakdown ?? {};

  const prioritized = [
    { key: "stay", label: "Stay" },
    { key: "experiences", label: "Experiences" },
    { key: "scooter", label: "Transport (scooter)" },
    { key: "breakfast", label: "Breakfast" },
    { key: "lunch", label: "Lunch" },
    { key: "dinner", label: "Dinner" },
    { key: "coworking", label: "Coworking" },
    { key: "vehicle", label: "Vehicle rental" },
  ];

  return (
    <section aria-label="Trip Savings Calculator" className={className}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div>
            <Title
              level={2}
              style={{ margin: 0, fontWeight: 950, letterSpacing: -0.6 }}
            >
              Trip Savings Calculator
            </Title>
            <Text className={styles.sub}>
              Estimates are driven by current Ahangama Pass venues and typical
              spend.
            </Text>
          </div>

          <Space size={10} wrap>
            <Segmented
              value={preset}
              options={PRESETS.map((p) => p.label)}
              onChange={(next) => {
                const label = String(next);
                setPreset(label);
                const selected =
                  PRESETS.find((p) => p.label === label) ?? PRESETS[1];
                setNights(selected.nights);

                const defaults = getPresetDefaults(selected.nights);
                setBreakfasts(defaults.breakfasts);
                setLunches(defaults.lunches);
                setDinners(defaults.dinners);
                setScooterDays(defaults.scooterDays);
                setVehicleDays(defaults.vehicleDays);
                setSurfSessions(defaults.surfSessions);
                setWellnessSessions(defaults.wellnessSessions);
                setExperienceSessions(defaults.experienceSessions);
                setCoworkingDays(defaults.coworkingDays);
              }}
            />

            <Space size={8}>
              <Text style={{ fontWeight: 850, color: "rgba(0,0,0,0.66)" }}>
                Active only
              </Text>
              <Switch checked={activeOnly} onChange={setActiveOnly} />
            </Space>
          </Space>
        </div>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }} align="stretch">
          <Col xs={24} md={10}>
            <Card className={styles.kpiCard} styles={{ body: { padding: 16 } }}>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                    Trip length (nights)
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <InputNumber
                      min={1}
                      max={60}
                      value={nights}
                      onChange={(v) => setNights(v ?? 5)}
                      style={{ width: "100%", borderRadius: 14 }}
                    />
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Breakfasts / day
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={6}
                        value={breakfasts}
                        onChange={(v) => setBreakfasts(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Lunches / day
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={6}
                        value={lunches}
                        onChange={(v) => setLunches(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Dinners / day
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={6}
                        value={dinners}
                        onChange={(v) => setDinners(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Scooter days
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={60}
                        value={scooterDays}
                        onChange={(v) => setScooterDays(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Surf sessions
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={200}
                        value={surfSessions}
                        onChange={(v) => setSurfSessions(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Wellness sessions
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={200}
                        value={wellnessSessions}
                        onChange={(v) => setWellnessSessions(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Other experiences
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={200}
                        value={experienceSessions}
                        onChange={(v) => setExperienceSessions(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}
                    >
                      Coworking days
                    </Text>
                    <div style={{ marginTop: 8 }}>
                      <InputNumber
                        min={0}
                        max={60}
                        value={coworkingDays}
                        onChange={(v) => setCoworkingDays(v ?? 0)}
                        style={{ width: "100%", borderRadius: 14 }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Text style={{ fontWeight: 900, color: "rgba(0,0,0,0.82)" }}>
                    Vehicle rental days
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 4,
                      color: "rgba(0,0,0,0.55)",
                      fontWeight: 650,
                    }}
                  >
                    Included for future support. If no vehicle-rental venue
                    exists, savings stays at $0.
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <InputNumber
                      min={0}
                      max={60}
                      value={vehicleDays}
                      onChange={(v) => setVehicleDays(v ?? 0)}
                      style={{ width: "100%", borderRadius: 14 }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card
              className={styles.accentCard}
              styles={{ body: { padding: 16 } }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Estimated total savings
                  </Text>
                  <div className={styles.bigNumber} style={{ marginTop: 6 }}>
                    {formatUsd(result.totalSavings)}
                  </div>
                  <Text
                    className={styles.smallMuted}
                    style={{ display: "block", marginTop: 6 }}
                  >
                    {result.summary}
                  </Text>
                </div>

                <div className={styles.pillRow}>
                  {(result.highlights ?? []).map((h) => (
                    <Tag
                      key={h}
                      color="cyan"
                      icon={<CheckCircleOutlined />}
                      style={{ borderRadius: 999, fontWeight: 900 }}
                    >
                      {h}
                    </Tag>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                {prioritized.map((c) => {
                  const total = Number(breakdown?.[c.key]?.total) || 0;
                  const venues = breakdown?.[c.key]?.venues ?? [];
                  if (total <= 0 && venues.length === 0) return null;
                  return (
                    <div
                      key={c.key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        alignItems: "baseline",
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        paddingTop: 10,
                      }}
                    >
                      <div>
                        <Text
                          style={{ fontWeight: 900, color: "rgba(0,0,0,0.70)" }}
                        >
                          {c.label}
                        </Text>
                        {venues.length > 0 ? (
                          <div
                            style={{ marginTop: 6 }}
                            className={styles.pillRow}
                          >
                            {venues.slice(0, 3).map((v) => (
                              <Tag
                                key={v.id}
                                style={{
                                  borderRadius: 999,
                                  fontWeight: 850,
                                  background: "rgba(255,255,255,0.86)",
                                  borderColor: "rgba(0,0,0,0.10)",
                                }}
                              >
                                {v.name}
                              </Tag>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <Text
                        style={{ fontWeight: 950, color: "rgba(0,0,0,0.84)" }}
                      >
                        {formatUsd(total)}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} md={12}>
                <Card
                  className={styles.kpiCard}
                  styles={{ body: { padding: 16 } }}
                >
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Venues used in estimate
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "rgba(0,0,0,0.55)",
                      fontWeight: 650,
                    }}
                  >
                    These are the best-matching active venues the engine used.
                  </Text>

                  <div style={{ marginTop: 10 }} className={styles.pillRow}>
                    {(result.recommendedVenues ?? []).slice(0, 18).map((v) => (
                      <Tag
                        key={v.id}
                        style={{
                          borderRadius: 999,
                          fontWeight: 850,
                          background: "rgba(22,163,166,0.10)",
                          borderColor: "rgba(22,163,166,0.18)",
                        }}
                      >
                        {v.name}
                      </Tag>
                    ))}
                    {!result.recommendedVenues ||
                    result.recommendedVenues.length === 0 ? (
                      <Text
                        style={{ color: "rgba(0,0,0,0.55)", fontWeight: 700 }}
                      >
                        No venues found for this combination.
                      </Text>
                    ) : null}
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  className={styles.kpiCard}
                  styles={{ body: { padding: 16 } }}
                >
                  <Text style={{ fontWeight: 950, color: "rgba(0,0,0,0.78)" }}>
                    Best value venues
                  </Text>
                  <Text
                    style={{
                      display: "block",
                      marginTop: 6,
                      color: "rgba(0,0,0,0.55)",
                      fontWeight: 650,
                    }}
                  >
                    Highest estimated savings impact for your inputs.
                  </Text>

                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {(result.bestValueVenues ?? []).slice(0, 6).map((v) => (
                      <div
                        key={v.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <Text
                          style={{ fontWeight: 850, color: "rgba(0,0,0,0.70)" }}
                        >
                          {v.name}
                        </Text>
                        <Text
                          style={{ fontWeight: 950, color: "rgba(0,0,0,0.84)" }}
                        >
                          {formatUsd(v.savingsUsd)}
                        </Text>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>

            <div style={{ marginTop: 12 }}>
              <Text style={{ color: "rgba(0,0,0,0.55)", fontWeight: 650 }}>
                {result.disclaimer}
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
}
