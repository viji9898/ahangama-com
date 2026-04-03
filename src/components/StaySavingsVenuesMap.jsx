import {
  EnvironmentOutlined,
  InstagramOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Alert, Button, Spin, Tag, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { PLACES } from "../data/places";

const { Paragraph, Text, Title } = Typography;

const GOOGLE_MAPS_SCRIPT_ID = "ahangama-google-maps-script";
let googleMapsLoaderPromise;

function loadGoogleMapsApi(apiKey) {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps can only load in the browser."),
    );
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsLoaderPromise) {
    return googleMapsLoaderPromise;
  }

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);

    const handleLoad = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
        return;
      }

      reject(new Error("Google Maps loaded without exposing the maps API."));
    };

    const handleError = () => {
      reject(new Error("Failed to load Google Maps."));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = handleLoad;
    script.onerror = handleError;
    document.head.appendChild(script);
  });

  return googleMapsLoaderPromise;
}

function formatDiscountLabel(place) {
  if (typeof place.discount === "number" && Number.isFinite(place.discount)) {
    return `${Math.round(place.discount * 100)}% off`;
  }

  if (typeof place.discount === "string" && place.discount.trim()) {
    return place.discount.trim();
  }

  if (Array.isArray(place.offer) && place.offer[0]) {
    return String(place.offer[0]);
  }

  return "Pass offer";
}

function formatInstagramUrl(place) {
  if (typeof place.instagramUrl === "string" && place.instagramUrl.trim()) {
    return place.instagramUrl.trim();
  }

  if (typeof place.instagram === "string" && place.instagram.trim()) {
    const handle = place.instagram.trim().replace(/^@/, "");
    return `https://www.instagram.com/${handle}/`;
  }

  return null;
}

function formatRatingLine(place) {
  const stars =
    typeof place.stars === "number"
      ? place.stars
      : typeof place.stars === "string"
        ? Number.parseFloat(place.stars)
        : null;

  const reviews =
    typeof place.reviews === "number"
      ? place.reviews
      : typeof place.reviews === "string"
        ? Number.parseFloat(place.reviews)
        : null;

  if (stars == null || !Number.isFinite(stars)) {
    return null;
  }

  if (reviews != null && Number.isFinite(reviews)) {
    return `${stars.toFixed(1)} • ${Math.round(reviews)} reviews`;
  }

  return `${stars.toFixed(1)}`;
}

