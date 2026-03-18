import styles from "./PricingClaritySection.module.css";

type Props = {
  onPrimaryClick?: () => void;
  className?: string;
};

const summaryItems = [
  { label: "Pass price", value: "From $30" },
  { label: "Valid for", value: "Pass Valid for 15 days" },
  {
    label: "Includes",
    value: "🏨 ☕ 🏄 🧘 🏋️ 🌴 🏖️ 🌊 🛵 🍽️ 🧃 ✨",
  },
];

const comparisonItems = [
  {
    label: "Without pass",
    value: "Pay full price",
    detail:
      "Book stays, cafes, surf, and wellness separately at standard rates.",
  },
  {
    label: "With pass",
    value: "One QR unlock",
    detail: "Access selected partner perks instantly across your trip.",
    featured: true,
  },
  {
    label: "Estimated savings",
    value: "$200+",
    detail: "Average value travellers can unlock over a typical Ahangama stay.",
  },
];

export default function PricingClaritySection({
  onPrimaryClick,
  className,
}: Props) {
  return (
    <section
      aria-label="Ahangama Pass pricing clarity"
      className={[styles.section, className].filter(Boolean).join(" ")}
    >
      <div className={styles.header}>
        <p className={styles.kicker}>Pricing clarity</p>
        <h2 className={styles.title}>Know what the pass gets you in seconds</h2>
        <p className={styles.supporting}>
          One simple product: a digital Ahangama Pass that gives you immediate
          access to selected partner savings across the trip.
        </p>
      </div>

      <div className={styles.summaryGrid} role="list" aria-label="Pass summary">
        {summaryItems.map((item) => (
          <div key={item.label} className={styles.summaryCard} role="listitem">
            <p className={styles.summaryLabel}>{item.label}</p>
            <p className={styles.summaryValue}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.compareShell}>
        <div className={styles.compareHeader}>
          <h3 className={styles.compareTitle}>
            What that looks like on a trip
          </h3>
          <p className={styles.compareNote}>
            Simple enough to understand before you even reach the calculator.
          </p>
        </div>

        <div
          className={styles.compareGrid}
          role="list"
          aria-label="Without pass, with pass, and estimated savings"
        >
          {comparisonItems.map((item) => (
            <div
              key={item.label}
              className={[
                styles.compareCard,
                item.featured ? styles.compareCardFeatured : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="listitem"
            >
              <p className={styles.compareLabel}>{item.label}</p>
              <p className={styles.compareValue}>{item.value}</p>
              <p className={styles.compareDetail}>{item.detail}</p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={onPrimaryClick}
          >
            Get the pass
          </button>
          <p className={styles.trustCopy}>
            Use it across selected Ahangama partner venues
          </p>
        </div>
      </div>
    </section>
  );
}
