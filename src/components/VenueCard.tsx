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

const numberFormatter = new Intl.NumberFormat("en-US");

function getPriceLevelLabel(venue: Venue): string | null {
  const explicit = (venue as unknown as { priceLevel?: unknown }).priceLevel;
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim();

  const tags = (venue.tags ?? []).map((t) => String(t).toLowerCase());
  if (tags.some((t) => t.includes("$$$"))) return "$$$";
  if (tags.some((t) => t.includes("$$"))) return "$$";
  if (tags.some((t) => t.includes("$"))) return "$";
  if (tags.some((t) => t.includes("budget") || t.includes("cheap"))) return "$";
  if (tags.some((t) => t.includes("mid") || t.includes("mid-range")))
    return "$$";
  if (tags.some((t) => t.includes("premium") || t.includes("luxury")))
    return "$$$";
  return null;
}

function getPrimaryRibbonText(venue: Venue): string {
  const discountLabel = formatDiscountLabel(venue.discount);
  if (discountLabel) {
    const match = discountLabel.match(/(\d+\s*%)/);
    if (match?.[1]) return `SAVE ${match[1].replace(/\s+/g, "")}`;
    return discountLabel.replace(/^Save\s+/i, "SAVE ").toUpperCase();
  }

  const firstOffer = Array.isArray(venue.offers)
    ? venue.offers.map(formatOfferLabel).find((x): x is string => Boolean(x))
    : null;
  if (firstOffer) return String(firstOffer).trim().toUpperCase();

  const perk = venue.cardPerk != null ? String(venue.cardPerk).trim() : "";
  if (perk) return perk.replace(/\s+/g, " ").slice(0, 24).toUpperCase();

  return "PASS PERK";
}

export function VenueCard({ venue, variant = "default", cardStyle }: Props) {
  const actions: ReactNode[] = [];

  const discountLabel = formatDiscountLabel(venue.discount);
  const ribbonText = getPrimaryRibbonText(venue);
  const ratingLine = (() => {
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
      ? `⭐ ${parsed.toFixed(1)} (${numberFormatter.format(reviewsCount)} reviews)`
      : `⭐ ${parsed.toFixed(1)}`;
  })();
  const priceLevel = getPriceLevelLabel(venue);

  const desktopCoverHeightPx =
    variant === "desktop"
      ? (() => {
          const cardHeightPx = getNumericPx(cardStyle?.height);
          return cardHeightPx != null ? Math.round(cardHeightPx * 0.4) : null;
        })()
      : null;

  const hasDesktopCoverImage =
    variant === "desktop" && Boolean(venue.image || venue.logo);

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
      className="ahg-venue-card"
      style={
        variant === "desktop"
          ? {
              ...cardStyle,
              background: "var(--venue-card-bg)",
              borderRadius: 14,
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
                background: "var(--venue-card-bg)",
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

            <div style={{ position: "absolute", top: 8, left: 8 }}>
              <div className="ahg-venue-ribbon">{ribbonText}</div>
            </div>

            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(37, 211, 102, 0.12)",
                border: "1px solid rgba(37, 211, 102, 0.25)",
                color: "#1FAF5A",
                fontSize: 11,
                fontWeight: 900,
                padding: "4px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              Pass Partner
            </div>
          </div>
        ) : undefined
      }
      actions={variant !== "desktop" && actions.length ? actions : undefined}
    >
      {variant === "desktop" ? (
        <>
          <div
            style={{
              padding: 10,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
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
              <Typography.Text
                strong
                style={{
                  fontSize: 13,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {venue.emoji?.length ? `${venue.emoji[0]} ` : ""}
                {venue.name}
              </Typography.Text>
              {!hasDesktopCoverImage && discountLabel ? (
                <Tag>{discountLabel}</Tag>
              ) : null}
            </div>

            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                color: "#666",
                fontSize: 11,
                lineHeight: "14px",
              }}
            >
              {ratingLine ? (
                <div style={{ fontWeight: 700 }}>{ratingLine}</div>
              ) : null}
              {venue.area ? <div>📍 {venue.area}</div> : null}
              {priceLevel ? <div>💰 {priceLevel}</div> : null}
            </div>

            <div
              style={{
                marginTop: 8,
                background:
                  "color-mix(in srgb, var(--pass-primary) 8%, #ffffff)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 14,
                padding: "8px 10px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 0.9,
                  textTransform: "uppercase",
                  fontWeight: 900,
                  color: "var(--pass-primary)",
                }}
              >
                Pass Offer
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#2F3E3A",
                  lineHeight: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {Array.isArray(venue.offers) && venue.offers.length
                  ? venue.offers
                      .map(formatOfferLabel)
                      .filter((x): x is string => Boolean(x))
                      .slice(0, 1)
                      .join(" ")
                  : venue.cardPerk || discountLabel || "Pass perk available"}
              </div>
            </div>

            {excerptLine ? (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  lineHeight: "14px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {excerptLine}
              </div>
            ) : null}

            {Array.isArray(venue.offers) && venue.offers.length ? (
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  gap: 6,
                  overflow: "hidden",
                }}
              >
                {venue.offers
                  .map(formatOfferLabel)
                  .filter((x): x is string => Boolean(x))
                  .slice(0, 2)
                  .map((label) => (
                    <Tag key={label} style={{ margin: 0, fontSize: 11 }}>
                      {label}
                    </Tag>
                  ))}
                {venue.offers.length > 2 ? (
                  <Tag style={{ margin: 0, fontSize: 11 }}>
                    +{venue.offers.length - 2}
                  </Tag>
                ) : null}
              </div>
            ) : null}

            {venue.bestFor?.length ? (
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  overflow: "hidden",
                }}
              >
                {venue.bestFor.map((b) => (
                  <Tag key={b} style={{ margin: 0, fontSize: 11 }}>
                    {b}
                  </Tag>
                ))}
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
            <Tag color="green" style={{ margin: 0 }}>
              Pass Partner
            </Tag>
            <Tag style={{ margin: 0, fontWeight: 800 }}>{ribbonText}</Tag>
          </Space>

          {ratingLine ? (
            <Typography.Text type="secondary">{ratingLine}</Typography.Text>
          ) : null}

          {venue.area ? (
            <Typography.Text type="secondary">📍 {venue.area}</Typography.Text>
          ) : null}

          {priceLevel ? (
            <Typography.Text type="secondary">💰 {priceLevel}</Typography.Text>
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
