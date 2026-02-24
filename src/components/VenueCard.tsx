import { EnvironmentOutlined, InstagramOutlined } from "@ant-design/icons";
import { Button, Card, Space, Tag, Tooltip, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { Venue } from "../types/venue";

type Props = {
  venue: Venue;
  variant?: "default" | "desktop";
  cardStyle?: CSSProperties;
  distanceKm?: number | null;
};

function formatDistance(distanceKm: number): string {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return "";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

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

export function VenueCard({
  venue,
  variant = "default",
  cardStyle,
  distanceKm = null,
}: Props) {
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
  const isPassPartner =
    venue.live === true || String(venue.status ?? "").toLowerCase() === "live";
  const discountBadgeText = discountLabel ? ribbonText : null;
  const distanceText =
    distanceKm != null ? formatDistance(distanceKm) : "";

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
                justifyContent: "space-between",
                gap: 10,
                minHeight: 28,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {discountBadgeText ? (
                  <span className="ahg-venue-discount-badge">
                    {discountBadgeText}
                  </span>
                ) : null}
                {isPassPartner ? (
                  <Tooltip
                    title="Verified partner. Discount guaranteed with valid Ahangama Pass."
                    trigger={["hover", "click"]}
                    placement="top"
                    overlayStyle={{ maxWidth: 240 }}
                  >
                    <button
                      type="button"
                      className="ahg-venue-partner-badge"
                      style={{ cursor: "pointer" }}
                      aria-label="Pass Partner verification"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        focusable="false"
                        style={{ flex: "0 0 auto" }}
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Pass Partner
                    </button>
                  </Tooltip>
                ) : null}
              </div>
            </div>

            <div
              style={{
                marginTop: 8,
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
                <div style={{ fontWeight: 700, color: "#2F3E3A" }}>
                  {ratingLine}
                </div>
              ) : null}
              {venue.area ? (
                <div>
                  📍 {venue.area}
                  {distanceText ? (
                    <span style={{ opacity: 0.8 }}> · {distanceText}</span>
                  ) : null}
                </div>
              ) : null}
              {priceLevel ? <div>💰 {priceLevel}</div> : null}
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
            <Tooltip
              title="Verified partner. Discount guaranteed with valid Ahangama Pass."
              trigger={["hover", "click"]}
              placement="top"
              overlayStyle={{ maxWidth: 240 }}
            >
              <Tag
                color="green"
                style={{ margin: 0, cursor: "pointer" }}
                role="button"
                tabIndex={0}
                aria-label="Pass Partner verification"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    (e.currentTarget as unknown as HTMLElement).click();
                  }
                }}
              >
                Pass Partner
              </Tag>
            </Tooltip>
            <Tag style={{ margin: 0, fontWeight: 800 }}>{ribbonText}</Tag>
          </Space>

          {ratingLine ? (
            <Typography.Text type="secondary">{ratingLine}</Typography.Text>
          ) : null}

          {venue.area ? (
            <Typography.Text type="secondary">
              📍 {venue.area}
              {distanceText ? ` · ${distanceText}` : ""}
            </Typography.Text>
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
