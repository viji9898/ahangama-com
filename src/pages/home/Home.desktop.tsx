import { Alert, Col, Empty, Row, Spin, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SavingsSummary } from "../../components/SavingsSummary";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import { FreeGuideCtaDesktop } from "../../components/desktop/FreeGuideCta.Desktop";
import { HowItWorks } from "../../components/desktop/HowItWorks.Desktop";
import { HeroDesktop } from "../../components/desktop/Hero.Desktop";
import { VenueFiltersDesktop } from "../../components/desktop/VenueFilters.Desktop";
import { VenueCard } from "../../components/VenueCard";
import { useVenues } from "../../hooks/useVenues";
import type { Venue } from "../../types/venue";

type SectionKey =
  | "staff-picks"
  | "near-you"
  | "post-surf-fuel"
  | "laptop-friendly"
  | "sunset-spots"
  | "wellness-reset";

type LatLng = { lat: number; lng: number };

function getDistanceFromLatLonInKm(
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

function venueHaystack(v: Venue): string {
  return [
    v.name,
    v.area,
    v.excerpt,
    v.cardPerk,
    ...(v.categories ?? []),
    ...(v.bestFor ?? []),
    ...(v.tags ?? []),
  ]
    .filter((x): x is string => Boolean(x))
    .join(" ")
    .toLowerCase();
}

function matchesAnyKeyword(v: Venue, keywords: string[]): boolean {
  const haystack = venueHaystack(v);
  return keywords.some((k) => haystack.includes(k));
}

export default function HomeDesktop() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const [searchParams] = useSearchParams();

  const [searchText, setSearchText] = useState("");
  const [viewAllSection, setViewAllSection] = useState<SectionKey | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  const { venues, loading, error } = useVenues({
    destinationSlug,
    liveOnly: true,
  });

  // Enables footer "Best Cafés" / "Best Surf Spots" quick links via ?q=
  const qParam = searchParams.get("q") ?? "";
  useEffect(() => {
    setSearchText((prev) => (prev === qParam ? prev : qParam));
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
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, []);

  const filteredVenues = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    const base = venues.filter((v) => {
      if (!q) return true;

      const haystack = [
        v.name,
        v.area,
        v.excerpt,
        ...(v.categories ?? []),
        ...(v.bestFor ?? []),
        ...(v.tags ?? []),
      ]
        .filter((x): x is string => Boolean(x))
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
    return base;
  }, [venues, searchText]);

  const sections = useMemo(() => {
    const base = filteredVenues;

    const staffPicksAll = base.filter((v) =>
      matchesAnyKeyword(v, [
        "staff pick",
        "staff picks",
        "editor pick",
        "editor's pick",
        "editors pick",
        "recommended",
        "must try",
        "must-try",
      ]),
    );

    const nearYouAll = !userLocation
      ? ([] as Venue[])
      : base
          .map((v) => {
            const pos =
              v.position?.lat != null && v.position?.lng != null
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
            return { v, distance };
          })
          .filter((x) => x.distance != null)
          .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
          .map((x) => x.v);

    const postSurfFuelAll = base.filter((v) =>
      matchesAnyKeyword(v, [
        "cafe",
        "coffee",
        "restaurant",
        "food",
        "eat",
        "breakfast",
        "brunch",
        "smoothie",
        "juice",
        "bowl",
        "bakery",
      ]),
    );

    const laptopFriendlyAll = base.filter((v) =>
      matchesAnyKeyword(v, [
        "laptop",
        "wifi",
        "wi-fi",
        "co-working",
        "coworking",
        "workspace",
        "remote work",
        "work-friendly",
      ]),
    );

    const sunsetSpotsAll = base.filter((v) =>
      matchesAnyKeyword(v, [
        "sunset",
        "view",
        "rooftop",
        "ocean",
        "beach",
        "bar",
        "cocktail",
      ]),
    );

    const wellnessResetAll = base.filter((v) => {
      const cats = (v.categories ?? []).map((c) => String(c).toLowerCase());
      const tags = (v.tags ?? []).map((t) => String(t).toLowerCase());
      return (
        cats.some((c) => c.includes("experiences") || c.includes("wellness")) ||
        tags.some(
          (t) =>
            t.includes("wellness") ||
            t.includes("spa") ||
            t.includes("yoga") ||
            t.includes("massage"),
        )
      );
    });

    return {
      staffPicksAll,
      nearYouAll,
      postSurfFuelAll,
      laptopFriendlyAll,
      sunsetSpotsAll,
      wellnessResetAll,
    };
  }, [filteredVenues, userLocation]);

  const handleViewAll = (key: SectionKey) => {
    setViewAllSection((prev) => (prev === key ? null : key));
  };

  const Section = ({
    sectionKey,
    title,
    venuesAll,
    collapsedCount,
  }: {
    sectionKey: SectionKey;
    title: string;
    venuesAll: typeof filteredVenues;
    collapsedCount: number;
  }) => {
    if (!venuesAll.length) return null;

    const expanded = viewAllSection === sectionKey;
    const canToggle = venuesAll.length > collapsedCount;
    const visibleVenues =
      expanded || !canToggle ? venuesAll : venuesAll.slice(0, collapsedCount);

    return (
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16, color: "#222" }}>
            {title}
          </div>
          {canToggle ? (
            <Typography.Link
              onClick={() => handleViewAll(sectionKey)}
              style={{ fontWeight: 800, fontSize: 12 }}
            >
              {expanded ? "Hide" : "View All"}
            </Typography.Link>
          ) : null}
        </div>

        <Row gutter={[12, 18]} justify="start">
          {visibleVenues.map((v) => (
            <Col
              key={String(v.id)}
              xs={24}
              sm={12}
              md={12}
              lg={6}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <VenueCard
                venue={v}
                variant="desktop"
                cardStyle={{ width: 250, height: 340 }}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <HeroDesktop
        onPrimaryClick={() => {
          window.open(
            "https://pass.ahangama.com",
            "_blank",
            "noopener,noreferrer",
          );
        }}
        onSecondaryClick={() => {
          document
            .getElementById("included")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <div style={{ marginBottom: 12 }}>
        <HowItWorks />
      </div>

      <div style={{ marginBottom: 12 }}>
        <FreeGuideCtaDesktop
          onGuideClick={() => {
            const text = encodeURIComponent(
              "Hi! I'd like the free Ahangama guide via WhatsApp.",
            );
            window.open(
              `https://wa.me/94777908790?text=${text}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <SavingsSummary />
      </div>

      <div id="included">
        {!loading && !error && venues.length > 0 ? (
          <VenueFiltersDesktop
            searchText={searchText}
            onSearchTextChange={setSearchText}
          />
        ) : null}
      </div>

      <div style={{ marginTop: 16, background: "var(--venue-listing-bg)" }}>
        {error ? (
          <Alert
            type="error"
            showIcon
            message="Could not load venues"
            description={
              <span>
                {error}. Tip: run locally with <code>netlify dev</code>.
              </span>
            }
          />
        ) : null}

        {loading ? (
          <div
            style={{ padding: 48, display: "flex", justifyContent: "center" }}
          >
            <Spin size="large" />
          </div>
        ) : null}

        {!loading && !error && venues.length === 0 ? (
          <Empty description="No venues found" />
        ) : null}

        {!loading &&
        !error &&
        venues.length > 0 &&
        filteredVenues.length === 0 ? (
          <Empty description="No venues match your filters" />
        ) : null}

        {!loading && !error && filteredVenues.length > 0 ? (
          <>
            <Section
              sectionKey="staff-picks"
              title="✨ Staff Picks"
              venuesAll={sections.staffPicksAll}
              collapsedCount={4}
            />
            <Section
              sectionKey="near-you"
              title="📍 Near You"
              venuesAll={sections.nearYouAll}
              collapsedCount={6}
            />
            <Section
              sectionKey="post-surf-fuel"
              title="🏄 Post-Surf Fuel"
              venuesAll={sections.postSurfFuelAll}
              collapsedCount={6}
            />
            <Section
              sectionKey="laptop-friendly"
              title="💻 Laptop Friendly"
              venuesAll={sections.laptopFriendlyAll}
              collapsedCount={6}
            />
            <Section
              sectionKey="sunset-spots"
              title="🌅 Sunset Spots"
              venuesAll={sections.sunsetSpotsAll}
              collapsedCount={4}
            />
            <Section
              sectionKey="wellness-reset"
              title="🌿 Wellness Reset"
              venuesAll={sections.wellnessResetAll}
              collapsedCount={4}
            />
          </>
        ) : null}
      </div>

      <FooterDesktop />
    </div>
  );
}
