import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import { VenueFiltersMobile } from "../../components/mobile/VenueFilters.Mobile";
import { HomeVenueCardMobile } from "../../components/mobile/HomeVenueCard.Mobile";
import { useVenues } from "../../hooks/useVenues";
import {
  applyVenueListQuery,
  filterVenues,
  parseVenueListQuery,
  sortVenues,
} from "../../utils/venueList";

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

export default function VenuesMobile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(
    () => parseVenueListQuery(searchParams),
    [searchParams],
  );

  const destinationSlug =
    (searchParams.get("destinationSlug") ?? "ahangama").trim() || "ahangama";

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

  const filteredVenues = useMemo(
    () => filterVenues(venues, query),
    [venues, query],
  );

  const distanceById = useMemo(() => {
    const map = new Map<string, number>();
    if (!userLocation) return map;

    for (const v of filteredVenues) {
      const pos =
        v.position?.lat != null && v.position?.lng != null
          ? v.position
          : v.lat != null && v.lng != null
            ? { lat: v.lat, lng: v.lng }
            : null;
      if (!pos) continue;
      const distance = getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        pos.lat,
        pos.lng,
      );
      if (!Number.isFinite(distance)) continue;
      map.set(String(v.id), distance);
    }

    return map;
  }, [filteredVenues, userLocation]);

  const nearestAvailable = userLocation != null && distanceById.size > 0;

  const sortedVenues = useMemo(
    () => sortVenues(filteredVenues, query.sort, distanceById),
    [filteredVenues, query.sort, distanceById],
  );

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 0,
        minHeight: "100vh",
        background: "var(--venue-listing-bg)",
      }}
    >
      <VenueFiltersMobile
        value={query}
        nearestAvailable={nearestAvailable}
        onChange={(next) => {
          setSearchParams(applyVenueListQuery(searchParams, next), {
            replace: true,
          });
        }}
      />

      <div style={{ padding: 12 }}>
        {error ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              borderRadius: 16,
              padding: 12,
              color: "#7A1F1F",
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

        {!loading && !error && venues.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            No venues found.
          </div>
        ) : null}

        {!loading &&
        !error &&
        venues.length > 0 &&
        sortedVenues.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            No venues match your filters.
          </div>
        ) : null}

        {!loading && !error && sortedVenues.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {sortedVenues.map((v) => {
              const distanceKm = distanceById.get(String(v.id)) ?? null;
              return (
                <HomeVenueCardMobile
                  key={String(v.id)}
                  venue={v}
                  variant="list"
                  distanceKm={distanceKm}
                  style={{ border: "1px solid rgba(0,0,0,0.04)" }}
                />
              );
            })}
          </div>
        ) : null}

        <div style={{ marginTop: 16 }}>
          <FooterDesktop />
        </div>
      </div>
    </div>
  );
}
