import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SavingsSummary } from "../../components/SavingsSummary";
import { useVenues } from "../../hooks/useVenues";
import {
  GetPassBarMobile,
  HeroBannerMobile,
  type LatLng,
  VenueListMobile,
  VenueSearchAndCategoriesMobile,
  VenueSectionCarouselMobile,
  getDistanceFromLatLonInKm,
} from "./Home.mobile.components";

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
          </>
        ) : null}
      </div>
    </div>
  );
}
