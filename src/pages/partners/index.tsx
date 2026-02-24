import { Suspense, lazy } from "react";
import { Spin } from "antd";
import { useIsMobile } from "../../hooks/useIsMobile";

const PartnersMobile = lazy(() => import("./Partners.mobile"));
const PartnersDesktop = lazy(() => import("./Partners.desktop"));

export default function PartnersPage() {
  const isMobile = useIsMobile();

  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      }
    >
      {isMobile ? <PartnersMobile /> : <PartnersDesktop />}
    </Suspense>
  );
}
