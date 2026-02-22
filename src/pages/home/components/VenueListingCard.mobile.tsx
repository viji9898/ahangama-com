import type { Venue } from "../../../types/venue";
import { getDistanceFromLatLonInKm, type LatLng } from "./geo.mobile";

type Props = {
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
}: Props) {
  const discountPercent = parseDiscountPercent(venue.discount);
  const emoji = pickEmoji(venue);
  const reviewsCount = formatReviews(venue.reviews);
  const offers = getOfferBadges(venue);

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
      style={{
        background: "#FBF6F1",
        borderRadius: 16,
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
                borderRadius: 14,
                display: "block",
              }}
              loading="lazy"
            />
          ) : null}

          {discountPercent != null ? (
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                background: "rgba(255, 215, 64, 0.95)",
                color: "#7a5c00",
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 10,
                padding: "2px 10px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                zIndex: 2,
                letterSpacing: 0.2,
              }}
            >
              {discountPercent}% Off
            </span>
          ) : null}
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
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              color: "#666",
              minHeight: 18,
            }}
          >
            <span style={{ color: "#f7b733", fontSize: 14 }}>★</span>
            <span style={{ fontWeight: 600 }}>{formatStars(venue.stars)}</span>
            <span style={{ color: "#aaa", fontWeight: 400 }}>
              · {reviewsCount}
            </span>
          </div>

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
                      background: i === 0 ? "#F8E9C7" : "#E6F0FA",
                      color: i === 0 ? "#A67C00" : "#2176AE",
                      fontSize: 12,
                      borderRadius: 8,
                      padding: "3px 10px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      lineHeight: "18px",
                      height: 22,
                      display: "inline-flex",
                      alignItems: "center",
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
