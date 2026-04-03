import { Alert, Button, Spin, Typography } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { PLACES } from "../data/places";

const { Text } = Typography;

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

function createVenueOverlay(googleMaps, map, place) {
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
      container.style.cursor = place.mapUrl ? "pointer" : "default";
      container.style.userSelect = "none";

      const card = document.createElement("div");
      card.style.display = "grid";
      card.style.gap = "2px";
      card.style.padding = "8px 10px";
      card.style.borderRadius = "14px";
      card.style.border = "1px solid rgba(15, 118, 110, 0.22)";
      card.style.background = "rgba(255,255,255,0.95)";
      card.style.boxShadow = "0 8px 18px rgba(0,0,0,0.16)";
      card.style.backdropFilter = "blur(8px)";
      card.style.whiteSpace = "nowrap";

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
      pin.style.background = "#0f766e";
      pin.style.border = "2px solid rgba(255,255,255,0.96)";
      pin.style.boxShadow = "0 4px 10px rgba(0,0,0,0.18)";

      card.appendChild(title);
      card.appendChild(offer);
      container.appendChild(card);
      container.appendChild(pin);

      if (place.mapUrl) {
        container.addEventListener("click", () => {
          window.open(place.mapUrl, "_blank", "noopener,noreferrer");
        });
      }

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
      const overlay = createVenueOverlay(googleMaps, mapRef.current, place);
      overlaysRef.current.push(overlay);
      bounds.extend({ lat: place.lat, lng: place.lng });
    });

    if (mapPlaces.length === 1) {
      mapRef.current.setCenter({
        lat: mapPlaces[0].lat,
        lng: mapPlaces[0].lng,
      });
      mapRef.current.setZoom(15);
    } else if (mapPlaces.length > 1) {
      mapRef.current.fitBounds(bounds, 56);
    }

    return () => {
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [mapPlaces, status]);

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
