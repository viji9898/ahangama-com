import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home";
import VenuesPage from "../pages/venues";
import PartnershipPage from "../pages/partnership";
import PartnersPage from "../pages/partners";
import PartnerSignupSuccessPage from "../pages/partners/success";
import LegalPage from "../pages/legal";
import NotFoundPage from "../pages/not-found";
import PassLandingPage from "../pages/PassLandingPage";
import { ResponsiveAppShell } from "../app/ResponsiveAppShell";
import { PartnerSignupShell } from "../app/PartnerSignupShell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ResponsiveAppShell>
        <HomePage />
      </ResponsiveAppShell>
    ),
  },
  {
    path: "/venues",
    element: (
      <ResponsiveAppShell>
        <VenuesPage />
      </ResponsiveAppShell>
    ),
  },
  {
    path: "/partners",
    element: (
      <ResponsiveAppShell>
        <HomePage />
      </ResponsiveAppShell>
    ),
  },
  {
    path: "/partnership",
    element: (
      <ResponsiveAppShell>
        <PartnershipPage />
      </ResponsiveAppShell>
    ),
  },
  {
    path: "/legal",
    element: (
      <ResponsiveAppShell>
        <LegalPage />
      </ResponsiveAppShell>
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
    path: "/pass",
    element: <PassLandingPage />,
  },
  {
    path: "/destinations/:destinationSlug",
    element: (
      <ResponsiveAppShell>
        <HomePage />
      </ResponsiveAppShell>
    ),
  },
  {
    path: "*",
    element: (
      <ResponsiveAppShell>
        <NotFoundPage />
      </ResponsiveAppShell>
    ),
  },
]);
