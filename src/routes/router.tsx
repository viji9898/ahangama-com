import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home";
import VenuesPage from "../pages/venues";
import PartnershipPage from "../pages/partnership";
import PartnersPage from "../pages/partners";
import PartnerSignupSuccessPage from "../pages/partners/success";
import LegalPage from "../pages/legal";
import NotFoundPage from "../pages/not-found";
import { AppShell } from "../app/AppShell";
import { PartnerSignupShell } from "../app/PartnerSignupShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    ),
  },
  {
    path: "/venues",
    element: (
      <AppShell>
        <VenuesPage />
      </AppShell>
    ),
  },
  {
    path: "/partners",
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    ),
  },
  {
    path: "/partnership",
    element: (
      <AppShell>
        <PartnershipPage />
      </AppShell>
    ),
  },
  {
    path: "/legal",
    element: (
      <AppShell>
        <LegalPage />
      </AppShell>
    ),
  },
  {
    path: "/partner-signup",
    element: (
      <PartnerSignupShell>
        <PartnersPage />
      </PartnerSignupShell>
    ),
  },
  {
    path: "/partner-signup/success",
    element: (
      <PartnerSignupShell>
        <PartnerSignupSuccessPage />
      </PartnerSignupShell>
    ),
  },
  {
    path: "/destinations/:destinationSlug",
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    ),
  },
  {
    path: "*",
    element: (
      <AppShell>
        <NotFoundPage />
      </AppShell>
    ),
  },
]);
