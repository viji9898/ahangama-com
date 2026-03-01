import {
  CheckOutlined,
  CompassOutlined,
  GiftOutlined,
  QrcodeOutlined,
  RightOutlined,
  ShoppingOutlined,
  ThunderboltOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Grid,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PassLanding.module.css";
import addToAppleWallet from "../../assets/add_to_apple_wallet.png";
import addToGoogleWallet from "../../assets/add_to_google_wallet.png";
import { useVenues } from "../../hooks/useVenues";
import { sortVenues } from "../../utils/venueList";
import type { Venue } from "../../types/venue";

type FeaturedCategory = "Eat" | "Stay" | "Surf" | "Wellness";

type FeaturedVenueCard = {
  id: string | number;
  name: string;
  perk: string;
  category: FeaturedCategory;
  logoUrl?: string | null;
};

type UTMKeys = "utm_source" | "utm_medium" | "utm_campaign";

const BUY_BASE_URL = "https://ahangamapass.com/buy";

function buildBuyUrl(search: string): string {
  const current = new URLSearchParams(search);

  const out = new URL(BUY_BASE_URL);

  const utmSource = current.get("utm_source") || "home_pass_page";
  out.searchParams.set("utm_source", utmSource);

  const keys: UTMKeys[] = ["utm_medium", "utm_campaign"];
  for (const key of keys) {
    const value = current.get(key);
    if (value) out.searchParams.set(key, value);
  }

  return out.toString();
}

function fireBuyClickEvent() {
  const gtag = (window as any)?.gtag as ((...args: any[]) => void) | undefined;

  if (!gtag) return;

  gtag("event", "pass_buy_click", {
    event_category: "conversion",
    event_label: "pass_landing",
  });
}

function getFeaturedCategory(venue: Venue): FeaturedCategory {
  const parts = [venue.categories ?? [], venue.tags ?? [], venue.bestFor ?? []]
    .flat()
    .filter((x): x is string => typeof x === "string")
    .map((x) => x.toLowerCase());

  const has = (needle: string) => parts.some((p) => p.includes(needle));

  if (has("surf") || has("board") || has("lesson") || has("rent"))
    return "Surf";

  if (
    has("wellness") ||
    has("yoga") ||
    has("spa") ||
    has("massage") ||
    has("gym")
  )
    return "Wellness";

  if (
    has("stay") ||
    has("hotel") ||
    has("villa") ||
    has("hostel") ||
    has("guest") ||
    has("accommodation")
  )
    return "Stay";

  return "Eat";
}

export function PassLanding() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const location = useLocation();

  const heroRef = useRef<HTMLElement | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [example10Expanded, setExample10Expanded] = useState(false);

  const { venues, loading: venuesLoading } = useVenues({
    destinationSlug: "ahangama",
    liveOnly: true,
  });

  const buyUrl = useMemo(() => buildBuyUrl(location.search), [location.search]);

  const featuredVenues = useMemo<FeaturedVenueCard[]>(() => {
    const curated = sortVenues(venues, "curated");

    const passWithPerk = curated.filter(
      (v) => v.isPassVenue && (v.cardPerk ?? "").trim().length > 0,
    );

    const out: FeaturedVenueCard[] = [];
    for (const v of passWithPerk) {
      out.push({
        id: v.id,
        name: v.name,
        perk: String(v.cardPerk).trim(),
        category: getFeaturedCategory(v),
        logoUrl: v.logo,
      });
      if (out.length >= 8) break;
    }

    return out;
  }, [venues]);

  const handleBuyClick = useCallback(() => {
    fireBuyClickEvent();
  }, []);

  const handleScrollToHowItWorks = useCallback(() => {
    const el = document.getElementById("how-it-works");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isMobile = !screens.md;

  useEffect(() => {
    if (!isMobile) setExample10Expanded(false);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setShowStickyBar(false);
      return;
    }

    const el = heroRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => {
        const rect = el.getBoundingClientRect();
        setShowStickyBar(rect.bottom <= 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  const valuePropBodyStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 13,
    lineHeight: "18px",
  };

  type ExampleLineItem = {
    label: string;
    amountLkr: number;
    rightText?: string;
    url?: string;
  };

  const example3Night = [
    {
      label: "Samba (3 nights)",
      amountLkr: 7200,
      url: "https://www.booking.com/hotel/lk/samba-ahangama.en-gb.html?aid=318615&label=New_English_EN_LK_27027142825-OOHRKEm2e9cX4E5_mJSvaAS640874803405%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atidsa-199482273865%3Alp9199150%3Ali%3Adec%3Adm%3Aag27027142825%3Acmp400679785&sid=10f134a36ba2acd9b78a81bae2a4e631&all_sr_blocks=1066331402_379037783_1_42_0%2C1066331402_379037783_1_42_0&checkin=2026-03-23&checkout=2026-03-26&dest_id=-2211655&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&highlighted_blocks=1066331402_379037783_1_42_0%2C1066331402_379037783_1_42_0&hpos=1&matching_block_id=1066331402_379037783_1_42_0&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&show_room=1066331402&sr_order=popularity&sr_pri_blocks=1066331402_379037783_1_42_0__6801%2C1066331402_379037783_1_42_0__6801&srepoch=1772130737&srpvid=c7fb8257ba280140&type=total&ucfs=1#RD1066331402",
    },
    {
      label: "Coffee at Kaffi",
      amountLkr: 130 * 3,
      rightText: "Save LKR 130 × 3",
      url: "https://maps.app.goo.gl/K1S599WottPMZRd28",
    },
    {
      label: "Board Hut surf hour",
      amountLkr: 1200,
    },
    {
      label: "Niya Scooter hire",
      amountLkr: 2000,
    },
    {
      label: "Free 30-minute massage",
      amountLkr: 2500,
    },
  ] satisfies ReadonlyArray<ExampleLineItem>;

  const example10Day = [
    {
      label: "Samba (3 nights)",
      amountLkr: 7200,
      url: "https://www.booking.com/hotel/lk/samba-ahangama.en-gb.html?aid=318615&label=New_English_EN_LK_27027142825-OOHRKEm2e9cX4E5_mJSvaAS640874803405%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atidsa-199482273865%3Alp9199150%3Ali%3Adec%3Adm%3Aag27027142825%3Acmp400679785&sid=10f134a36ba2acd9b78a81bae2a4e631&all_sr_blocks=1066331402_379037783_1_42_0%2C1066331402_379037783_1_42_0&checkin=2026-03-23&checkout=2026-03-26&dest_id=-2211655&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&highlighted_blocks=1066331402_379037783_1_42_0%2C1066331402_379037783_1_42_0&hpos=1&matching_block_id=1066331402_379037783_1_42_0&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&show_room=1066331402&sr_order=popularity&sr_pri_blocks=1066331402_379037783_1_42_0__6801%2C1066331402_379037783_1_42_0__6801&srepoch=1772130737&srpvid=c7fb8257ba280140&type=total&ucfs=1#RD1066331402",
    },
    {
      label: "Coffee at Kaffi",
      amountLkr: 130 * 8,
      rightText: "Save LKR 130 × 8",
      url: "https://maps.app.goo.gl/K1S599WottPMZRd28",
    },
    {
      label: "Board Hut surf hour ×3",
      amountLkr: 1200 * 3,
    },
    {
      label: "Niya Scooter hire",
      amountLkr: 2000,
    },
    {
      label: "Free 30-minute massage ×2",
      amountLkr: 2500 * 2,
    },
  ] satisfies ReadonlyArray<ExampleLineItem>;

  const sumExample = (items: ReadonlyArray<ExampleLineItem>) =>
    items.reduce((sum, item) => sum + item.amountLkr, 0);

  const LKR_PER_USD_APPROX = 320;

  const example3NightTotal = sumExample(example3Night);
  const example3NightTotalUsdApprox = Math.round(
    example3NightTotal / LKR_PER_USD_APPROX,
  );

  const example10DayTotal = sumExample(example10Day);
  const example10DayTotalUsdApprox = Math.round(
    example10DayTotal / LKR_PER_USD_APPROX,
  );

  const formatLkr = (value: number) => value.toLocaleString();

  return (
    <div className={styles.page}>
      <header className={styles.hero} ref={heroRef}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <Space
              direction="vertical"
              size={isMobile ? 10 : 14}
              style={{ width: "100%" }}
            >
              <div>
                <Typography.Title
                  level={1}
                  style={{
                    margin: 0,
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    fontSize: isMobile ? 38 : 52,
                    lineHeight: isMobile ? "42px" : "56px",
                  }}
                >
                  Ahangama Pass. Premium perks, instant savings.
                </Typography.Title>

                <Typography.Text
                  strong
                  style={{
                    display: "block",
                    marginTop: isMobile ? 6 : 8,
                    fontSize: isMobile ? 15 : 16,
                    lineHeight: isMobile ? "20px" : "22px",
                  }}
                >
                  Most travellers recover the cost in 3–5 redemptions at venues
                  they’d visit anyway.
                </Typography.Text>
                <Typography.Paragraph
                  style={{
                    marginTop: isMobile ? 8 : 10,
                    marginBottom: 0,
                    fontSize: isMobile ? 16 : 18,
                    lineHeight: isMobile ? "24px" : "26px",
                    color: token.colorTextSecondary,
                    maxWidth: 680,
                  }}
                >
                  Perks at 100+ cafés, stays, surf schools & wellness spots.
                </Typography.Paragraph>
              </div>

              <Space size={12} wrap>
                <Button
                  type="primary"
                  size={isMobile ? "large" : "middle"}
                  href={buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleBuyClick}
                  data-testid="pass-hero-cta"
                >
                  Get the Pass
                </Button>
                <Button
                  type="default"
                  size={isMobile ? "large" : "middle"}
                  icon={<RightOutlined />}
                  onClick={handleScrollToHowItWorks}
                >
                  See how it works
                </Button>
              </Space>

              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Activates on first redemption • Works offline via Wallet
              </Typography.Text>

              <div className={styles.heroBadges}>
                <Tag className={styles.heroBadge}>
                  Partnered with 100+ verified venues across Ahangama.
                </Tag>
              </div>
            </Space>
          </div>
        </div>
      </header>

      <section className={styles.sectionTight}>
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 6 }}>
            Example savings
          </Typography.Title>
          <Typography.Text
            type="secondary"
            style={{ fontSize: isMobile ? 12 : 13 }}
          >
            Two partner-based examples to make ROI tangible (conservative
            estimates).
          </Typography.Text>

          <div style={{ height: 10 }} />

          <Row gutter={[14, 14]}>
            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 18,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
                bodyStyle={{ padding: 14 }}
              >
                <Space
                  direction="vertical"
                  size={isMobile ? 10 : 8}
                  style={{ width: "100%" }}
                >
                  <div>
                    <Typography.Text strong style={{ display: "block" }}>
                      Example: 3-Night Stay in Ahangama
                    </Typography.Text>
                  </div>

                  {example3Night.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 12,
                        paddingBlock: isMobile ? 4 : 2,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <Typography.Text style={{ color: token.colorText }}>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: token.colorLink,
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            {item.label}
                          </a>
                        ) : (
                          item.label
                        )}{" "}
                        <span style={{ color: token.colorTextSecondary }}>
                          →
                        </span>
                      </Typography.Text>
                      <Typography.Text
                        strong
                        style={{ color: token.colorText }}
                      >
                        {item.rightText
                          ? item.rightText
                          : `Save LKR ${formatLkr(item.amountLkr)}`}
                      </Typography.Text>
                    </div>
                  ))}

                  <div
                    style={{
                      height: 1,
                      background: token.colorBorderSecondary,
                      marginTop: 4,
                      marginBottom: 2,
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <Typography.Text strong>Total</Typography.Text>
                    <div style={{ textAlign: "right" }}>
                      <Typography.Text strong style={{ display: "block" }}>
                        LKR {formatLkr(example3NightTotal)}
                      </Typography.Text>
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: isMobile ? 11 : 12 }}
                      >
                        ≈ US${example3NightTotalUsdApprox}
                      </Typography.Text>
                    </div>
                  </div>

                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: isMobile ? 11 : 12 }}
                  >
                    Savings vary by venue and usage.
                  </Typography.Text>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                style={{
                  borderRadius: 18,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
                bodyStyle={{ padding: 14 }}
              >
                <Space
                  direction="vertical"
                  size={isMobile ? 10 : 8}
                  style={{ width: "100%" }}
                >
                  <div
                    className={isMobile ? styles.exampleToggle : undefined}
                    role={isMobile ? "button" : undefined}
                    tabIndex={isMobile ? 0 : undefined}
                    aria-expanded={isMobile ? example10Expanded : undefined}
                    onClick={
                      isMobile
                        ? () => setExample10Expanded((v) => !v)
                        : undefined
                    }
                    onKeyDown={
                      isMobile
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setExample10Expanded((v) => !v);
                            }
                          }
                        : undefined
                    }
                  >
                    <Typography.Text strong style={{ display: "block" }}>
                      Example: 10-Day Trip in Ahangama
                    </Typography.Text>
                    {isMobile ? (
                      <RightOutlined
                        aria-hidden="true"
                        className={styles.exampleToggleIcon}
                        style={{
                          transform: example10Expanded
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    ) : null}
                  </div>

                  {isMobile ? (
                    <div
                      className={`${styles.exampleCollapsible} ${
                        example10Expanded ? styles.exampleCollapsibleOpen : ""
                      }`}
                    >
                      <div className={styles.exampleCollapsibleInner}>
                        {example10Day.map((item) => (
                          <div
                            key={item.label}
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "space-between",
                              gap: 12,
                              paddingBlock: 4,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            <Typography.Text style={{ color: token.colorText }}>
                              {item.url ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    color: token.colorLink,
                                    textDecoration: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.label}
                                </a>
                              ) : (
                                item.label
                              )}{" "}
                              <span style={{ color: token.colorTextSecondary }}>
                                →
                              </span>
                            </Typography.Text>
                            <Typography.Text
                              strong
                              style={{ color: token.colorText }}
                            >
                              {item.rightText
                                ? item.rightText
                                : `Save LKR ${formatLkr(item.amountLkr)}`}
                            </Typography.Text>
                          </div>
                        ))}

                        <div
                          style={{
                            height: 1,
                            background: token.colorBorderSecondary,
                            marginTop: 4,
                            marginBottom: 2,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {example10Day.map((item) => (
                        <div
                          key={item.label}
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            justifyContent: "space-between",
                            gap: 12,
                            paddingBlock: 2,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          <Typography.Text style={{ color: token.colorText }}>
                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  color: token.colorLink,
                                  textDecoration: "none",
                                  fontWeight: 600,
                                }}
                              >
                                {item.label}
                              </a>
                            ) : (
                              item.label
                            )}{" "}
                            <span style={{ color: token.colorTextSecondary }}>
                              →
                            </span>
                          </Typography.Text>
                          <Typography.Text
                            strong
                            style={{ color: token.colorText }}
                          >
                            {item.rightText
                              ? item.rightText
                              : `Save LKR ${formatLkr(item.amountLkr)}`}
                          </Typography.Text>
                        </div>
                      ))}

                      <div
                        style={{
                          height: 1,
                          background: token.colorBorderSecondary,
                          marginTop: 4,
                          marginBottom: 2,
                        }}
                      />
                    </>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <Typography.Text strong>Total</Typography.Text>
                    <div style={{ textAlign: "right" }}>
                      <Typography.Text strong style={{ display: "block" }}>
                        LKR {formatLkr(example10DayTotal)}
                      </Typography.Text>
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: isMobile ? 11 : 12 }}
                      >
                        ≈ US${example10DayTotalUsdApprox}
                      </Typography.Text>
                    </div>
                  </div>

                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: isMobile ? 11 : 12 }}
                  >
                    Savings vary by venue and usage.
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            Why you’ll love the Pass
          </Typography.Title>

          <Row gutter={[14, 14]}>
            <Col xs={24} md={8}>
              <Card
                className={styles.valueCard}
                style={{
                  borderRadius: 18,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
              >
                <Space direction="vertical" size={6}>
                  <ThunderboltOutlined
                    aria-hidden="true"
                    style={{
                      fontSize: 18,
                      color: token.colorTextSecondary,
                    }}
                  />
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Pays for itself fast
                  </Typography.Title>
                  <Typography.Text type="secondary" style={valuePropBodyStyle}>
                    Break even in a few redemptions — coffee, surf, wellness and
                    stays add up quickly.
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                className={styles.valueCard}
                style={{
                  borderRadius: 18,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
              >
                <Space direction="vertical" size={6}>
                  <CompassOutlined
                    aria-hidden="true"
                    style={{
                      fontSize: 18,
                      color: token.colorTextSecondary,
                    }}
                  />
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Only the good spots
                  </Typography.Title>
                  <Typography.Text type="secondary" style={valuePropBodyStyle}>
                    Curated partners with perks shown up front — no awkward
                    guessing at checkout.
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                className={styles.valueCard}
                style={{
                  borderRadius: 18,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
              >
                <Space direction="vertical" size={6}>
                  <WalletOutlined
                    aria-hidden="true"
                    style={{
                      fontSize: 18,
                      color: token.colorTextSecondary,
                    }}
                  />
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Scan-and-save
                  </Typography.Title>
                  <Typography.Text type="secondary" style={valuePropBodyStyle}>
                    No app to download — add to Apple/Google Wallet and redeem
                    with a QR in seconds.
                  </Typography.Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            How it works
          </Typography.Title>

          <Row gutter={[14, 14]}>
            {[
              {
                title: "Buy",
                detail:
                  "Choose 15 or 30 days (one-time purchase). Activates on first redemption.",
                icon: <ShoppingOutlined aria-hidden="true" />,
              },
              {
                title: "Add to Wallet",
                detail: "Instant access — save it to Apple/Google Wallet.",
                icon: <WalletOutlined aria-hidden="true" />,
                walletBadges: true,
              },
              {
                title: "Show QR",
                detail: "Redeem in seconds at the counter.",
                icon: <QrcodeOutlined aria-hidden="true" />,
              },
              {
                title: "Enjoy perks",
                detail:
                  "Your perk is applied instantly (works even with weak signal via Wallet).",
                icon: <GiftOutlined aria-hidden="true" />,
              },
            ].map((step, idx) => (
              <Col key={step.title} xs={24} md={12}>
                <Card
                  style={{
                    borderRadius: 18,
                    borderColor: token.colorBorderSecondary,
                    background: "var(--venue-card-bg)",
                  }}
                >
                  <div className={styles.step}>
                    <div className={styles.stepNumber}>{idx + 1}</div>
                    <div>
                      <span className={styles.stepTitle}>
                        <span className={styles.stepTitleIcon}>
                          {step.icon}
                        </span>
                        <Typography.Text strong>{step.title}</Typography.Text>
                        {step.walletBadges ? (
                          <span
                            className={styles.walletBadges}
                            aria-hidden="true"
                          >
                            <img
                              src={addToAppleWallet}
                              alt="add to Apple Wallet"
                              loading="lazy"
                              className={styles.walletBadgeIcon}
                            />
                            <img
                              src={addToGoogleWallet}
                              alt="add to Google Wallet"
                              loading="lazy"
                              className={styles.walletBadgeIcon}
                            />
                          </span>
                        ) : null}
                      </span>
                      <Typography.Paragraph
                        style={{
                          marginTop: 4,
                          marginBottom: 0,
                          color: token.colorTextSecondary,
                        }}
                      >
                        {step.detail}
                      </Typography.Paragraph>

                      {step.walletBadges ? (
                        <Typography.Text
                          type="secondary"
                          style={{
                            display: "block",
                            marginTop: 2,
                            fontSize: 12,
                            lineHeight: "16px",
                          }}
                        >
                          No account required.
                        </Typography.Text>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            Featured venues
          </Typography.Title>

          <Typography.Text
            type="secondary"
            style={{
              display: "block",
              marginTop: -6,
              marginBottom: 10,
              fontSize: 13,
              letterSpacing: "0.01em",
            }}
          >
            Cafés · Surf · Stays · Wellness · Beach bars
          </Typography.Text>

          <Row gutter={isMobile ? [14, 14] : [12, 12]}>
            {venuesLoading && featuredVenues.length === 0
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <Col key={idx} xs={12} md={6}>
                    <Card
                      className={styles.featuredVenueCard}
                      style={{
                        height: "100%",
                        borderRadius: 18,
                        background: "var(--venue-card-bg)",
                      }}
                      bodyStyle={{ padding: isMobile ? 14 : 12 }}
                    >
                      <Skeleton active title={false} paragraph={{ rows: 3 }} />
                    </Card>
                  </Col>
                ))
              : featuredVenues.map((venue) => (
                  <Col key={venue.id} xs={12} md={6}>
                    <Card
                      hoverable
                      className={styles.featuredVenueCard}
                      style={{
                        height: "100%",
                        borderRadius: 18,
                        background: "var(--venue-card-bg)",
                      }}
                      bodyStyle={{ padding: isMobile ? 14 : 12 }}
                    >
                      <Space
                        direction="vertical"
                        size={6}
                        style={{ width: "100%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                          }}
                        >
                          <Tag style={{ marginInlineEnd: 0 }}>
                            {venue.category}
                          </Tag>
                          {venue.logoUrl ? (
                            <img
                              src={venue.logoUrl}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                objectFit: "cover",
                                opacity: 0.9,
                              }}
                            />
                          ) : null}
                        </div>

                        <Typography.Text strong style={{ display: "block" }}>
                          {venue.name}
                        </Typography.Text>

                        <Typography.Text
                          strong
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            lineHeight: "18px",
                            color: token.colorText,
                          }}
                        >
                          {venue.perk}
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Col>
                ))}
          </Row>

          <Typography.Text className={styles.featuredGridNote}>
            + 100 more inside the Pass
          </Typography.Text>

          <Typography.Text
            style={{
              display: "block",
              marginTop: 6,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              color: token.colorTextSecondary,
            }}
          >
            One brunch + one surf rental can often cover the cost of the pass.
          </Typography.Text>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              What travellers say
            </Typography.Title>

            <Typography.Text
              type="secondary"
              style={{ display: "block", fontSize: 13, marginTop: -6 }}
            >
              Used by travellers from the UK, Germany, Australia & beyond.
            </Typography.Text>
          </div>

          <div style={{ height: 14 }} />

          <Row gutter={[14, 14]} justify="center">
            {[
              {
                quote: "Super easy to redeem — we used it almost daily.",
                name: "Maya",
                country: "UK",
              },
              {
                quote:
                  "Loved that it nudged us to the good spots without overthinking.",
                name: "Jonas",
                country: "Germany",
              },
              {
                quote: "We saved more than the pass cost in our first week.",
                name: "Sam",
                country: "Singapore",
              },
              {
                quote: "Wallet pass + QR was smooth. We used it almost daily.",
                name: "Ava",
                country: "Australia",
              },
            ].map((t) => (
              <Col key={t.name} xs={24} md={12} lg={8}>
                <Card
                  className={styles.testimonialCard}
                  style={{
                    height: "100%",
                    borderRadius: 18,
                    background: "var(--venue-card-bg)",
                  }}
                  bodyStyle={{ padding: 14 }}
                >
                  <Space
                    direction="vertical"
                    size={8}
                    style={{ width: "100%" }}
                  >
                    <Typography.Text
                      style={{
                        fontSize: 14,
                        lineHeight: "20px",
                        color: token.colorText,
                      }}
                    >
                      “{t.quote}”
                    </Typography.Text>

                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {t.name} • {t.country}
                    </Typography.Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            Pricing
          </Typography.Title>
          <Typography.Text type="secondary">
            Pick 30 Day if you’re staying 2+ weeks — it’s the best value.
          </Typography.Text>

          <Typography.Text
            type="secondary"
            style={{ display: "block", fontSize: 12 }}
          >
            Buy now, start later: it activates on your first redemption.
          </Typography.Text>

          <Typography.Text
            type="secondary"
            style={{ display: "block", fontSize: 12 }}
          >
            Peak season pricing may change.
          </Typography.Text>

          <div style={{ height: 10 }} />

          <Row gutter={[14, 14]}>
            <Col xs={24} md={12}>
              <Card
                className={styles.pricingCard}
                style={{
                  borderRadius: 22,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    15 Day Pass
                  </Typography.Title>
                  <div>
                    <div className={styles.price}>$29</div>
                    <div className={styles.priceSub}>One-time purchase</div>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, display: "block" }}
                    >
                      That’s just $1.93 per day.
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Savings vary by venue and usage.
                    </Typography.Text>
                  </div>

                  <Space direction="vertical" size={6}>
                    {[
                      "Great for 1–2 week trips",
                      "Wallet pass + QR",
                      "Valid for 15 days",
                    ].map((t) => (
                      <Typography.Text key={t}>
                        <CheckOutlined style={{ color: token.colorPrimary }} />{" "}
                        {t}
                      </Typography.Text>
                    ))}
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    href={buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleBuyClick}
                    data-testid="pass-buy-15"
                    block
                  >
                    Buy 15 Day Pass
                  </Button>
                </Space>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card
                className={`${styles.pricingCard} ${styles.pricingCardBestValue}`}
                style={{
                  borderRadius: 22,
                  borderColor:
                    "color-mix(in srgb, var(--pass-primary) 24%, rgba(0,0,0,0.10))",
                  background: isMobile
                    ? "color-mix(in srgb, var(--pass-primary) 8%, var(--venue-card-bg))"
                    : "color-mix(in srgb, var(--pass-primary) 6%, var(--venue-card-bg))",
                  boxShadow: isMobile
                    ? "0 18px 42px rgba(0, 0, 0, 0.10)"
                    : undefined,
                }}
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <Tag className={styles.pricingBadge}>Best Value</Tag>
                  </div>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    30 Day Pass
                  </Typography.Title>
                  <div>
                    <div className={styles.price}>$49</div>
                    <div className={styles.priceSub}>One-time purchase</div>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, display: "block" }}
                    >
                      That’s just $1.63 per day.
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, display: "block" }}
                    >
                      Less than the cost of one sunset dinner.
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Savings vary by venue and usage.
                    </Typography.Text>
                  </div>

                  <Space direction="vertical" size={6}>
                    {[
                      "Best for 2+ week trips",
                      "Wallet pass + QR",
                      "Valid for 30 days",
                    ].map((t) => (
                      <Typography.Text key={t}>
                        <CheckOutlined style={{ color: token.colorPrimary }} />{" "}
                        {t}
                      </Typography.Text>
                    ))}
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    href={buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={handleBuyClick}
                    data-testid="pass-buy-30"
                    block
                  >
                    Buy 30 Day Pass
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            FAQ
          </Typography.Title>

          <Collapse
            accordion
            defaultActiveKey={[]}
            items={[
              {
                key: "what",
                label: "What is the Ahangama Pass?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    A digital wallet pass that unlocks perks at partner venues
                    across Ahangama. Add it to Apple/Google Wallet, show the QR
                    at checkout, and the perk is applied.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "validity",
                label: "When does my Pass start?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    It activates on your first redemption — not at purchase.
                    You’ll see the expiry date inside your wallet pass.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "short-stay",
                label: "Is it worth it for a short stay?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Often, yes — if you eat out, surf, and explore daily. If you
                    mostly stay at your accommodation, you’ll redeem less.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "uses",
                label: "Can I use it multiple times per venue?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Yes, usually. Some perks may have simple limits (like “once
                    per day”) — the venue will confirm at checkout.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "lost-phone",
                label: "What if I lose my phone?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    No stress — we can help you restore access. Just message us
                    with your purchase details and we’ll guide you quickly.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "offline",
                label: "Does it work offline?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Yes — if you add it to Apple/Google Wallet, you can open the
                    pass even with weak signal.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "refunds",
                label: "Can I get a refund?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    If something isn’t right, we’ll help. Refund eligibility
                    depends on usage and timing — see the policy on checkout.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "redeem",
                label: "How do I redeem at a venue?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Show your QR code to staff and they’ll apply the perk.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "issues",
                label: "What if a venue refuses the perk?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Message us right away and we’ll sort it fast. We’ll confirm
                    the perk and help you get it applied.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "sharing",
                label: "Can I share my Pass?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    The pass is intended for one person.
                  </Typography.Paragraph>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.container}>
          <Card className={styles.finalCtaCard} style={{ borderRadius: 24 }}>
            <div style={{ textAlign: "center" }}>
              <Typography.Title level={3} style={{ marginTop: 0 }}>
                Your Ahangama trip starts here.
              </Typography.Title>
              <Typography.Text type="secondary">
                Instant access in seconds — start saving today.
              </Typography.Text>

              <Typography.Text
                type="secondary"
                style={{ display: "block", marginTop: 4, fontSize: 12 }}
              >
                Instant access. Start using it today.
              </Typography.Text>

              <div style={{ height: 10 }} />

              <Button
                type="primary"
                size="large"
                href={buyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleBuyClick}
                className={styles.finalCtaButton}
                style={isMobile ? { width: "100%" } : { width: 320 }}
              >
                Get the Pass
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {isMobile ? <div className={styles.stickyBarSpacer} /> : null}

      {isMobile && showStickyBar ? (
        <div
          className={styles.stickyBar}
          role="region"
          aria-label="Get the Pass"
        >
          <div className={styles.container}>
            <div className={styles.stickyBarInner}>
              <div className={styles.stickyText}>
                <Typography.Text strong style={{ lineHeight: "18px" }}>
                  Get the Pass — From $29
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  Activates on first redemption
                </Typography.Text>
              </div>

              <Button
                type="primary"
                size="large"
                href={buyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleBuyClick}
                data-testid="pass-sticky-cta"
                className={styles.stickyButton}
              >
                Get the Pass
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
