import { EnvironmentOutlined, InstagramOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { Venue } from "../types/venue";

type Props = {
  venue: Venue;
  variant?: "default" | "desktop";
  cardStyle?: CSSProperties;
};

function formatOfferLabel(offer: unknown): string | null {
  if (!offer || typeof offer !== "object") return null;

  const maybeOffer = offer as Record<string, unknown>;
  if (typeof maybeOffer.label === "string" && maybeOffer.label.trim())
    return maybeOffer.label.trim();
  if (typeof maybeOffer.type === "string" && maybeOffer.type.trim())
    return maybeOffer.type.trim();

  return null;
}

function formatStarsAndReviews(
  stars: Venue["stars"],
  reviews: Venue["reviews"],
): string | null {
  const toFiniteNumber = (value: unknown): number | null => {
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const starsNum = toFiniteNumber(stars);
  const reviewsNum = toFiniteNumber(reviews);

  if (starsNum == null && reviewsNum == null) return null;
  if (starsNum != null && reviewsNum != null)
    return `⭐️${starsNum.toFixed(1)} | ${Math.round(reviewsNum)} reviews`;
  if (starsNum != null) return `⭐️${starsNum.toFixed(1)}`;
  if (reviewsNum != null) return `${Math.round(reviewsNum)} reviews`;
  return null;
}

function getNumericPx(value: CSSProperties["height"]): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.endsWith("px")) {
      const parsed = Number.parseFloat(trimmed);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }
  return null;
}

function formatDiscountLabel(discount: Venue["discount"]): string | null {
  if (discount == null) return null;

  if (typeof discount === "number" && Number.isFinite(discount)) {
    if (discount > 0 && discount < 1)
      return `Save ${Math.round(discount * 100)}%`;
    if (discount >= 1) return `Save ${Math.round(discount)}%`;
    return null;
  }

  if (typeof discount === "string") {
    const raw = discount.trim();
    if (!raw) return null;

    if (raw.includes("%")) {
      return raw.toLowerCase().includes("save") ? raw : `Save ${raw}`;
    }

    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed)) {
      if (parsed > 0 && parsed < 1) return `Save ${Math.round(parsed * 100)}%`;
      if (parsed >= 1) return `Save ${Math.round(parsed)}%`;
    }

    return raw;
  }

  return String(discount);
}

