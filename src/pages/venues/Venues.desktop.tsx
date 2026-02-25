import { Alert, Col, Empty, Row, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VenueFiltersDesktop } from "../../components/desktop/VenueFilters.Desktop";
import { VenueCard } from "../../components/VenueCard";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import { useVenues } from "../../hooks/useVenues";
import type { Venue } from "../../types/venue";
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

export default function VenuesDesktop() {
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
      { enableHighAccuracy: false, timeout: 8000 },
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

      const distanceKm = getDistanceFromLatLonInKm(
        userLocation.lat,
        userLocation.lng,
        pos.lat,
        pos.lng,
      );
      if (!Number.isFinite(distanceKm)) continue;
      map.set(String(v.id), distanceKm);
    }

    return map;
  }, [filteredVenues, userLocation]);

  const nearestAvailable = userLocation != null && distanceById.size > 0;

  const sortedVenues = useMemo(
    () => sortVenues(filteredVenues, query.sort, distanceById),
    [filteredVenues, query.sort, distanceById],
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {!loading && !error && venues.length > 0 ? (
        <VenueFiltersDesktop
          value={query}
          nearestAvailable={nearestAvailable}
          onChange={(next) => {
            setSearchParams(applyVenueListQuery(searchParams, next), {
              replace: true,
            });
          }}
        />
      ) : null}

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

        {!loading && !error && sortedVenues.length > 0 ? (
          <Row gutter={[12, 18]} justify="start">
            {sortedVenues.map((v: Venue) => (
              <Col
                key={String(v.id)}
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                style={{ display: "flex", justifyContent: "flex-start" }}
              >
                <VenueCard
                  venue={v}
                  variant="desktop"
                  distanceKm={distanceById.get(String(v.id)) ?? null}
                  cardStyle={{ width: 250, height: 340 }}
                />
              </Col>
            ))}
          </Row>
        ) : null}
      </div>

      <FooterDesktop />
    </div>
  );
}
