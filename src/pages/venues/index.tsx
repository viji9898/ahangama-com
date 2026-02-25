import { Suspense, lazy } from "react";
import { Spin } from "antd";
import { useIsMobile } from "../../hooks/useIsMobile";

const VenuesMobile = lazy(() => import("./Venues.mobile"));
const VenuesDesktop = lazy(() => import("./Venues.desktop"));

export default function VenuesPage() {
  const isMobile = useIsMobile();

  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      }
    >
      {isMobile ? <VenuesMobile /> : <VenuesDesktop />}
    </Suspense>
  );
}