export function VenueCard({ venue, variant = "default", cardStyle }: Props) {
  const actions: ReactNode[] = [];

  const discountLabel = formatDiscountLabel(venue.discount);

  const starsAndReviews =
    variant === "desktop"
      ? formatStarsAndReviews(venue.stars, venue.reviews)
      : null;

  const desktopCoverHeightPx =
    variant === "desktop"
      ? (() => {
          const cardHeightPx = getNumericPx(cardStyle?.height);
          return cardHeightPx != null ? Math.round(cardHeightPx * 0.4) : null;
        })()
      : null;

  const hasDesktopCoverImage =
    variant === "desktop" && Boolean(venue.image || venue.logo);

  const categoryLocationLabel = (() => {
    const category = venue.categories?.length
      ? String(venue.categories[0])
      : "";
    const location =
      venue.area != null && String(venue.area).trim() !== ""
        ? String(venue.area)
        : "";
    if (!category && !location) return null;
    if (category && location) return `${category} : ${location}`;
    return category || location;
  })();

  const starsLabel = (() => {
    const parsed =
      typeof venue.stars === "number"
        ? venue.stars
        : typeof venue.stars === "string"
          ? Number.parseFloat(venue.stars)
          : null;
    if (parsed == null || !Number.isFinite(parsed)) return null;

    const parsedReviews =
      typeof venue.reviews === "number"
        ? venue.reviews
        : typeof venue.reviews === "string"
          ? Number.parseFloat(venue.reviews)
          : null;
    const reviewsCount =
      parsedReviews != null && Number.isFinite(parsedReviews)
        ? Math.round(parsedReviews)
        : null;

    return reviewsCount != null
      ? `⭐️${parsed.toFixed(1)} | ${reviewsCount} reviews`
      : `⭐️${parsed.toFixed(1)}`;
  })();

  const excerptLine =
    venue.excerpt != null && String(venue.excerpt).trim() !== ""
      ? String(venue.excerpt)
      : venue.cardPerk != null && String(venue.cardPerk).trim() !== ""
        ? String(venue.cardPerk)
        : null;

  if (variant !== "desktop") {
    if (venue.mapUrl) {
      actions.push(
        <Button
          key="map"
          type="link"
          href={venue.mapUrl}
          target="_blank"
          rel="noreferrer"
          icon={<EnvironmentOutlined />}
        >
          Google Maps
        </Button>,
      );
    }

    if (venue.instagramUrl) {
      actions.push(
        <Button
          key="ig"
          type="link"
          href={venue.instagramUrl}
          target="_blank"
          rel="noreferrer"
          icon={<InstagramOutlined />}
        >
          Instagram
        </Button>,
      );
    }
  }

  return (
    <Card
      hoverable={variant === "desktop"}
      style={
        variant === "desktop"
          ? {
              ...cardStyle,
              borderRadius: 12,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }
          : cardStyle
      }
      styles={
        variant === "desktop"
          ? {
              body: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                padding: 0,
              },
            }
          : undefined
      }
      cover={
        hasDesktopCoverImage ? (
          <div style={{ position: "relative" }}>
            <img
              src={String(venue.image || venue.logo)}
              alt={venue.name}
              style={{
                width: "100%",
                height: desktopCoverHeightPx ?? 180,
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
            {discountLabel ? (
              <div style={{ position: "absolute", top: 8, left: 8 }}>
                <Tag>{discountLabel}</Tag>
              </div>
            ) : null}

            {starsLabel ? (
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <div
                  style={{
                    background: "rgba(0,0,0,0.38)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 10,
                    lineHeight: "12px",
                    pointerEvents: "none",
                  }}
                >
                  {starsLabel}
                </div>
              </div>
            ) : null}

            {categoryLocationLabel ? (
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  bottom: 4,
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0) 100%)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                    padding: "6px 14px 6px 10px",
                    borderRadius: 10,
                    display: "inline-block",
                    maxWidth: "220px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    pointerEvents: "none",
                  }}
                >
                  {categoryLocationLabel}
                </div>
              </div>
            ) : null}
          </div>
        ) : undefined
      }
      actions={variant !== "desktop" && actions.length ? actions : undefined}
    >
      {variant === "desktop" ? (
        <>
          <div
            style={{
              padding: 12,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                minHeight: 20,
              }}
            >
              {venue.emoji?.length ? (
                <span aria-label="emoji" style={{ fontSize: 18 }}>
                  {venue.emoji.join(" ")}
                </span>
              ) : null}
              <Typography.Text
                strong
                style={{
                  fontSize: 14,
                  lineHeight: "18px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {venue.name}
              </Typography.Text>
              {!hasDesktopCoverImage && discountLabel ? (
                <Tag>{discountLabel}</Tag>
              ) : null}
            </div>

            {starsAndReviews ? (
              <div style={{ marginTop: 4 }}>
                <Space size={4} wrap>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {starsAndReviews}
                  </Typography.Text>
                </Space>
              </div>
            ) : null}

            {excerptLine ? (
              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  lineHeight: "16px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {excerptLine}
              </div>
            ) : null}

            {venue.categories?.length ? (
              <div style={{ marginTop: 8 }}>
                <Space size={6} wrap>
                  {venue.categories.slice(0, 4).map((c) => (
                    <Tag key={c}>{c}</Tag>
                  ))}
                  {venue.categories.length > 4 ? (
                    <Tag>+{venue.categories.length - 4}</Tag>
                  ) : null}
                </Space>
              </div>
            ) : null}

            {Array.isArray(venue.offers) && venue.offers.length ? (
              <div style={{ marginTop: 8 }}>
                <Space size={6} wrap>
                  {venue.offers
                    .map(formatOfferLabel)
                    .filter((x): x is string => Boolean(x))
                    .slice(0, 3)
                    .map((label) => (
                      <Tag key={label}>{label}</Tag>
                    ))}
                  {venue.offers.length > 3 ? (
                    <Tag>+{venue.offers.length - 3}</Tag>
                  ) : null}
                </Space>
              </div>
            ) : null}

            {venue.bestFor?.length ? (
              <div style={{ marginTop: 8 }}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Best for
                </Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={6} wrap>
                    {venue.bestFor.slice(0, 4).map((b) => (
                      <Tag key={b}>{b}</Tag>
                    ))}
                    {venue.bestFor.length > 4 ? (
                      <Tag>+{venue.bestFor.length - 4}</Tag>
                    ) : null}
                  </Space>
                </div>
              </div>
            ) : null}

            {venue.tags?.length ? (
              <div style={{ marginTop: 8 }}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Tags
                </Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={6} wrap>
                    {venue.tags.slice(0, 6).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                    {venue.tags.length > 6 ? (
                      <Tag>+{venue.tags.length - 6}</Tag>
                    ) : null}
                  </Space>
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 0 }}>
            <Button
              style={{ flex: 1, borderRadius: 0, margin: 0 }}
              icon={<EnvironmentOutlined />}
              disabled={!venue.mapUrl}
              onClick={() => {
                if (!venue.mapUrl) return;
                window.open(venue.mapUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Google Maps
            </Button>
            <Button
              style={{ flex: 1, borderRadius: 0, margin: 0 }}
              icon={<InstagramOutlined />}
              disabled={!venue.instagramUrl}
              onClick={() => {
                if (!venue.instagramUrl) return;
                window.open(
                  venue.instagramUrl,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              Instagram
            </Button>
          </div>
        </>
      ) : (
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <Space size={8} wrap>
            <Typography.Text strong>{venue.name}</Typography.Text>
            {!hasDesktopCoverImage && discountLabel ? (
              <Tag>{discountLabel}</Tag>
            ) : null}
          </Space>

          {venue.area ? (
            <Typography.Text type="secondary">{venue.area}</Typography.Text>
          ) : null}

          {venue.categories?.length ? (
            <Space size={6} wrap>
              {venue.categories.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
            </Space>
          ) : null}
        </Space>
      )}
    </Card>
  );
}
