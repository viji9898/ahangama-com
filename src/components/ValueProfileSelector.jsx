import { CheckOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useMemo } from "react";
import { ACCOMMODATIONS, VALUE_TILES } from "../utils/tripValueUnlock";
import styles from "./ValueProfileSelector.module.css";

const { Text } = Typography;

function uniq(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    if (!item) continue;
    const key = String(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function compactValueLabel(label) {
  if (!label) return "";
  const text = String(label);
  const match = text.match(
    /\$\s*\d+\s*[–-]\s*\$?\s*\d+(?:\+)?\s*\/\s*[a-zA-Z]+/,
  );
  if (match?.[0]) return match[0].replace(/\s+/g, " ").replace("$ ", "$");
  const matchAlt = text.match(/\$\s*\d+(?:\+)?\s*\/\s*[a-zA-Z]+/);
  if (matchAlt?.[0]) return matchAlt[0].replace(/\s+/g, " ").replace("$ ", "$");
  return text.replace(/^Usually\s+worth\s+/i, "").trim();
}

function formatStayRange(valuePerNight) {
  const nightly = Number(valuePerNight);
  if (!Number.isFinite(nightly) || nightly <= 0) return "";

  const low = Math.max(10, Math.round((nightly * 0.85) / 5) * 5);
  const high = Math.max(low + 5, Math.round((nightly * 1.05) / 5) * 5);
  return `$${low}–$${high}/night`;
}

function SelectionTable({ items, kind }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.selectionTable}>
        <thead>
          <tr>
            <th>Option</th>
            <th>Value</th>
            <th className={styles.selectColumn}>Select</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const rowClassName = [
              styles.tableRow,
              item.selected ? styles.tableRowSelected : "",
              item.locked ? styles.tableRowLocked : "",
              kind === "high" ? styles.tableRowHigh : styles.tableRowExtra,
            ]
              .filter(Boolean)
              .join(" ");

            const handleToggle = () => {
              if (item.locked) return;
              item.onToggle?.();
            };

            return (
              <tr
                key={item.key}
                className={rowClassName}
                tabIndex={item.locked ? -1 : 0}
                aria-selected={item.selected}
                aria-disabled={item.locked || undefined}
                onClick={handleToggle}
                onKeyDown={(event) => {
                  if (item.locked) return;
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  handleToggle();
                }}
              >
                <td>
                  <div className={styles.optionCell}>
                    <span className={styles.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span
                      className={[
                        styles.title,
                        kind === "high"
                          ? styles.titleHighImpact
                          : styles.titleExtra,
                      ].join(" ")}
                    >
                      {item.title}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={styles.valuePill}>
                    {item.valuePillLabel}
                    {item.showArrow ? (
                      <span className={styles.valuePillArrow}>›</span>
                    ) : null}
                  </span>
                </td>
                <td className={styles.selectCell}>
                  <span
                    className={[
                      styles.checkCircle,
                      item.selected || item.locked
                        ? styles.checkCircleSelected
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-hidden="true"
                  >
                    {item.selected || item.locked ? <CheckOutlined /> : null}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ValueProfileSelector({
  selectedKeys,
  onToggleKey,
  selectedStayId,
  stayValuePerNight,
}) {
  const selected = Array.isArray(selectedKeys) ? selectedKeys : [];
  const byId = useMemo(() => new Map(VALUE_TILES.map((t) => [t.id, t])), []);

  const stay = useMemo(() => {
    return (
      ACCOMMODATIONS.find((a) => a.id === selectedStayId) ?? ACCOMMODATIONS[0]
    );
  }, [selectedStayId]);

  const stayPartners = uniq([stay?.name, "UNU Boutique Hotel", "Mosvold Villa"])
    .filter(Boolean)
    .slice(0, 3);

  const stayPill =
    formatStayRange(stayValuePerNight) || compactValueLabel("$50–$60/night");

  const highImpact = [
    {
      key: "stay",
      icon: "🏨",
      title: "Stay value",
      valuePillLabel: stayPill,
      showArrow: false,
      explanation:
        "Better accommodation pricing, upgrades, and late checkout can drive the biggest saving.",
      partners: stayPartners,
      showPartners: true,
      selected: true,
      locked: true,
      onToggle: () => onToggleKey?.("stay"),
    },
    {
      key: "surf",
      ...byId.get("surf"),
      icon: "🏄",
      title: (
        <>
          Surf & activity
          <br />
          value
        </>
      ),
      valuePillLabel: compactValueLabel(
        byId.get("surf")?.valueRangeLabel ?? "$15–$25/session",
      ),
      showArrow: false,
      explanation:
        "Board rental, lesson perks, and bundled experiences add up quickly on short stays.",
      partners: (byId.get("surf")?.venues ?? []).slice(0, 3),
      showPartners: true,
      selected: selected.includes("surf"),
      locked: false,
      onToggle: () => onToggleKey?.("surf"),
    },
    {
      key: "scooter",
      ...byId.get("scooter"),
      icon: "🛵",
      title: (
        <>
          Scooter & transport
          <br />
          value
        </>
      ),
      valuePillLabel: compactValueLabel(
        byId.get("scooter")?.valueRangeLabel ?? "$8–$15/rental",
      ),
      showArrow: true,
      explanation:
        "Local-rate unlocks, extra hours, and multi-day perks make getting around cheaper.",
      partners: (byId.get("scooter")?.venues ?? []).slice(0, 3),
      showPartners: true,
      selected: selected.includes("scooter"),
      locked: false,
      onToggle: () => onToggleKey?.("scooter"),
    },
  ];

  const extras = [
    {
      key: "coffee",
      icon: "☕",
      title: byId.get("coffee")?.label ?? "Coffee perks",
      valuePillLabel: compactValueLabel(
        byId.get("coffee")?.valueRangeLabel ?? "$3–$6/day",
      ),
      showArrow: false,
      explanation: "Free add-ons and better-value café stops.",
      partners: (byId.get("coffee")?.venues ?? []).slice(0, 3),
      showPartners: false,
      selected: selected.includes("coffee"),
      locked: false,
      onToggle: () => onToggleKey?.("coffee"),
    },
    {
      key: "breakfast",
      icon: "🍳",
      title: byId.get("breakfast")?.label ?? "Breakfast perks",
      valuePillLabel: compactValueLabel(
        byId.get("breakfast")?.valueRangeLabel ?? "$5–$10/meal",
      ),
      showArrow: false,
      explanation: "Useful small wins if brunch is part of your routine.",
      partners: (byId.get("breakfast")?.venues ?? []).slice(0, 3),
      showPartners: false,
      selected: selected.includes("breakfast"),
      locked: false,
      onToggle: () => onToggleKey?.("breakfast"),
    },
    {
      key: "dinner",
      icon: "🍽️",
      title: byId.get("dinner")?.label ?? "Dinner perks",
      valuePillLabel: compactValueLabel(
        byId.get("dinner")?.valueRangeLabel ?? "$8–$15/meal",
      ),
      showArrow: true,
      explanation: "Free starters, desserts, or meal-value extras.",
      partners: (byId.get("dinner")?.venues ?? []).slice(0, 3),
      showPartners: false,
      selected: selected.includes("dinner"),
      locked: false,
      onToggle: () => onToggleKey?.("dinner"),
    },
    {
      key: "wellness",
      icon: "🧘",
      title: byId.get("wellness")?.label ?? "Wellness extras",
      valuePillLabel: compactValueLabel(
        byId.get("wellness")?.valueRangeLabel ?? "$15–$30/visit",
      ),
      showArrow: true,
      explanation:
        "Massage add-ons and recovery perks that feel good on longer stays.",
      partners: (byId.get("wellness")?.venues ?? []).slice(0, 3),
      showPartners: false,
      selected: selected.includes("wellness"),
      locked: false,
      onToggle: () => onToggleKey?.("wellness"),
    },
  ];

  return (
    <div className={styles.wrap}>
      <Text className={styles.heading}>Where will you get the most value?</Text>
      <Text className={styles.supporting}>
        Select the perks you’re most likely to use. We’ll estimate your pass
        value based on real Ahangama partners.
      </Text>

      <div>
        <div className={styles.groupTitle}>High-impact value</div>
        <SelectionTable items={highImpact} kind="high" />
      </div>

      <div>
        <div className={styles.groupTitle}>Everyday extras</div>
        <SelectionTable items={extras} kind="extra" />
      </div>
    </div>
  );
}
