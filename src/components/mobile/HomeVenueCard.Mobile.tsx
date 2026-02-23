import { Tooltip } from "antd";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { Venue } from "../../types/venue";

const numberFormatter = new Intl.NumberFormat("en-US");

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

function parseDiscountPercent(discount: Venue["discount"]): number | null {
  if (discount == null) return null;

  if (typeof discount === "number" && Number.isFinite(discount)) {
    if (discount > 0 && discount < 1) return Math.round(discount * 100);
    if (discount >= 1) return Math.round(discount);
    return null;
  }

  if (typeof discount === "string") {
    const raw = discount.trim();
    if (!raw) return null;

    const match = raw.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match?.[1]) {
      const parsed = Number.parseFloat(match[1]);
      return Number.isFinite(parsed) ? Math.round(parsed) : null;
    }

    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return null;
    if (parsed > 0 && parsed < 1) return Math.round(parsed * 100);
    if (parsed >= 1) return Math.round(parsed);
    return null;
  }

  return null;
}

function percentFromOffers(venue: Venue): number | null {
  for (const offer of venue.offers ?? []) {
    const label =
      typeof offer === "string"
        ? offer
        : offer && typeof offer === "object"
          ? (offer as Record<string, unknown>).label
          : null;
    if (typeof label !== "string") continue;
    const match = label.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match?.[1]) {
      const parsed = Number.parseFloat(match[1]);
      return Number.isFinite(parsed) ? Math.round(parsed) : null;
    }
  }

  return null;
}

function getSavePercent(venue: Venue): number | null {
  return parseDiscountPercent(venue.discount) ?? percentFromOffers(venue);
}

function getEmojiPrefix(venue: Venue): string {
  const haystack = [
    ...(venue.categories ?? []).map((x) => String(x)),
    ...(venue.tags ?? []).map((x) => String(x)),
  ]
    .join(" ")
    .toLowerCase();

  if (
    haystack.includes("stay") ||
    haystack.includes("stays") ||
    haystack.includes("hotel") ||
    haystack.includes("villa") ||
    haystack.includes("accommodation")
  ) {
    return "🛏";
  }

  if (haystack.includes("surf")) return "🌊";

  if (
    haystack.includes("wellness") ||
    haystack.includes("spa") ||
    haystack.includes("yoga") ||
    haystack.includes("massage")
  ) {
    return "🧘";
  }

  if (
    haystack.includes("eat") ||
    haystack.includes("cafe") ||
    haystack.includes("coffee") ||
    haystack.includes("restaurant") ||
    haystack.includes("food")
  ) {
    return "☕";
  }

  return "⭐";
}

function getRatingBadge(venue: Venue): string | null {
  const stars = toNumber(venue.stars);
  if (stars == null) return null;
  const reviews = toNumber(venue.reviews);
  const reviewsCount = reviews != null ? Math.round(reviews) : 0;

  if (reviewsCount > 0) {
    return `⭐ ${stars.toFixed(1)} · ${numberFormatter.format(reviewsCount)}`;
  }

  return `⭐ ${stars.toFixed(1)}`;
}

function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
  return `${distanceKm.toFixed(1)} km away`;
}

export function HomeVenueCardMobile({
  venue,
  variant,
  distanceKm = null,
  style,
  footer,
  after,
}: Props) {
  const [partnerTooltipOpen, setPartnerTooltipOpen] = useState(false);

  const isPassPartner =
    venue.live === true || String(venue.status ?? "").toLowerCase() === "live";

  const savePercent = getSavePercent(venue);
  const ribbonText = savePercent != null ? `SAVE ${savePercent}%` : null;
  const ratingBadge = getRatingBadge(venue);
  const emoji = getEmojiPrefix(venue);
  const saveLine =
    savePercent != null
      ? `Save ${savePercent}% with your Pass`
      : "Save with your Pass";

  const imageHeight = variant === "list" ? 170 : 140;

  return (
    <div
      className="ahg-venue-card"
      style={{
        background: "#FBF6F1",
        borderRadius: 18,
        boxShadow: "0 1px 8px rgba(79,111,134,0.07)",
        padding: 0,
        overflow: "hidden",
        position: "relative",
        ...(style ?? {}),
      }}
    >
      <div style={{ position: "relative" }}>
        {venue.image ? (
          <img
            src={String(venue.image)}
            alt={`${venue.name} photo`}
            style={{
              width: "100%",
              height: imageHeight,
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: imageHeight,
              background: "rgba(0,0,0,0.04)",
            }}
          />
        )}

        {ribbonText ? (
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <div className="ahg-venue-ribbon">{ribbonText}</div>
          </div>
        ) : null}

        {ratingBadge ? (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 11,
              fontWeight: 900,
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(0,0,0,0.08)",
              color: "#1A1A1A",
              whiteSpace: "nowrap",
            }}
          >
            {ratingBadge}
          </div>
        ) : null}
      </div>

      <div style={{ padding: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 18 }}>
            {emoji}
          </span>
          <div
            style={{
              fontWeight: 900,
              fontSize: 16,
              color: "#222",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
              flex: 1,
            }}
          >
            {venue.name}
          </div>

          {isPassPartner ? (
            <Tooltip
              title="Verified partner. Discount guaranteed with valid Ahangama Pass."
              trigger={["click"]}
              placement="top"
              open={partnerTooltipOpen}
              onOpenChange={(open) => setPartnerTooltipOpen(open)}
              overlayStyle={{ maxWidth: 240 }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  border: "1px solid rgba(37, 211, 102, 0.25)",
                  background: "rgba(37, 211, 102, 0.12)",
                  color: "#1FAF5A",
                  fontSize: 11,
                  fontWeight: 900,
                  padding: "4px 10px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  lineHeight: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
                aria-label="Pass Partner verification"
              >
                <span aria-hidden="true">✓</span>
                Pass Partner
              </button>
            </Tooltip>
          ) : null}
        </div>

        {venue.area || distanceKm != null ? (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "#666",
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {venue.area ? `📍 ${venue.area}` : ""}
            </span>
            {distanceKm != null ? (
              <span style={{ whiteSpace: "nowrap", opacity: 0.9 }}>
                {formatDistance(distanceKm)}
              </span>
            ) : null}
          </div>
        ) : null}

        <div
          style={{
            marginTop: 10,
            fontSize: 14,
            fontWeight: 900,
            color: "#2F3E3A",
            lineHeight: "18px",
          }}
        >
          {saveLine}
        </div>
      </div>

      {footer}
      {after}
    </div>
  );
}
