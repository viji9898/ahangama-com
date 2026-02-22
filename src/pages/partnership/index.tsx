import { Suspense, lazy } from "react";
import { Spin } from "antd";
import { useIsMobile } from "../../hooks/useIsMobile";

const PartnershipMobile = lazy(() => import("./Partnership.mobile"));
const PartnershipDesktop = lazy(() => import("./Partnership.desktop"));

export default function PartnershipPage() {
  const isMobile = useIsMobile();

  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      }
    >
      {isMobile ? <PartnershipMobile /> : <PartnershipDesktop />}
    </Suspense>
  );
}
