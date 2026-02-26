import { CheckOutlined, RightOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  Grid,
  Row,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PassLanding.module.css";

type FeaturedVenue = {
  name: string;
  perk: string;
  category: "Eat" | "Stays" | "Experiences";
  imageUrl?: string;
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

export function PassLanding() {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const location = useLocation();

  const buyUrl = useMemo(() => buildBuyUrl(location.search), [location.search]);

  const featuredVenues = useMemo<FeaturedVenue[]>(
    () => [
      {
        name: "Sunset Surf Co.",
        perk: "15% off board rentals",
        category: "Experiences",
      },
      {
        name: "Salt & Steam Café",
        perk: "10% off coffee + brunch",
        category: "Eat",
      },
      {
        name: "Palm Stay",
        perk: "Free breakfast upgrade",
        category: "Stays",
      },
      {
        name: "Ocean Yoga",
        perk: "2-for-1 drop-in class",
        category: "Experiences",
      },
      {
        name: "Coconut Corner",
        perk: "10% off smoothie bowls",
        category: "Eat",
      },
      {
        name: "Drift Spa",
        perk: "15% off massages",
        category: "Experiences",
      },
      {
        name: "Seaside Villas",
        perk: "Late checkout (subject to availability)",
        category: "Stays",
      },
      {
        name: "Beach Bites",
        perk: "Free dessert with mains",
        category: "Eat",
      },
    ],
    [],
  );

  const handleBuyClick = useCallback(() => {
    fireBuyClickEvent();
  }, []);

  const handleScrollToHowItWorks = useCallback(() => {
    const el = document.getElementById("how-it-works");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isMobile = !screens.md;

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
                  Unlock Ahangama.
                </Typography.Title>
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
                  Save at 100+ cafés, stays, surf schools & wellness spots.
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

              <Typography.Text type="secondary">
                Instant access • Apple/Google Wallet • Works in seconds
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
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Save money
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Typical savings: $10–$25/day (placeholder)
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
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Curated venues
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    The best spots only — no noise.
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
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    Instant access
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    Wallet pass + QR code for fast redemption.
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
              { title: "Buy", detail: "Choose 15 or 30 days." },
              { title: "Receive", detail: "Get instant access." },
              { title: "Show QR", detail: "Redeem in seconds." },
              { title: "Enjoy perks", detail: "Save across venues." },
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
                      <Typography.Text strong>{step.title}</Typography.Text>
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
            {featuredVenues.map((venue) => (
              <Col key={venue.name} xs={12} md={6}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: 18,
                    borderColor: token.colorBorderSecondary,
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
                        justifyContent: "space-between",
                      }}
                    >
                      <Tag style={{ marginInlineEnd: 0 }}>{venue.category}</Tag>
                    </div>

                    <Typography.Text strong style={{ display: "block" }}>
                      {venue.name}
                    </Typography.Text>
                    <Typography.Text type="secondary">
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

      <section className={styles.section}>
        <div className={styles.container}>
          <Typography.Title level={2} style={{ marginTop: 0 }}>
            Pricing
          </Typography.Title>

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
                  </div>

                  <Space direction="vertical" size={6}>
                    {[
                      "Instant access",
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
                className={styles.pricingCard}
                style={{
                  borderRadius: 22,
                  borderColor: token.colorBorderSecondary,
                  background: "var(--venue-card-bg)",
                }}
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    30 Day Pass
                  </Typography.Title>
                  <div>
                    <div className={styles.price}>$49</div>
                    <div className={styles.priceSub}>One-time purchase</div>
                  </div>

                  <Space direction="vertical" size={6}>
                    {[
                      "Best value",
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
                    It starts as soon as you buy (placeholder). You’ll see the
                    expiry date inside your pass.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "uses",
                label: "Can I use it more than once at the same place?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Usually yes (placeholder). Some perks may have limits.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "offline",
                label: "Does it work offline?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Yes — if you add it to Apple/Google Wallet, you can open the
                    pass even with weak signal (placeholder).
                  </Typography.Paragraph>
                ),
              },
              {
                key: "refunds",
                label: "Can I get a refund?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Refunds depend on usage and timing (placeholder). Check the
                    purchase page policy.
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
                label: "What if a venue won’t honor the perk?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    Message us and we’ll help you resolve it quickly.
                  </Typography.Paragraph>
                ),
              },
              {
                key: "sharing",
                label: "Can I share my Pass?",
                children: (
                  <Typography.Paragraph style={{ marginBottom: 0 }}>
                    The pass is intended for one person (placeholder).
                  </Typography.Paragraph>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.container}>
          <Card
            style={{
              borderRadius: 24,
              borderColor: token.colorBorderSecondary,
              background: "var(--venue-card-bg)",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Typography.Title level={3} style={{ margin: 0 }}>
                  Ready to save like a local?
                </Typography.Title>
                <Typography.Text type="secondary">
                  Instant access in seconds — start saving today.
                </Typography.Text>
              </Col>
              <Col xs={24} md={8}>
                <Button
                  type="primary"
                  size="large"
                  href={buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleBuyClick}
                  block
                >
                  Get the Pass
                </Button>
              </Col>
            </Row>
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
                  Instant access • Works in seconds
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
