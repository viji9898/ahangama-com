import styles from "./TripPlannerHero.module.css";
import heroPassAppleWalletPng from "../assets/hero_pass_apple_wallet.png";
import heroBackgroundJpg from "../assets/hero_backgound.png";

type Props = {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
};

function SparkleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9L12 2z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M19 14l.9 3.2L23 18l-3.1.8L19 22l-.9-3.2L15 18l3.1-.8L19 14z"
        fill="currentColor"
        opacity="0.65"
      />
    </svg>
  );
}

export function TripPlannerHero({
  onPrimaryClick,
  onSecondaryClick,
  className,
}: Props) {
  return (
    <section
      aria-label="Trip planner hero"
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <div className={styles.shell}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrow}>Ahangama Pass</span>
              <span className={styles.eyebrowNote}>
                Wallet-ready digital access
              </span>
            </div>

            <h1 className={styles.title}>
              <span className={styles.titleLead}>One pass for the best of</span>
              <span className={styles.emphasis}>Ahangama</span>
              <span className={styles.titleTail}>Do More | Payless</span>
            </h1>

            <p className={styles.subtext}>
              One digital pass for stays, cafes, surf, wellness, and more in
              Ahangama.
            </p>

            <div className={styles.ctaRow} aria-label="Hero calls to action">
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onPrimaryClick}
              >
                Get your pass
              </button>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onSecondaryClick}
              >
                Preview your savings
              </button>
            </div>

            <p className={styles.microcopy}>
              Instant QR access • Use across 100+ venues
            </p>

            <div className={styles.metaRow} aria-label="Hero product benefits">
              <span className={styles.metaPill}>Instant delivery</span>
              <span className={styles.metaPill}>Apple &amp; Google Wallet</span>
              <span className={styles.metaPill}>Use it the same day</span>
            </div>
          </div>

          <div className={styles.right} aria-label="App mockup">
            <div className={styles.phoneWrap}>
              <img
                className={styles.phoneBackdrop}
                src={heroBackgroundJpg}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <div className={styles.productBadge}>
                <span className={styles.productBadgeLabel}>
                  Live pass preview
                </span>
                <span className={styles.productBadgeValue}>
                  QR access in seconds
                </span>
              </div>
              <div className={[styles.floatPhoto, styles.float1].join(" ")} />
              <div
                className={[
                  styles.floatPhoto,
                  styles.floatPhoto2,
                  styles.float2,
                ].join(" ")}
              />
              <div className={[styles.sparkle, styles.sparkle1].join(" ")}>
                <SparkleIcon size={22} />
              </div>
              <div className={[styles.sparkle, styles.sparkle2].join(" ")}>
                <SparkleIcon size={18} />
              </div>

              <div className={styles.phone}>
                <div className={styles.notch} aria-hidden="true" />

                <div className={styles.screen}>
                  <div className={styles.appHeader}>
                    <div className={styles.logo}>
                      <span className={styles.logoDot} aria-hidden="true" />
                    </div>

                    <div className={styles.tripMeta}></div>
                  </div>

                  <div
                    className={styles.tabs}
                    role="tablist"
                    aria-label="Days"
                  ></div>

                  <div className={styles.card} aria-label="Attraction card">
                    <div className={styles.cardImage} aria-hidden="true">
                      <img
                        className={styles.cardImageImg}
                        src={heroPassAppleWalletPng}
                        alt=""
                        draggable={false}
                      />
                    </div>
                    <div className={styles.cardBody}></div>
                  </div>

                  <div className={styles.directions}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
