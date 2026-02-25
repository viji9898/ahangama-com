import type { VenuesResponse } from "../types/venue";
import { mapVenueFromApi } from "../utils/mapVenueFromApi";

type GetVenuesArgs = {
  destinationSlug: string;
  liveOnly?: boolean;
  category?: string;
};

export async function getVenues({
  destinationSlug,
  liveOnly = true,
  category,
}: GetVenuesArgs): Promise<VenuesResponse> {
  const params = new URLSearchParams({
    destinationSlug,
    liveOnly: liveOnly ? "true" : "false",
  });
  if (category) params.set("category", category);

  const res = await fetch(
    `/.netlify/functions/get-venues?${params.toString()}`,
  );

  let data: unknown;
  try {
    data = (await res.json()) as unknown;
  } catch {
    return { ok: false, error: "Invalid JSON response" };
  }

  if (!res.ok) return { ok: false, error: `Request failed (${res.status})` };

  if (
    data &&
    typeof data === "object" &&
    (data as { ok?: unknown }).ok === true &&
    Array.isArray((data as { venues?: unknown }).venues)
  ) {
    const venues = (data as { venues: unknown[] }).venues.map(mapVenueFromApi);
    return { ok: true, venues };
  }

  if (
    data &&
    typeof data === "object" &&
    (data as { ok?: unknown }).ok === false &&
    typeof (data as { error?: unknown }).error === "string"
  ) {
    return { ok: false, error: (data as { error: string }).error };
  }

  return { ok: false, error: "Unexpected response shape" };
}
