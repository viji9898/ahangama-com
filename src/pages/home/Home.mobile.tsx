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
  return (
    <>
      {venues.map((venue) => (
        <VenueListingCardMobile
          key={String(venue.id)}
          venue={venue}
          userLocation={userLocation}
        />
      ))}
    </>
  );
}

type VenueListingCardProps = {
  venue: Venue;
  userLocation: LatLng | null;
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

  return (
    <div style={{ marginBottom: 16 }}>
      <HomeVenueCardMobile
        venue={venue}
        variant="list"
        distanceKm={distanceKm}
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
