import { Alert, Empty, Spin, Switch, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AhangamaStatsBar from "../../components/AhangamaStatsBar";
import GuideDownloadSection from "../../components/GuideDownloadSection";
import PassEsimSection from "../../components/PassEsimSection";
import PricingClaritySection from "../../components/PricingClaritySection";
import StaySavingsHighlight from "../../components/StaySavingsHighlight";
import StaySavingsVenuesMap from "../../components/StaySavingsVenuesMap";
import TeamAdviceSection from "../../components/TeamAdviceSection";
import TripCalculator from "../../components/TripCalculator";
import { TripPlannerHero } from "../../components/TripPlannerHero";
import styles from "./Home.desktop.module.css";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import { VenueCard } from "../../components/VenueCard";
import {
  EDITORIAL_TAGS,
  getEditorialTagDescription,
} from "../../config/editorialTags";
import { useVenues } from "../../hooks/useVenues";
import { hasEditorialTag } from "../../utils/venueEditorial";
import { sortVenues } from "../../utils/venueList";

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

export default function HomeDesktop() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [passOnly, setPassOnly] = useState(false);
  const [editorialTag, setEditorialTag] = useState<string>("");
  const [selectedStay, setSelectedStay] = useState("samba");

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

  const distanceById = useMemo(() => {
    const map = new Map<string, number>();
    if (!userLocation) return map;

    for (const v of venues) {
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
  }, [venues, userLocation]);

  const sortedVenues = useMemo(
    () => sortVenues(venues, "curated", distanceById),
    [venues, distanceById],
  );

  const visibleVenues = useMemo(() => {
    let list = sortedVenues;
    if (passOnly) list = list.filter((v) => Boolean(v.isPassVenue));
    if (editorialTag)
      list = list.filter((v) => hasEditorialTag(v, editorialTag));
    return list;
  }, [sortedVenues, passOnly, editorialTag]);

  const buildVenuesHref = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({ destinationSlug, sort: "curated" });
    for (const [k, v] of Object.entries(overrides)) p.set(k, v);
    return `/venues?${p.toString()}`;
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <TripPlannerHero
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

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <AhangamaStatsBar />
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <GuideDownloadSection />
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <StaySavingsVenuesMap />
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <PassEsimSection />
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <TeamAdviceSection />
      </div>

      <div style={{ marginTop: 12, marginBottom: 12 }}>
        <PricingClaritySection
          onPrimaryClick={() => {
            window.open(
              "https://pass.ahangama.com",
              "_blank",
              "noopener,noreferrer",
            );
          }}
        />
      </div>

      {/* <div style={{ marginBottom: 12 }}>
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
      </div> */}

      {/* <div style={{ marginTop: 12 }}>
        <div
          style={{
            background: "var(--venue-card-bg)",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <Collapse
            defaultActiveKey={[]}
            ghost
            bordered={false}
            expandIconPosition="end"
            items={[
              {
                key: "what-is-pass",
                label: (
                  <span style={{ fontWeight: 900, fontSize: 14 }}>
                    What is the Ahangama Pass ?
                  </span>
                ),
                children: (
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ marginBottom: 12 }}>
                      <PassExplainerDesktop />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <SavingsSummary />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <HowItWorks />
                    </div>

                    <SocialProofBannerDesktop />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div> */}
      {/* 
      <div style={{ marginTop: 16 }}>
        <ItineraryPassSection
          onGetPassClick={() => {
            window.open(
              "https://pass.ahangama.com",
              "_blank",
              "noopener,noreferrer",
            );
          }}
          onSeeAllBenefitsClick={() => {
            document
              .getElementById("included")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          onViewSampleItineraryClick={() => {
            document
              .getElementById("included")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div> */}

      <div style={{ marginTop: 16 }}>
        <StaySavingsHighlight onSelectStay={setSelectedStay} />
      </div>

      <div style={{ marginTop: 16 }}>
        <TripCalculator
          selectedStay={selectedStay}
          onStayChange={setSelectedStay}
          onGetPassClick={() => {
            window.open(
              "https://pass.ahangama.com",
              "_blank",
              "noopener,noreferrer",
            );
          }}
          onViewSampleItineraryClick={() => {
            document
              .getElementById("included")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>

      <div
        id="included"
        className={styles.includedShell}
        style={{ marginTop: 16 }}
      >
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

        {!loading && !error && venues.length > 0 ? (
          <>
            <div style={{ marginTop: 18 }}>
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Tag
                    style={{
                      marginInlineEnd: 0,
                      fontWeight: 800,
                      borderRadius: 999,
                      padding: "2px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "default",
                    }}
                  >
                    Ahangama Pass
                    <Switch
                      checked={passOnly}
                      onChange={setPassOnly}
                      size="small"
                      aria-label="Toggle: show Ahangama Pass venues only"
                    />
                  </Tag>

                  <Tag.CheckableTag
                    checked={!editorialTag}
                    onChange={() => setEditorialTag("")}
                    style={{
                      fontWeight: 800,
                      borderRadius: 999,
                      padding: "4px 12px",
                      marginInlineEnd: 0,
                    }}
                  >
                    All
                  </Tag.CheckableTag>

                  {EDITORIAL_TAGS.slice(0, 12).map((tag) => {
                    const active = editorialTag === tag;
                    return (
                      <Tag.CheckableTag
                        key={tag}
                        checked={active}
                        onChange={() => setEditorialTag(active ? "" : tag)}
                        style={{
                          fontWeight: 800,
                          borderRadius: 999,
                          padding: "4px 12px",
                          marginInlineEnd: 0,
                        }}
                      >
                        {tag}
                      </Tag.CheckableTag>
                    );
                  })}

                  <Link
                    to={buildVenuesHref({
                      ...(passOnly ? { pass: "1" } : {}),
                      ...(editorialTag ? { tag: editorialTag } : {}),
                    })}
                    style={{ textDecoration: "none" }}
                  >
                    <Tag
                      style={{
                        marginInlineEnd: 0,
                        fontWeight: 800,
                        borderRadius: 999,
                        padding: "2px 12px",
                        cursor: "pointer",
                      }}
                    >
                      View all
                    </Tag>
                  </Link>
                </div>

                {editorialTag ? (
                  <div
                    style={{
                      marginTop: 8,
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: "rgba(255,255,255,0.92)",
                      borderRadius: 12,
                      padding: 10,
                    }}
                    aria-live="polite"
                  >
                    <div
                      style={{ fontWeight: 900, fontSize: 12, color: "#222" }}
                    >
                      Editorial tag: {editorialTag}
                    </div>
                    <div style={{ marginTop: 2, fontSize: 12, color: "#666" }}>
                      {getEditorialTagDescription(editorialTag) ??
                        "Curated by Ahangama. Showing venues that match this vibe."}
                    </div>
                  </div>
                ) : null}
              </div>

              {visibleVenues.length === 0 ? (
                <Empty
                  description={
                    passOnly && editorialTag
                      ? "No pass venues found for this editorial tag"
                      : passOnly
                        ? "No pass venues found"
                        : editorialTag
                          ? "No venues found for this editorial tag"
                          : "No venues found"
                  }
                />
              ) : (
                <div
                  role="list"
                  aria-label="Included venues"
                  className={styles.venueScroller}
                >
                  {visibleVenues.map((v) => (
                    <div
                      key={String(v.id)}
                      role="listitem"
                      className={styles.venueItem}
                    >
                      <VenueCard
                        venue={v}
                        variant="desktop"
                        distanceKm={distanceById.get(String(v.id)) ?? null}
                        cardStyle={{ width: 280, height: 418 }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      <FooterDesktop />
    </div>
  );
}