function createVenueOverlay(googleMaps, map, place, selectedPlaceId, onSelect) {
  class VenueOverlay extends googleMaps.OverlayView {
    constructor() {
      super();
      this.container = null;
    }

    onAdd() {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.transform = "translate(-50%, calc(-100% - 10px))";
      container.style.pointerEvents = "auto";
      container.style.cursor = "pointer";
      container.style.userSelect = "none";

      const card = document.createElement("div");
      card.style.display = "grid";
      card.style.gap = "2px";
      card.style.padding = "8px 10px";
      card.style.borderRadius = "14px";
      card.style.border =
        place.id === selectedPlaceId
          ? "1px solid rgba(15, 118, 110, 0.42)"
          : "1px solid rgba(15, 118, 110, 0.22)";
      card.style.background =
        place.id === selectedPlaceId
          ? "rgba(230,255,249,0.98)"
          : "rgba(255,255,255,0.95)";
      card.style.boxShadow =
        place.id === selectedPlaceId
          ? "0 12px 26px rgba(0,0,0,0.18)"
          : "0 8px 18px rgba(0,0,0,0.16)";
      card.style.backdropFilter = "blur(8px)";
      card.style.whiteSpace = "nowrap";
      card.style.transition = "transform 140ms ease, box-shadow 180ms ease";

      const title = document.createElement("div");
      title.textContent = place.name;
      title.style.fontWeight = "800";
      title.style.fontSize = "12px";
      title.style.lineHeight = "1.2";
      title.style.color = "#0f172a";

      const offer = document.createElement("div");
      offer.textContent = formatDiscountLabel(place);
      offer.style.fontWeight = "700";
      offer.style.fontSize = "11px";
      offer.style.lineHeight = "1.2";
      offer.style.color = "#0f766e";

      const pin = document.createElement("div");
      pin.style.width = "12px";
      pin.style.height = "12px";
      pin.style.borderRadius = "999px";
      pin.style.margin = "6px auto 0";
      pin.style.background = place.id === selectedPlaceId ? "#0b5f61" : "#0f766e";
      pin.style.border = "2px solid rgba(255,255,255,0.96)";
      pin.style.boxShadow = "0 4px 10px rgba(0,0,0,0.18)";

      card.appendChild(title);
      card.appendChild(offer);
      container.appendChild(card);
      container.appendChild(pin);

      container.addEventListener("click", () => {
        onSelect(place.id);
      });

      this.container = container;
      this.getPanes().overlayMouseTarget.appendChild(container);
    }

    draw() {
      if (!this.container) {
        return;
      }

      const projection = this.getProjection();
      if (!projection) {
        return;
      }

      const point = projection.fromLatLngToDivPixel(
        new googleMaps.LatLng(place.lat, place.lng),
      );

      if (!point) {
        return;
      }

      this.container.style.left = `${point.x}px`;
      this.container.style.top = `${point.y}px`;
    }

    onRemove() {
      if (this.container?.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.container = null;
    }
  }

  const overlay = new VenueOverlay();
  overlay.setMap(map);
  return overlay;
}

export default function StaySavingsVenuesMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const savedMapUrl = "https://map.ahangama.com";
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const overlaysRef = useRef([]);
  const hasInitializedViewportRef = useRef(false);
  const hasUserSelectedVenueRef = useRef(false);
  const [status, setStatus] = useState(apiKey ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState(
    apiKey ? "" : "Google Maps API key is missing from the Vite environment.",
  );

  const mapPlaces = useMemo(() => {
    return PLACES.filter(
      (place) =>
        place?.status === "active" &&
        place?.lat != null &&
        place?.lng != null &&
        (place?.discount != null ||
          (Array.isArray(place?.offer) && place.offer.length)),
    );
  }, []);

  const [selectedPlaceId, setSelectedPlaceId] = useState(
    () => mapPlaces[0]?.id ?? null,
  );

  const selectedPlace = useMemo(() => {
    return mapPlaces.find((place) => place.id === selectedPlaceId) ?? mapPlaces[0] ?? null;
  }, [mapPlaces, selectedPlaceId]);

  function handleSelectPlace(placeId) {
    hasUserSelectedVenueRef.current = true;
    setSelectedPlaceId(placeId);
  }

  useEffect(() => {
    let isCancelled = false;

    if (!apiKey) {
      return undefined;
    }

    loadGoogleMapsApi(apiKey)
      .then(() => {
        if (isCancelled) return;
        setStatus("ready");
      })
      .catch((error) => {
        if (isCancelled) return;
        setStatus("error");
        setErrorMessage(error.message || "Failed to load Google Maps.");
      });

    return () => {
      isCancelled = true;
    };
  }, [apiKey]);

  useEffect(() => {
    if (status !== "ready" || !mapElementRef.current || !window.google?.maps) {
      return undefined;
    }

    const googleMaps = window.google.maps;

    if (!mapRef.current) {
      mapRef.current = new googleMaps.Map(mapElementRef.current, {
        center: { lat: 5.9717, lng: 80.3671 },
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        gestureHandling: "cooperative",
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    const bounds = new googleMaps.LatLngBounds();

    mapPlaces.forEach((place) => {
      const overlay = createVenueOverlay(
        googleMaps,
        mapRef.current,
        place,
        selectedPlaceId,
        handleSelectPlace,
      );
      overlaysRef.current.push(overlay);
      bounds.extend({ lat: place.lat, lng: place.lng });
    });

    if (!hasInitializedViewportRef.current) {
      if (mapPlaces.length === 1) {
        mapRef.current.setCenter({
          lat: mapPlaces[0].lat,
          lng: mapPlaces[0].lng,
        });
        mapRef.current.setZoom(15);
      } else if (mapPlaces.length > 1) {
        mapRef.current.fitBounds(bounds, 56);
      }

      hasInitializedViewportRef.current = true;
    }

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [mapPlaces, selectedPlaceId, status]);

  const instagramUrl = selectedPlace ? formatInstagramUrl(selectedPlace) : null;
  const ratingLine = selectedPlace ? formatRatingLine(selectedPlace) : null;
  const tags = selectedPlace?.tags?.length
    ? selectedPlace.tags
    : selectedPlace?.bestFor?.length
      ? selectedPlace.bestFor
      : [];

  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.82)",
        padding: 18,
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <Text
          style={{
            color: "rgba(0,0,0,0.86)",
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: -0.3,
          }}
        >
          Pass venues map
        </Text>
        <Text style={{ color: "rgba(0,0,0,0.60)", fontWeight: 650 }}>
          Browse nearby partner spots with the venue name and pass discount
          shown directly on the map.
        </Text>
      </div>

      {status === "error" ? (
        <Alert type="warning" showIcon message={errorMessage} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(300px, 0.9fr) minmax(0, 1.4fr)",
            gap: 14,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.88)",
              padding: 16,
              display: "grid",
              gap: 14,
              minHeight: 420,
            }}
          >
            {selectedPlace ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 18,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "rgba(255,255,255,0.92)",
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {selectedPlace.logo ? (
                      <img
                        src={selectedPlace.logo}
                        alt={`${selectedPlace.name} logo`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 900, color: "rgba(0,0,0,0.62)" }}>
                        {selectedPlace.name.slice(0, 1)}
                      </span>
                    )}
                  </div>

                  <div style={{ minWidth: 0, display: "grid", gap: 4 }}>
                    <Title level={4} style={{ margin: 0, fontWeight: 950, letterSpacing: -0.4 }}>
                      {selectedPlace.name}
                    </Title>
                    <Text style={{ color: "rgba(0,0,0,0.58)", fontWeight: 700 }}>
                      {selectedPlace.area || selectedPlace.category || "Ahangama"}
                    </Text>
                    {ratingLine ? (
                      <Text style={{ color: "rgba(0,0,0,0.68)", fontWeight: 800 }}>
                        <StarFilled style={{ color: "#f59e0b", marginRight: 6 }} />
                        {ratingLine}
                      </Text>
                    ) : null}
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(22,163,166,0.18)",
                    background: "rgba(22,163,166,0.08)",
                    padding: 14,
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(0,0,0,0.5)",
                      fontWeight: 850,
                      fontSize: 11,
                      letterSpacing: 0.9,
                      textTransform: "uppercase",
                    }}
                  >
                    Pass discount
                  </Text>
                  <div
                    style={{
                      color: "rgba(0,0,0,0.88)",
                      fontWeight: 950,
                      fontSize: 26,
                      letterSpacing: -0.7,
                      lineHeight: 1,
                    }}
                  >
                    {formatDiscountLabel(selectedPlace)}
                  </div>
                  <Text style={{ color: "rgba(0,0,0,0.6)", fontWeight: 700 }}>
                    {selectedPlace.cardPerk || selectedPlace.excerpt || selectedPlace.description}
                  </Text>
                </div>

                <Paragraph
                  style={{ margin: 0, color: "rgba(0,0,0,0.64)", fontWeight: 650, lineHeight: 1.6 }}
                >
                  {selectedPlace.description || selectedPlace.excerpt}
                </Paragraph>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.slice(0, 6).map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        marginInlineEnd: 0,
                        borderRadius: 999,
                        paddingInline: 10,
                        fontWeight: 800,
                        background: "rgba(255,255,255,0.92)",
                        borderColor: "rgba(0,0,0,0.08)",
                        color: "rgba(0,0,0,0.74)",
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>

                <div style={{ display: "grid", gap: 10, marginTop: "auto" }}>
                  {selectedPlace.mapUrl ? (
                    <Button
                      block
                      type="default"
                      icon={<EnvironmentOutlined />}
                      onClick={() => {
                        window.open(selectedPlace.mapUrl, "_blank", "noopener,noreferrer");
                      }}
                      style={{
                        minHeight: 44,
                        borderRadius: 14,
                        fontWeight: 850,
                        background: "rgba(255,255,255,0.94)",
                        borderColor: "rgba(0,0,0,0.12)",
                        color: "rgba(0,0,0,0.82)",
                      }}
                    >
                      Open in Google Maps
                    </Button>
                  ) : null}

                  {instagramUrl ? (
                    <Button
                      block
                      type="default"
                      icon={<InstagramOutlined />}
                      onClick={() => {
                        window.open(instagramUrl, "_blank", "noopener,noreferrer");
                      }}
                      style={{
                        minHeight: 44,
                        borderRadius: 14,
                        fontWeight: 850,
                        background: "rgba(255,255,255,0.94)",
                        borderColor: "rgba(0,0,0,0.12)",
                        color: "rgba(0,0,0,0.82)",
                      }}
                    >
                      View Instagram
                    </Button>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          <div style={{ position: "relative" }}>
            <div
              ref={mapElementRef}
              aria-label="Ahangama pass venues map"
              style={{
                width: "100%",
                minHeight: 340,
                height: 420,
                borderRadius: 18,
                overflow: "hidden",
                background:
                  "linear-gradient(135deg, rgba(22,163,166,0.10), rgba(255,255,255,0.92))",
              }}
            />

            {status === "loading" ? (
              <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 18,
                background: "rgba(255,255,255,0.72)",
              }}
              >
                <Spin size="large" />
              </div>
            ) : null}
          </div>
        </div>
      )}

      <Button
        block
        type="primary"
        onClick={() => {
          window.open(savedMapUrl, "_blank", "noopener,noreferrer");
        }}
        style={{
          borderRadius: 14,
          fontWeight: 900,
          border: "none",
          minHeight: 46,
          background:
            "linear-gradient(135deg, rgba(22,163,166,1) 0%, rgba(70,214,182,0.98) 100%)",
          boxShadow: "0 12px 26px rgba(0,0,0,0.14)",
        }}
      >
        Open saved Google Map list
      </Button>
    </div>
  );
}
