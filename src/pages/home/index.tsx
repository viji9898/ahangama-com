import { Suspense, lazy } from "react";
import { Spin } from "antd";
import { useIsMobile } from "../../hooks/useIsMobile";

const HomeMobile = lazy(() => import("./Home.mobile"));
const HomeDesktop = lazy(() => import("./Home.desktop"));

export default function HomePage() {
  const isMobile = useIsMobile();

  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, display: "flex", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      }
    >
      {isMobile ? <HomeMobile /> : <HomeDesktop />}
    </Suspense>
  );
}
