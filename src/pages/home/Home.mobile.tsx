import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useVenues } from "../../hooks/useVenues";
import { GetPassBarMobile } from "./components/GetPassBar.mobile";
import { HeroBannerMobile } from "./components/HeroBanner.mobile";
import type { LatLng } from "./components/geo.mobile";
import { getDistanceFromLatLonInKm } from "./components/geo.mobile";
import { TopRatedCafesMobile } from "./components/TopRatedCafes.mobile";
import { VenueListMobile } from "./components/VenueList.mobile";
import { VenueSearchAndCategoriesMobile } from "./components/VenueSearchAndCategories.mobile";

export default function HomeMobile() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

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
      <HeroBannerMobile imageUrl="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero_banner_v3.jpg" />
      <GetPassBarMobile />

      <VenueSearchAndCategoriesMobile
        search={search}
        onSearchChange={setSearch}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 8,
          paddingBottom: 96,
        }}
      >
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
          <VenueListMobile
            venues={filteredVenues}
            userLocation={userLocation}
          />
        ) : null}

        {!loading && !error && venues.length > 0 ? (
          <TopRatedCafesMobile venues={venues} />
        ) : null}
      </div>
    </div>
  );
}
