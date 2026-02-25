import type { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { useIsMobile } from "../hooks/useIsMobile";
import { MobileAppShell } from "./MobileAppShell";

type Props = {
  children: ReactNode;
};

export function ResponsiveAppShell({ children }: Props) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <MobileAppShell>{children}</MobileAppShell>
  ) : (
    <AppShell>{children}</AppShell>
  );
}
