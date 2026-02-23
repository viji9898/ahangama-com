import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { HomeHeroMobile } from "../../components/mobile/HomeHero.Mobile";
import { FreeGuideWhatsAppCtaMobile } from "../../components/mobile/FreeGuideWhatsAppCta.Mobile";
import { SavingsBreakdownMobile } from "../../components/mobile/SavingsBreakdown.Mobile";
import { HomeVenueCardMobile } from "../../components/mobile/HomeVenueCard.Mobile";
import { SocialProofMobile } from "../../components/mobile/SocialProof.Mobile";
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
  onPurchase?: () => void;
};

export function GetPassBarMobile({
  href = "https://pass.ahangama.com",
  visible = false,
  onPurchase,
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
            Save at 100+ venues
          </div>
        </div>

        <button
          type="button"
          className="ahg-mobile-cta-button"
          onClick={() => {
            if (onPurchase) return onPurchase();
            window.open(href, "_blank", "noopener,noreferrer");
          }}
          style={{ border: "none", cursor: "pointer" }}
          aria-label="Get Your Pass"
        >
          Get Your Pass ($18)
        </button>
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

export function VenueListingCardMobile({
  venue,
  userLocation,
  expanded,
  onToggleExpanded,
}: VenueListingCardProps) {
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
    <div style={{ marginBottom: 16 }}>
      <HomeVenueCardMobile
        venue={venue}
        variant="list"
        distanceKm={distanceKm}
        footer={
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
        }
        after={
          expanded ? (
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
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.08)";
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
                      <linearGradient
                        id="ig-gradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
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
          ) : null
        }
      />
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
  userLocation?: LatLng | null;
};

export function VenueSectionCarouselMobile({
  title,
  venues,
  onViewAll,
  userLocation = null,
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
          <VenueCarouselCardMobile
            key={String(v.id)}
            venue={v}
            userLocation={userLocation}
          />
        ))}
      </div>
    </section>
  );
}

function VenueCarouselCardMobile({
  venue,
  userLocation,
}: {
  venue: Venue;
  userLocation: LatLng | null;
}) {
  const distanceKm = (() => {
    const pos =
      venue.position?.lat != null && venue.position?.lng != null
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

  return (
    <HomeVenueCardMobile
      venue={venue}
      variant="carousel"
      distanceKm={distanceKm}
      style={{
        flex: "0 0 260px",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    />
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
  const passUrl = "https://pass.ahangama.com";

  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const viewAllRef = useRef<HTMLDivElement | null>(null);
  const offersTopRef = useRef<HTMLDivElement | null>(null);
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
    const onScroll = () => {
      setCtaVisible(window.scrollY > 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const handleSeeAllOffers = () => {
    setViewAllSection(null);
    requestAnimationFrame(() => {
      offersTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const viewAllVenues = (() => {
    switch (viewAllSection) {
      case "most-popular":
        return {
          title: "⭐ Crowd Favourites",
          venues: sections.mostPopularAll,
        };
      case "best-discounts":
        return {
          title: "🔥 Best Value This Week",
          venues: sections.bestDiscountsAll,
        };
      case "beach-road":
        return {
          title: "🏝️ Beach Road Favourites",
          venues: sections.beachRoadAll,
        };
      case "wellness":
        return {
          title: "🌿 Wellness Reset Spots",
          venues: sections.wellnessAll,
        };
      default:
        return null;
    }
  })();

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 0,

        backgroundImage:
          "url('https://ahangama-pass.s3.eu-west-2.amazonaws.com/admin/hero_mobile_background.jpg')",
        backgroundRepeat: "repeat-y",
        backgroundSize: "100% auto",
        backgroundPosition: "top center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div ref={heroRef}>
        <HomeHeroMobile
          imageUrl="https://ahangama-pass.s3.eu-west-2.amazonaws.com/admin/hero_banner_mobile.jpg"
          passUrl={passUrl}
          onSeeAllOffers={handleSeeAllOffers}
        />
      </div>

      <GetPassBarMobile
        visible={ctaVisible}
        href={passUrl}
        onPurchase={() => {
          window.open(passUrl, "_blank", "noopener,noreferrer");
        }}
      />

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
          padding: 0,
        }}
      >
        <SavingsBreakdownMobile />

        <FreeGuideWhatsAppCtaMobile />

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
            <div ref={offersTopRef} />
            <VenueSectionCarouselMobile
              title="⭐ Crowd Favourites"
              venues={sections.mostPopular}
              onViewAll={() => handleViewAll("most-popular")}
              userLocation={userLocation}
            />
            <VenueSectionCarouselMobile
              title="🔥 Best Value This Week"
              venues={sections.bestDiscounts}
              onViewAll={() => handleViewAll("best-discounts")}
              userLocation={userLocation}
            />
            <VenueSectionCarouselMobile
              title="🏝️ On the Beach Favourites"
              venues={sections.beachRoad}
              onViewAll={() => handleViewAll("beach-road")}
              userLocation={userLocation}
            />
            <VenueSectionCarouselMobile
              title="🌿 Wellness Reset Spots"
              venues={sections.wellness}
              onViewAll={() => handleViewAll("wellness")}
              userLocation={userLocation}
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
              <SocialProofMobile />
            </div>

            <div style={{ marginTop: 14 }}>
              <FooterDesktop />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
