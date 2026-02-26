import { EnvironmentOutlined, InstagramOutlined } from "@ant-design/icons";
import { Button, Card, Tag, Tooltip, Typography } from "antd";
import { memo, type CSSProperties, type ReactNode, useMemo } from "react";
import type { Venue } from "../../types/venue";

type Props = {
  venue: Venue;
  variant: "list" | "carousel";
  distanceKm?: number | null;
  style?: CSSProperties;
  footer?: ReactNode;
  after?: ReactNode;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

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
    if (discount > 0 && discount < 1) return `Save ${Math.round(discount * 100)}%`;
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

function getDirectionsHref(venue: Venue): string | null {
  const mapUrl = typeof venue.mapUrl === "string" ? venue.mapUrl.trim() : "";
  if (mapUrl) return mapUrl;

  const lat = toNumber(venue.position?.lat ?? venue.lat);
  const lng = toNumber(venue.position?.lng ?? venue.lng);
  if (lat == null || lng == null) return null;

  const destination = `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export const HomeVenueCardMobile = memo(function HomeVenueCardMobile({
  venue,
  variant: _variant,
  distanceKm = null,
  style,
  footer,
  after,
}: Props) {
  const isPassPartner = Boolean(venue.isPassVenue);
  const passVenueBorder = isPassPartner
    ? "1px solid color-mix(in srgb, var(--pass-primary) 28%, rgba(0,0,0,0.08))"
    : undefined;

  const discountLabel = isPassPartner ? formatDiscountLabel(venue.discount) : null;
  const ribbonText = isPassPartner ? getPrimaryRibbonText(venue) : null;
  const discountBadgeText = discountLabel && ribbonText ? ribbonText : null;

  const distanceText = distanceKm != null ? formatDistance(distanceKm) : "";
  const mapsHref = getDirectionsHref(venue);
  const instagramHref =
    typeof venue.instagramUrl === "string" && venue.instagramUrl.trim()
      ? venue.instagramUrl.trim()
      : null;

  const ratingLine = (() => {
    const parsedStars = toNumber(venue.stars);
    if (parsedStars == null || !Number.isFinite(parsedStars)) return null;

    const parsedReviews = toNumber(venue.reviews);
    const reviewsCount =
      parsedReviews != null && Number.isFinite(parsedReviews)
        ? Math.round(parsedReviews)
        : null;

    return reviewsCount != null
      ? `⭐ ${parsedStars.toFixed(1)} (${numberFormatter.format(reviewsCount)} reviews)`
      : `⭐ ${parsedStars.toFixed(1)}`;
  })();

  const excerptLine =
    venue.excerpt != null && String(venue.excerpt).trim() !== ""
      ? String(venue.excerpt)
      : isPassPartner && venue.cardPerk != null && String(venue.cardPerk).trim() !== ""
        ? String(venue.cardPerk)
        : null;

  const powerBackupLabel =
    venue.powerBackup === "generator"
      ? "⚡ Generator"
      : venue.powerBackup === "inverter"
        ? "⚡ Inverter"
        : venue.powerBackup === "none"
          ? "⚡ No backup"
          : null;

  const offerLabels = useMemo(() => {
    if (!Array.isArray(venue.offers)) return [];
    return venue.offers
      .map(formatOfferLabel)
      .filter((x): x is string => Boolean(x));
  }, [venue.offers]);

  const coverHeightPx = (() => {
    const heightPx = getNumericPx(style?.height);
    return heightPx != null ? Math.round(heightPx * 0.4) : null;
  })();

  const defaultFooter = (
    <div style={{ display: "flex", gap: 0 }}>
      <Button
        style={{
          flex: 1,
          borderRadius: 0,
          borderBottomLeftRadius: 14,
          margin: 0,
        }}
        icon={<EnvironmentOutlined />}
        disabled={!mapsHref}
        onClick={(e) => {
          e.stopPropagation();
          if (!mapsHref) return;
          window.open(mapsHref, "_blank", "noopener,noreferrer");
        }}
      >
        Maps
      </Button>
      <Button
        style={{
          flex: 1,
          borderRadius: 0,
          borderBottomRightRadius: 14,
          margin: 0,
        }}
        icon={<InstagramOutlined />}
        disabled={!instagramHref}
        onClick={(e) => {
          e.stopPropagation();
          window.open(
            instagramHref ?? "https://instagram.com/",
            "_blank",
            "noopener,noreferrer",
          );
        }}
      >
        Instagram
      </Button>
    </div>
  );

  return (
    <div style={{ width: "100%" }}>
      <Card
        hoverable={false}
        className="ahg-venue-card"
        style={{
          ...(style ?? {}),
          width: style?.width ?? "100%",
          background: "var(--venue-card-bg)",
          border: passVenueBorder ?? style?.border,
          borderRadius: 14,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        styles={{
          body: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            padding: 0,
            background: "var(--venue-card-bg)",
          },
        }}
        cover={
          venue.image || venue.logo ? (
            <div style={{ position: "relative" }}>
              <img
                src={String(venue.image || venue.logo)}
                alt={venue.name}
                style={{
                  width: "100%",
                  height: coverHeightPx ?? 180,
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
              />

              {venue.staffPick ? (
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <Tag
                    style={{
                      margin: 0,
                      fontSize: 11,
                      fontWeight: 900,
                      borderRadius: 999,
                      padding: "2px 10px",
                      background: "rgba(255,255,255,0.82)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      color: "#1A1A1A",
                    }}
                  >
                    Staff Pick
                  </Tag>
                </div>
              ) : null}
            </div>
          ) : undefined
        }
      >
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
              minHeight: discountBadgeText || isPassPartner ? 28 : 0,
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
                    onClick={(e) => e.stopPropagation()}
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

          {powerBackupLabel ? (
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                overflow: "hidden",
              }}
            >
              <Tag style={{ margin: 0, fontSize: 11 }}>{powerBackupLabel}</Tag>
            </div>
          ) : null}

          {isPassPartner && Array.isArray(offerLabels) && offerLabels.length ? (
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                overflow: "hidden",
              }}
            >
              {offerLabels.slice(0, 2).map((label) => (
                <Tag key={label} style={{ margin: 0, fontSize: 11 }}>
                  {label}
                </Tag>
              ))}
              {offerLabels.length > 2 ? (
                <Tag style={{ margin: 0, fontSize: 11 }}>
                  +{offerLabels.length - 2}
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

        {footer ?? defaultFooter}
      </Card>

      {after}
    </div>
  );
});
