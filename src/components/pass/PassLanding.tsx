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
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PassLanding.module.css";
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

  const valuePropBodyStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 13,
    lineHeight: "18px",
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              <div>
                <Typography.Title
                  level={1}
                  style={{
                    margin: 0,
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    fontSize: isMobile ? 40 : 52,
                    lineHeight: isMobile ? "44px" : "56px",
                  }}
                >
                  Ahangama Pass. Premium perks, instant savings.
                </Typography.Title>

                <Typography.Text
                  strong
                  style={{
                    display: "block",
                    marginTop: 8,
                    fontSize: isMobile ? 15 : 16,
                    lineHeight: isMobile ? "20px" : "22px",
                  }}
                >
                  Typical travellers save LKR 25,000+ in 2 weeks
                </Typography.Text>
                <Typography.Paragraph
                  style={{
                    marginTop: 10,
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

              <Typography.Text
                type="secondary"
                style={{ fontSize: 12, lineHeight: "16px" }}
              >
                From $29 • Used at 100+ venues • Apple/Google Wallet
              </Typography.Text>
            </Space>
          </div>
        </div>
      </header>

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
                    Break even in just a few redemptions at places you’ll
                    actually go.
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
                    A curated set of venues that are worth your time (and
                    budget).
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
                    Add to Apple/Google Wallet and redeem with a QR in seconds.
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
                detail: "Choose 15 or 30 days (one-time purchase).",
                icon: <ShoppingOutlined aria-hidden="true" />,
              },
              {
                title: "Add to Wallet",
                detail: "Instant access — save it to Apple/Google Wallet.",
                icon: <WalletOutlined aria-hidden="true" />,
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

          <Row gutter={[12, 12]}>
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
                      bodyStyle={{ padding: 12 }}
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
                      bodyStyle={{ padding: 12 }}
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
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={2} style={{ marginTop: 0 }}>
              What travellers say
            </Typography.Title>
          </div>

          <div style={{ height: 14 }} />

          <Row gutter={[14, 14]} justify="center">
            {[
              {
                quote:
                  "Paid for itself in the first few days — super easy to redeem.",
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
                quote: "Wallet pass + QR was smooth. We used it almost daily.",
                name: "Ava",
                country: "Australia",
              },
            ].map((t) => (
              <Col key={t.name} xs={24} md={8}>
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
            Pick 30 Day for the best value on most trips.
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
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Typical savings: LKR 20,000+
                    </Typography.Text>
                  </div>

                  <Space direction="vertical" size={6}>
                    {[
                      "Best for short stays",
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
                  background:
                    "color-mix(in srgb, var(--pass-primary) 6%, var(--venue-card-bg))",
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
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Typical savings: LKR 40,000+
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
            items={[
              {
                key: "validity",
                label: "When does my Pass start?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    It starts immediately after purchase. You’ll see the expiry
                    date inside your wallet pass.
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

              <div style={{ height: 14 }} />

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

      {isMobile ? (
        <div
          className={styles.stickyBar}
          role="region"
          aria-label="Get the Pass"
        >
          <div className={styles.container}>
            <div className={styles.stickyBarInner}>
              <div className={styles.stickyText}>
                <Typography.Text strong style={{ lineHeight: "18px" }}>
                  Ahangama Pass
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  From $29 • Instant wallet pass
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
