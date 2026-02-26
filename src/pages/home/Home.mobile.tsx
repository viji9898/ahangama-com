import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Switch } from "antd";
import { Link, useParams } from "react-router-dom";
import { HomeHeroMobile } from "../../components/mobile/HomeHero.Mobile";
import { FreeGuideWhatsAppCtaMobile } from "../../components/mobile/FreeGuideWhatsAppCta.Mobile";
import { HomeVenueCardMobile } from "../../components/mobile/HomeVenueCard.Mobile";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import { EDITORIAL_TAGS, getEditorialTagDescription } from "../../config/editorialTags";
import type { Venue } from "../../types/venue";
import { useVenues } from "../../hooks/useVenues";
import { hasEditorialTag } from "../../utils/venueEditorial";
import { sortVenues } from "../../utils/venueList";

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
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: "var(--app-shell-header-height)",
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
                borderRadius: "0 0 0 18px",
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
                borderRadius: "0 0 18px 0",
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
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.06)",
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
                    borderRadius: 18,
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
                    borderRadius: 18,
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
  subtitle?: string;
  venues: Venue[];
  viewAllHref?: string;
  userLocation?: LatLng | null;
};

export function VenueSectionCarouselMobile({
  title,
  subtitle,
  venues,
  viewAllHref,
  userLocation = null,
}: VenueSectionCarouselProps) {
  const MIN_SECTION_ITEMS = 4;
  if (venues.length < MIN_SECTION_ITEMS) return null;

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
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, color: "#222" }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ marginTop: 2, fontSize: 12, color: "#666" }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {viewAllHref ? (
          <Link
            to={viewAllHref}
            style={{
              textDecoration: "none",
              color: "var(--pass-primary)",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            View all
          </Link>
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

export default function HomeMobile() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");
  const passUrl = "https://pass.ahangama.com";

  const [passOnly, setPassOnly] = useState(false);

  const [ctaVisible, setCtaVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const offersTopRef = useRef<HTMLDivElement | null>(null);

  const { venues, loading, error } = useVenues({
    destinationSlug,
    liveOnly: true,
  });

  useEffect(() => {
    const onScroll = () => {
      setCtaVisible(window.scrollY > 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sortedVenues = useMemo(() => sortVenues(venues, "curated"), [venues]);

  const homeEditorialTags = useMemo(() => EDITORIAL_TAGS.slice(0, 15), []);

  const visibleVenues = useMemo(() => {
    let list = sortedVenues;
    if (passOnly) list = list.filter((v) => Boolean(v.isPassVenue));
    return list;
  }, [sortedVenues, passOnly]);

  const visibleVenuesByTag = useMemo(() => {
    return homeEditorialTags.map((tag) => {
      let list = sortedVenues;
      if (passOnly) list = list.filter((v) => Boolean(v.isPassVenue));
      list = list.filter((v) => hasEditorialTag(v, tag));
      return { tag, venues: list };
    });
  }, [sortedVenues, passOnly, homeEditorialTags]);

  const buildVenuesHref = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({ destinationSlug, sort: "curated" });
    for (const [k, v] of Object.entries(overrides)) p.set(k, v);
    return `/venues?${p.toString()}`;
  };

  const handleSeeAllOffers = () => {
    requestAnimationFrame(() => {
      offersTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 0,
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

      <div
        className="ahg-mobile-cta-safe"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 0,
        }}
      >
        <FreeGuideWhatsAppCtaMobile />

        <div
          style={{
            position: "sticky",
            top: "var(--app-shell-header-height)",
            zIndex: 20,
            background: "var(--venue-listing-bg)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            padding: "8px 8px",
          }}
          aria-label="Sticky filters"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.78)",
            }}
            aria-label="Filter: Ahangama Pass"
          >
            <div style={{ fontWeight: 850, fontSize: 13, color: "#222" }}>
              Ahangama Pass
            </div>
            <Switch
              checked={passOnly}
              onChange={setPassOnly}
              size="small"
              aria-label="Toggle: show Ahangama Pass venues only"
            />
          </div>
        </div>

        <div style={{ background: "var(--venue-listing-bg)" }}>
          {error ? (
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.06)",
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

          {!loading && !error && visibleVenues.length === 0 ? (
            <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
              No venues found.
            </div>
          ) : null}

          {!loading && !error && visibleVenues.length > 0 ? (
            <>
              <div ref={offersTopRef} />

              {visibleVenuesByTag.map(({ tag, venues: taggedVenues }) => (
                <VenueSectionCarouselMobile
                  key={tag}
                  title={tag}
                  subtitle={
                    getEditorialTagDescription(tag) ??
                    "Curated by Ahangama. Venues that match this vibe."
                  }
                  venues={taggedVenues}
                  viewAllHref={buildVenuesHref({
                    ...(passOnly ? { pass: "1" } : {}),
                    ...(tag ? { tag } : {}),
                  })}
                />
              ))}
            </>
          ) : null}
        </div>
        <div style={{ marginTop: 14 }}>
          <FooterDesktop />
        </div>
      </div>
    </div>
  );
}
