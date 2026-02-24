import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/home";
import PartnershipPage from "../pages/partnership";
import PartnersPage from "../pages/partners";
import NotFoundPage from "../pages/not-found";
import { AppShell } from "../app/AppShell";

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
    path: "/partnership",
    element: (
      <AppShell>
        <PartnershipPage />
      </AppShell>
    ),
  },
  {
    path: "/partner-signup",
    element: (
      <AppShell>
        <PartnersPage />
      </AppShell>
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
