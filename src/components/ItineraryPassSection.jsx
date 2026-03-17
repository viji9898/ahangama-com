import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import styles from "./ItineraryPassSection.module.css";

const passOptions = [
  {
    key: "2-day",
    title: "2-Day Pass",
    typicalSavings: "Typical savings $25–35",
    passPrice: "$29",
    withoutPass: "$55–64",
    savingsText: "You save $25–35",
    isPopular: false,
    days: [
      {
        label: "Day 1",
        items: ["Coffee & breakfast", "Beach lunch", "Sunset drinks"],
      },
      {
        label: "Day 2",
        items: ["Surf or activity", "Healthy lunch", "Dinner out"],
      },
    ],
    expandedDays: 2,
  },
  {
    key: "4-day",
    title: "4-Day Pass",
    typicalSavings: "Typical savings $40–60",
    passPrice: "$49",
    withoutPass: "$89–109",
    savingsText: "You save $40–60",
    isPopular: true,
    days: [
      {
        label: "Day 1",
        items: ["Coffee & breakfast", "Beach lunch", "Sunset drinks"],
      },
      {
        label: "Day 2",
        items: ["Surf or activity", "Smoothie bowl", "Dinner out"],
      },
      {
        label: "Day 3",
        items: ["Yoga or wellness", "Coffee & cowork", "Shopping perk"],
      },
      {
        label: "Day 4",
        items: ["Brunch", "Beach club or café", "Cocktails or dinner"],
      },
    ],
    expandedDays: 1,
  },
  {
    key: "6-day",
    title: "6-Day Pass",
    typicalSavings: "Typical savings $70–100",
    passPrice: "$69",
    withoutPass: "$139–169",
    savingsText: "You save $70–100",
    isPopular: false,
    days: [
      {
        label: "Day 1",
        items: ["Coffee & breakfast", "Beach lunch", "Sunset drinks"],
      },
      {
        label: "Day 2",
        items: ["Surf or activity", "Smoothie bowl", "Dinner out"],
      },
      {
        label: "Day 3",
        items: ["Yoga or wellness", "Coffee & cowork", "Shopping perk"],
      },
      {
        label: "Day 4",
        items: ["Brunch", "Café hopping", "Dinner out"],
      },
      {
        label: "Day 5",
        items: ["Wellness treatment", "Lunch by the beach", "Sunset cocktails"],
      },
      {
        label: "Day 6",
        items: ["Breakfast", "Last-minute shopping", "Final dinner"],
      },
    ],
    expandedDays: 1,
  },
];

function DayTimeline({ days, expandedDays }) {
  return (
    <div className={styles.timeline} aria-label="Sample itinerary timeline">
      {days.map((day, index) => {
        const isExpanded = index < expandedDays;
        const dotClassName = [
          styles.dot,
          isExpanded ? styles.dotActive : styles.dotInactive,
        ].join(" ");

        const summary = day.items.slice(0, 2).join(" • ");

        return (
          <div key={day.label} className={styles.dayRow}>
            <div className={styles.dotCol} aria-hidden="true">
              <div className={dotClassName} />
            </div>

            <div>
              <div className={styles.dayHeader}>
                <div className={styles.dayLabel}>{day.label}</div>
                {!isExpanded ? (
                  <div className={styles.daySummary}>{summary}</div>
                ) : null}
              </div>

              {isExpanded ? (
                <ul className={styles.itemList}>
                  {day.items.slice(0, 3).map((item) => (
                    <li key={item} className={styles.item}>
                      <span className={styles.bullet} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PassCard({ option, onViewSampleItineraryClick }) {
  return (
    <div style={{ position: "relative", height: "100%" }}>
      <Card
        className={[
          styles.passCard,
          option.isPopular ? styles.passCardPopular : "",
        ]
          .filter(Boolean)
          .join(" ")}
        styles={{ body: { padding: 0 } }}
      >
        <div className={styles.passCardBody}>
          <div className={styles.cardTop}>
            {option.isPopular ? (
              <div className={styles.popularBadge}>Most Popular</div>
            ) : null}

            <h3 className={styles.passTitle}>{option.title}</h3>
            <span className={styles.sampleLabel}>Sample itinerary</span>

            <div className={styles.savingsChip}>
              <span className={styles.savingsChipStrong}>
                {option.typicalSavings}
              </span>
              <span className={styles.savingsChipMuted}>
                based on typical spend
              </span>
            </div>
          </div>

          <DayTimeline days={option.days} expandedDays={option.expandedDays} />

          <Button
            type="link"
            className={styles.viewLink}
            icon={<ArrowRightOutlined />}
            onClick={() => onViewSampleItineraryClick?.(option.key)}
          >
            View sample itinerary
          </Button>

          <div className={styles.pricing} aria-label="Pricing summary">
            <div className={styles.pricingGrid}>
              <div>
                <div className={styles.priceLabel}>Pass price</div>
                <div className={styles.priceValue}>{option.passPrice}</div>
              </div>

              <div>
                <div className={styles.priceLabel}>Without pass</div>
                <div className={styles.priceValueMuted}>
                  {option.withoutPass}
                </div>
              </div>

              <div className={styles.savingsLine}>{option.savingsText}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * Desktop-first section for comparing pass options with sample itineraries.
 */
export function ItineraryPassSection({
  className,
  onGetPassClick,
  onSeeAllBenefitsClick,
  onViewSampleItineraryClick,
}) {
  return (
    <section
      aria-label="Choose your stay"
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <div className={styles.header}>
        <div>
          <Typography.Title level={2} className={styles.title}>
            Choose your stay
          </Typography.Title>
          <p className={styles.subtitle}>
            Simple itineraries built around your time in Ahangama. Save across
            coffee, food, surf, wellness and more.
          </p>
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.cardsScroller} role="list">
          {passOptions.map((option) => (
            <div key={option.key} className={styles.cardItem} role="listitem">
              <PassCard
                option={option}
                onViewSampleItineraryClick={onViewSampleItineraryClick}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaRow} aria-label="Section CTA">
        <div className={styles.ctaInner}>
          <Button
            type="primary"
            size="large"
            className={styles.getPassBtn}
            onClick={onGetPassClick}
          >
            Get the Pass
          </Button>
          <Button type="link" onClick={onSeeAllBenefitsClick}>
            See all benefits
          </Button>
        </div>
      </div>
    </section>
  );
}
