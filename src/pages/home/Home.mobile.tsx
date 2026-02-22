import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SavingsSummary } from "../../components/SavingsSummary";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import type { Venue } from "../../types/venue";
import { useVenues } from "../../hooks/useVenues";

export type LatLng = { lat: number; lng: number };

export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const numberFormatter = new Intl.NumberFormat("en-US");

function formatRatingAndReviews(venue: Venue): string | null {
  const starsRaw =
    typeof venue.stars === "number"
      ? venue.stars
      : typeof venue.stars === "string"
        ? Number.parseFloat(venue.stars)
        : null;
  if (starsRaw == null || !Number.isFinite(starsRaw)) return null;

  const reviewsRaw =
    typeof venue.reviews === "number"
      ? venue.reviews
      : typeof venue.reviews === "string"
        ? Number.parseFloat(venue.reviews)
        : null;
  const reviewsCount =
    reviewsRaw != null && Number.isFinite(reviewsRaw)
      ? Math.round(reviewsRaw)
      : null;

  if (reviewsCount == null) return `⭐ ${starsRaw.toFixed(1)}`;
  return `⭐ ${starsRaw.toFixed(1)} (${numberFormatter.format(reviewsCount)} reviews)`;
}

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
  const discountPercent = parseDiscountPercent(venue.discount);
  if (discountPercent != null) return `SAVE ${discountPercent}%`;

  const offers = getOfferBadges(venue);
  const firstOffer = offers[0];
  if (firstOffer) return String(firstOffer).trim().toUpperCase();

  const perk = venue.cardPerk != null ? String(venue.cardPerk).trim() : "";
  if (perk) {
    const compact = perk.replace(/\s+/g, " ").slice(0, 24);
    return compact.toUpperCase();
  }

  return "PASS PERK";
}

export function HeroBannerMobile({ imageUrl }: { imageUrl: string }) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 120,
        height: 170,
        zIndex: 1,
        background: `url('${imageUrl}') center center/cover no-repeat`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        borderRadius: 0,
        marginBottom: 0,
      }}
    />
  );
}

type GetPassBarProps = {
  href?: string;
  visible?: boolean;
};

export function GetPassBarMobile({
  href = "https://pass.ahangama.com",
  visible = false,
}: GetPassBarProps) {
  return (
    <div
      className={`ahg-mobile-cta-bar${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
    >
      <div
        style={{
          maxWidth: 430,
          margin: "0 auto",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          minHeight: "var(--ahg-mobile-cta-height)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              lineHeight: "20px",
              color: "#2F3E3A",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Get Pass — from $18
          </div>
        </div>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ahg-mobile-cta-button"
        >
          Get Pass
        </a>
      </div>
    </div>
  );
}

type SearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function VenueSearchAndCategoriesMobile({
  search,
  onSearchChange,
}: SearchProps) {
  return (
    <div
      style={{
        padding: 12,
        background: "#FBF6F1",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <input
        type="text"
        placeholder="Search venues or perks"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #eee",
          marginBottom: 0,
        }}
      />
    </div>
  );
}

type VenueListProps = {
  venues: Venue[];
  userLocation: LatLng | null;
};

export function VenueListMobile({ venues, userLocation }: VenueListProps) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  return (
    <>
      {venues.map((venue) => {
        const id = venue.id;
        const expanded = expandedId === id;

        return (
          <VenueListingCardMobile
            key={String(id)}
            venue={venue}
            userLocation={userLocation}
            expanded={expanded}
            onToggleExpanded={() => setExpandedId(expanded ? null : id)}
          />
        );
      })}
    </>
  );
}

type VenueListingCardProps = {
  venue: Venue;
  userLocation: LatLng | null;
  expanded: boolean;
  onToggleExpanded: () => void;
};

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

    if (raw.includes("%")) {
      const parsed = Number.parseFloat(raw.replace("%", ""));
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

function formatStars(stars: Venue["stars"]): string {
  const parsed =
    typeof stars === "number"
      ? stars
      : typeof stars === "string"
        ? Number.parseFloat(stars)
        : null;
  return parsed != null && Number.isFinite(parsed) ? parsed.toFixed(1) : "-";
}

function formatReviews(reviews: Venue["reviews"]): number {
  const parsed =
    typeof reviews === "number"
      ? reviews
      : typeof reviews === "string"
        ? Number.parseFloat(reviews)
        : null;
  return parsed != null && Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

function pickEmoji(venue: Venue): string {
  const first = venue.emoji?.length ? String(venue.emoji[0]) : "";
  return first.trim() ? first : "⭐";
}

function getOfferBadges(venue: Venue): string[] {
  const labels: string[] = [];

  for (const offer of venue.offers ?? []) {
    if (typeof offer === "string" && offer.trim()) labels.push(offer.trim());
    if (offer && typeof offer === "object") {
      const record = offer as Record<string, unknown>;
      if (typeof record.label === "string" && record.label.trim())
        labels.push(record.label.trim());
      else if (typeof record.type === "string" && record.type.trim())
        labels.push(record.type.trim());
    }
  }

  return labels.filter((x) => !(x && /%\s*off/i.test(x))).slice(0, 2);
}

export function VenueListingCardMobile({
  venue,
  userLocation,
  expanded,
  onToggleExpanded,
}: VenueListingCardProps) {
  const discountPercent = parseDiscountPercent(venue.discount);
  const emoji = pickEmoji(venue);
  const offers = getOfferBadges(venue);
  const ratingLine = formatRatingAndReviews(venue);
  const priceLevel = getPriceLevelLabel(venue);
  const ribbonText = getPrimaryRibbonText(venue);
  const primaryOfferText = (() => {
    if (discountPercent != null)
      return `Save ${discountPercent}% with your Pass`;
    if (offers.length) return offers[0];
    if (venue.cardPerk) return venue.cardPerk;
    return null;
  })();

  const distanceKm = (() => {
    const pos =
      venue.position && venue.position.lat && venue.position.lng
        ? venue.position
        : venue.lat != null && venue.lng != null
          ? { lat: venue.lat, lng: venue.lng }
          : null;
    if (!userLocation || !pos) return null;
    return getDistanceFromLatLonInKm(
      userLocation.lat,
      userLocation.lng,
      pos.lat,
      pos.lng,
    );
  })();

  const instagramHref = venue.instagramUrl || "https://instagram.com/";
  const whatsappHref = (() => {
    const raw = venue.whatsapp;
    if (!raw) return "https://www.whatsapp.com/";
    const digits = raw.replace(/[^0-9]/g, "");
    return digits ? `https://wa.me/${digits}` : "https://www.whatsapp.com/";
  })();

  return (
    <div
      className="ahg-venue-card"
      style={{
        background: "#FBF6F1",
        borderRadius: 18,
        boxShadow: "0 1px 8px rgba(79,111,134,0.07)",
        padding: 0,
        overflow: "hidden",
        marginBottom: 16,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 10,
          cursor: "default",
          padding: 0,
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 100,
            height: 100,
            flex: "0 0 100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {venue.image ? (
            <img
              src={String(venue.image)}
              alt={`${venue.name} photo`}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 16,
                display: "block",
              }}
              loading="lazy"
            />
          ) : null}

          <div
            className="ahg-venue-ribbon"
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              zIndex: 2,
            }}
          >
            {ribbonText}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              minHeight: 24,
            }}
          >
            <span style={{ fontSize: 20, marginRight: 2 }}>{emoji}</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 18,
                lineHeight: "24px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
            >
              {venue.name}
            </span>

            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 999,
                background: "rgba(37, 211, 102, 0.12)",
                border: "1px solid rgba(37, 211, 102, 0.25)",
                color: "#1FAF5A",
                whiteSpace: "nowrap",
              }}
            >
              Pass Partner
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              fontSize: 12,
              color: "#666",
              marginTop: 2,
            }}
          >
            {ratingLine ? (
              <div style={{ fontWeight: 600, color: "#555" }}>{ratingLine}</div>
            ) : null}
            {venue.area ? <div>📍 {venue.area}</div> : null}
            {priceLevel ? <div>💰 {priceLevel}</div> : null}
          </div>

          {primaryOfferText ? (
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
                  fontSize: 11,
                  letterSpacing: 0.9,
                  textTransform: "uppercase",
                  fontWeight: 800,
                  color: "var(--pass-primary)",
                }}
              >
                Pass Offer
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#2F3E3A",
                  lineHeight: "18px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {String(primaryOfferText)}
              </div>
            </div>
          ) : null}

          <div
            style={{
              fontSize: 13,
              color: "#555",
              lineHeight: "18px",
              maxHeight: 36,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              margin: "2px 0 0 0",
            }}
          >
            {venue.excerpt || venue.cardPerk}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              color: "#888",
              marginTop: 2,
              minHeight: 16,
            }}
          >
            <span>
              {venue.area}
              {distanceKm !== null ? ` · ` : ""}
            </span>
            {distanceKm !== null ? (
              <span>
                {distanceKm < 1
                  ? `${Math.round(distanceKm * 1000)} m`
                  : `${distanceKm.toFixed(1)} km`}{" "}
                away
              </span>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 2,
              minHeight: 26,
            }}
          >
            {offers.length
              ? offers.map((offer, i) => (
                  <span
                    key={`${offer}-${i}`}
                    style={{
                      background:
                        i === 0
                          ? "color-mix(in srgb, var(--pass-primary) 16%, #ffffff)"
                          : "#E6F0FA",
                      color: i === 0 ? "var(--pass-primary)" : "#2176AE",
                      fontSize: 12,
                      borderRadius: 8,
                      padding: "3px 10px",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                      lineHeight: "18px",
                      height: 22,
                      display: "inline-flex",
                      alignItems: "center",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    {offer}
                  </span>
                ))
              : (venue.tags ?? []).slice(0, 2).map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    style={{
                      background: "#eee",
                      color: "#666",
                      fontSize: 12,
                      borderRadius: 8,
                      padding: "3px 10px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      lineHeight: "18px",
                      height: 22,
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {tag}
                  </span>
                ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", width: "100%" }}>
        <button
          style={{
            flex: 1,
            background: "#E6DDD4",
            color: "#4A3F36",
            border: "none",
            borderRadius: "0 0 0 16px",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 0",
            cursor: venue.mapUrl ? "pointer" : "not-allowed",
            outline: "none",
            letterSpacing: 0.2,
            boxShadow: "0 -1px 6px rgba(79,111,134,0.04)",
            borderRight: "1px solid #e6f0fa",
            margin: 0,
            opacity: venue.mapUrl ? 1 : 0.5,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (venue.mapUrl) window.open(venue.mapUrl, "_self");
          }}
          disabled={!venue.mapUrl}
        >
          Google Maps
        </button>

        <button
          style={{
            flex: 1,
            background: "#F0E6DC",
            color: "#4A3F36",
            border: "none",
            borderRadius: "0 0 16px 0",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 0",
            cursor: "pointer",
            outline: "none",
            letterSpacing: 0.2,
            boxShadow: "0 -1px 6px rgba(79,111,134,0.04)",
            margin: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
          }}
          aria-expanded={expanded}
          aria-controls={`expand-details-${String(venue.id)}`}
        >
          {expanded ? "Hide details" : "More details"}
        </button>
      </div>

      {expanded ? (
        <div
          id={`expand-details-${String(venue.id)}`}
          style={{
            background: "#FBF6F1",
            borderRadius: 12,
            marginTop: 0,
            padding: "16px 14px",
            fontSize: 15,
            color: "#333",
            boxShadow: "0 1px 6px rgba(79,111,134,0.07)",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              justifyContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(90deg, rgba(245,133,41,0.08) 0%, rgba(221,42,123,0.08) 50%, rgba(129,52,175,0.08) 100%)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 12,
                height: 44,
                minWidth: 140,
                padding: "0 16px",
                fontWeight: 600,
                color: "#1A1A1A",
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 1px 4px rgba(79,111,134,0.06)",
                transition: "background 0.2s, box-shadow 0.2s",
                opacity: venue.instagramUrl ? 1 : 0.6,
                gap: 8,
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, rgba(245,133,41,0.12) 0%, rgba(221,42,123,0.12) 50%, rgba(129,52,175,0.12) 100%)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(90deg, rgba(245,133,41,0.08) 0%, rgba(221,42,123,0.08) 50%, rgba(129,52,175,0.08) 100%)";
                e.currentTarget.style.boxShadow =
                  "0 1px 4px rgba(79,111,134,0.06)";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 448 448"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="ig-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F58529" />
                    <stop offset="50%" stopColor="#DD2A7B" />
                    <stop offset="100%" stopColor="#8134AF" />
                  </linearGradient>
                </defs>
                <rect
                  width="448"
                  height="448"
                  rx="90"
                  fill="url(#ig-gradient)"
                />
                <path
                  d="M224 144c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80zm0 128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm85-88c0 10.5-8.5 19-19 19s-19-8.5-19-19 8.5-19 19-19 19 8.5 19 19zm49 19c-1.1-23.6-6.4-44.5-23.4-61.5S347.6 97.1 324 96c-23.6-1.1-94.4-1.1-118 0-23.6 1.1-44.5 6.4-61.5 23.4S97.1 100.4 96 124c-1.1 23.6-1.1 94.4 0 118 1.1 23.6 6.4 44.5 23.4 61.5S100.4 350.9 124 352c23.6 1.1 94.4 1.1 118 0 23.6-1.1 44.5-6.4 61.5-23.4s22.3-37.9 23.4-61.5c1.1-23.6 1.1-94.4 0-118zm-28.1 143.5c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.8 0-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2 0-132.8 7.8-19.6 22.9-34.7 42.5-42.5 29.4-11.7 99.2-9 132.8 0 19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 0 132.8z"
                  fill="#fff"
                />
              </svg>
              Instagram
            </a>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(37, 211, 102, 0.08)",
                border: "1px solid rgba(37, 211, 102, 0.18)",
                borderRadius: 12,
                height: 44,
                minWidth: 140,
                padding: "0 16px",
                fontWeight: 600,
                color: "#1FAF5A",
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 1px 4px rgba(79,111,134,0.06)",
                transition: "background 0.2s",
                opacity: venue.whatsapp ? 1 : 0.6,
                gap: 8,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="#25D366" />
                <path
                  d="M22.472 19.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.366.711.306 1.264.489 1.697.625.713.227 1.362.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"
                  fill="#fff"
                />
              </svg>
              WhatsApp
            </a>
          </div>

          {venue.description ? (
            <div style={{ marginBottom: 10 }}>{venue.description}</div>
          ) : null}

          {venue.bestFor?.length ? (
            <div style={{ marginBottom: 8 }}>
              <strong>Best for:</strong> {venue.bestFor.join(", ")}
            </div>
          ) : null}

          {venue.howToClaim ? (
            <div style={{ marginBottom: 8 }}>
              <strong>How to claim:</strong> {venue.howToClaim}
            </div>
          ) : null}

          {venue.restrictions ? (
            <div style={{ marginBottom: 8 }}>
              <strong>Restrictions:</strong> {venue.restrictions}
            </div>
          ) : null}

          {venue.whatsapp ? (
            <div style={{ marginBottom: 8 }}>
              <strong>WhatsApp:</strong> {venue.whatsapp}
            </div>
          ) : null}

          {venue.instagramUrl ? (
            <div style={{ marginBottom: 8 }}>
              <strong>Instagram:</strong> {venue.instagramUrl}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function TopRatedCafesMobile({ venues }: { venues: Venue[] }) {
  const cafes = venues
    .filter((v) => {
      const cats = (v.categories ?? []).map((c) => String(c).toLowerCase());
      return cats.some((c) => c.includes("eat"));
    })
    .sort((a, b) => formatReviews(b.reviews) - formatReviews(a.reviews))
    .slice(0, 6);

  if (!cafes.length) return null;

  return (
    <div style={{ margin: "18px 0 0 0", padding: "0 0 0 8px" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 17,
          margin: "0 0 10px 6px",
          color: "#222",
        }}
      >
        Top Rated Cafes
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          gap: 12,
          paddingBottom: 8,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cafes.map((venue) => (
          <div
            key={String(venue.id)}
            style={{
              minWidth: 140,
              maxWidth: 160,
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 1px 6px rgba(79,111,134,0.07)",
              padding: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {venue.image ? (
              <img
                src={String(venue.image)}
                alt={`${venue.name} photo`}
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 10,
                  margin: "10px 0 6px 0",
                }}
                loading="lazy"
              />
            ) : null}

            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                margin: "0 8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
            >
              {venue.name}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#666",
                margin: "2px 0 8px 0",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#f7b733", fontSize: 14 }}>★</span>{" "}
              {formatStars(venue.stars)}
              <span style={{ color: "#aaa", fontWeight: 400 }}>
                {" "}
                · {formatReviews(venue.reviews)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type VenueSectionCarouselProps = {
  title: string;
  venues: Venue[];
  onViewAll?: () => void;
};

export function VenueSectionCarouselMobile({
  title,
  venues,
  onViewAll,
}: VenueSectionCarouselProps) {
  if (!venues.length) return null;

  return (
    <section style={{ marginTop: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 8px",
          marginBottom: 10,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16, color: "#222" }}>
          {title}
        </div>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--pass-primary)",
              fontWeight: 800,
              fontSize: 12,
              padding: 0,
              cursor: "pointer",
            }}
          >
            View All
          </button>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          padding: "0 8px 6px 8px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {venues.map((v) => (
          <VenueCarouselCardMobile key={String(v.id)} venue={v} />
        ))}
      </div>
    </section>
  );
}

function VenueCarouselCardMobile({ venue }: { venue: Venue }) {
  const discountPercent = parseDiscountPercent(venue.discount);
  const ribbonText = getPrimaryRibbonText(venue);
  const ratingLine = formatRatingAndReviews(venue);
  const priceLevel = getPriceLevelLabel(venue);
  const offers = getOfferBadges(venue);
  const primaryOfferText = (() => {
    if (discountPercent != null)
      return `Save ${discountPercent}% with your Pass`;
    if (offers.length) return offers[0];
    if (venue.cardPerk) return venue.cardPerk;
    return null;
  })();

  return (
    <div
      className="ahg-venue-card"
      style={{
        flex: "0 0 260px",
        background: "#FBF6F1",
        borderRadius: 18,
        boxShadow: "0 1px 8px rgba(79,111,134,0.07)",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ position: "relative" }}>
        {venue.image ? (
          <img
            src={String(venue.image)}
            alt={`${venue.name} photo`}
            style={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 140,
              background: "rgba(0,0,0,0.04)",
            }}
          />
        )}

        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <div className="ahg-venue-ribbon">{ribbonText}</div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 11,
            fontWeight: 900,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(37, 211, 102, 0.12)",
            border: "1px solid rgba(37, 211, 102, 0.25)",
            color: "#1FAF5A",
            whiteSpace: "nowrap",
          }}
        >
          Pass Partner
        </div>
      </div>

      <div style={{ padding: 12 }}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 15,
            color: "#222",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {venue.name}
        </div>

        <div
          style={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            fontSize: 12,
            color: "#666",
          }}
        >
          {ratingLine ? (
            <div style={{ fontWeight: 700, color: "#555" }}>{ratingLine}</div>
          ) : null}
          {venue.area ? <div>📍 {venue.area}</div> : null}
          {priceLevel ? <div>💰 {priceLevel}</div> : null}
        </div>

        {primaryOfferText ? (
          <div
            style={{
              marginTop: 10,
              background: "color-mix(in srgb, var(--pass-primary) 8%, #ffffff)",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 14,
              padding: "10px 10px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 11,
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
                marginTop: 3,
                fontSize: 14,
                fontWeight: 900,
                color: "#2F3E3A",
                lineHeight: "18px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {String(primaryOfferText)}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

type SectionKey = "most-popular" | "best-discounts" | "beach-road" | "wellness";

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getReviewsCount(v: { reviews?: unknown }): number {
  const n = toNumber(v.reviews);
  return n != null ? Math.round(n) : 0;
}

function formatOfferLabel(offer: unknown): string | null {
  if (!offer || typeof offer !== "object") return null;
  const rec = offer as Record<string, unknown>;
  if (typeof rec.label === "string" && rec.label.trim())
    return rec.label.trim();
  if (typeof rec.type === "string" && rec.type.trim()) return rec.type.trim();
  return null;
}

function discountPercentFromValue(discount: unknown): number | null {
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

function maxPercentOfferScore(v: {
  discount?: unknown;
  offers?: unknown[];
}): number {
  const percents: number[] = [];
  const discountPct = discountPercentFromValue(v.discount);
  if (discountPct != null) percents.push(discountPct);

  for (const offer of v.offers ?? []) {
    const label = typeof offer === "string" ? offer : formatOfferLabel(offer);
    if (!label) continue;
    const match = label.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match?.[1]) {
      const parsed = Number.parseFloat(match[1]);
      if (Number.isFinite(parsed)) percents.push(Math.round(parsed));
    }
  }

  return percents.length ? Math.max(...percents) : 0;
}

export default function HomeMobile() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const viewAllRef = useRef<HTMLDivElement | null>(null);
  const [viewAllSection, setViewAllSection] = useState<SectionKey | null>(null);

  const { venues, loading, error } = useVenues({
    destinationSlug,
    liveOnly: true,
  });

  // Enables footer "Best Cafés" / "Best Surf Spots" quick links via ?q=
  const qParam = searchParams.get("q") ?? "";
  useEffect(() => {
    setSearch((prev) => (prev === qParam ? prev : qParam));
  }, [qParam]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolledPastHero =
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
        setCtaVisible(scrolledPastHero);
      },
      { threshold: 0.01 },
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  const filteredVenues = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = venues.filter((v) => {
      if (!q) return true;

      const haystack = [
        v.name,
        v.area,
        v.excerpt,
        v.cardPerk,
        ...(v.categories ?? []),
        ...(v.tags ?? []),
      ]
        .filter((x): x is string => Boolean(x))
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    if (!userLocation) return base;

    return base
      .map((v) => {
        const pos =
          v.position && v.position.lat && v.position.lng
            ? v.position
            : v.lat != null && v.lng != null
              ? { lat: v.lat, lng: v.lng }
              : null;
        const distance =
          pos != null
            ? getDistanceFromLatLonInKm(
                userLocation.lat,
                userLocation.lng,
                pos.lat,
                pos.lng,
              )
            : null;
        return { venue: v, distance };
      })
      .sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      })
      .map((x) => x.venue);
  }, [venues, search, userLocation]);

  const sections = useMemo(() => {
    const base = filteredVenues;

    const mostPopular = base
      .slice()
      .sort((a, b) => getReviewsCount(b) - getReviewsCount(a))
      .slice(0, 8);

    const bestDiscountsAll = base
      .slice()
      .map((v) => ({ v, score: maxPercentOfferScore(v) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.v);
    const bestDiscounts = bestDiscountsAll.slice(0, 8);

    const beachRoadAll = base.filter((v) => {
      const area = (v.area ?? "").toString().toLowerCase();
      return area.includes("matara road") || area.includes("beach road");
    });
    const beachRoad = beachRoadAll.slice(0, 8);

    const wellnessAll = base.filter((v) => {
      const cats = (v.categories ?? []).map((c) => String(c).toLowerCase());
      return cats.some(
        (c) => c.includes("experiences") || c.includes("wellness"),
      );
    });
    const wellness = wellnessAll.slice(0, 8);

    return {
      mostPopular,
      mostPopularAll: base
        .slice()
        .sort((a, b) => getReviewsCount(b) - getReviewsCount(a)),
      bestDiscounts,
      bestDiscountsAll,
      beachRoad,
      beachRoadAll,
      wellness,
      wellnessAll,
    };
  }, [filteredVenues]);

  const handleViewAll = (key: SectionKey) => {
    setViewAllSection(key);
    requestAnimationFrame(() => {
      viewAllRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const viewAllVenues = (() => {
    switch (viewAllSection) {
      case "most-popular":
        return { title: "⭐ Most Popular", venues: sections.mostPopularAll };
      case "best-discounts":
        return {
          title: "🔥 Best Discounts",
          venues: sections.bestDiscountsAll,
        };
      case "beach-road":
        return { title: "🏝️ Beach Road Picks", venues: sections.beachRoadAll };
      case "wellness":
        return {
          title: "🌿 Wellness Favourites",
          venues: sections.wellnessAll,
        };
      default:
        return null;
    }
  })();

  return (
    <div
      style={{
        maxWidth: 430,
        margin: "0 auto",
        padding: 0,
        background: "#F6EFE8",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div ref={heroRef}>
        <HeroBannerMobile imageUrl="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_banner_v3.jpg" />
      </div>

      <GetPassBarMobile visible={ctaVisible} />

      <VenueSearchAndCategoriesMobile
        search={search}
        onSearchChange={setSearch}
      />

      <div
        className="ahg-mobile-cta-safe"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 8,
        }}
      >
        <SavingsSummary />

        {error ? (
          <div
            style={{
              background: "#FBF6F1",
              borderRadius: 16,
              padding: 12,
              color: "#7A1F1F",
              boxShadow: "0 1px 8px rgba(79,111,134,0.07)",
            }}
          >
            Could not load venues: {error}
          </div>
        ) : null}

        {loading ? (
          <div style={{ padding: 36, textAlign: "center", color: "#666" }}>
            Loading venues…
          </div>
        ) : null}

        {!loading && !error && filteredVenues.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            No venues found.
          </div>
        ) : null}

        {!loading && !error && filteredVenues.length > 0 ? (
          <>
            <VenueSectionCarouselMobile
              title="⭐ Most Popular"
              venues={sections.mostPopular}
              onViewAll={() => handleViewAll("most-popular")}
            />
            <VenueSectionCarouselMobile
              title="🔥 Best Discounts"
              venues={sections.bestDiscounts}
              onViewAll={() => handleViewAll("best-discounts")}
            />
            <VenueSectionCarouselMobile
              title="🏝️ Beach Road Picks"
              venues={sections.beachRoad}
              onViewAll={() => handleViewAll("beach-road")}
            />
            <VenueSectionCarouselMobile
              title="🌿 Wellness Favourites"
              venues={sections.wellness}
              onViewAll={() => handleViewAll("wellness")}
            />

            {viewAllVenues ? (
              <div ref={viewAllRef} style={{ marginTop: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "0 8px",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 16, color: "#222" }}>
                    {viewAllVenues.title}
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewAllSection(null)}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: "#666",
                      fontWeight: 800,
                      fontSize: 12,
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    Hide
                  </button>
                </div>

                <VenueListMobile
                  venues={viewAllVenues.venues}
                  userLocation={userLocation}
                />
              </div>
            ) : null}

            <div style={{ marginTop: 14 }}>
              <FooterDesktop />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
