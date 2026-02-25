import { EDITORIAL_TAGS } from "../config/editorialTags";
import type { Venue } from "../types/venue";

const tagPriority = new Map<string, number>(
  EDITORIAL_TAGS.map((tag, idx) => [tag, idx]),
);

export function getValidatedEditorialTags(venue: Venue): string[] {
  const raw = Array.isArray(venue.editorialTags) ? venue.editorialTags : [];
  return raw.filter(
    (t): t is string => typeof t === "string" && tagPriority.has(t),
  );
}

export function getTopEditorialTags(venue: Venue, limit = 2): string[] {
  return getValidatedEditorialTags(venue)
    .slice()
    .sort((a, b) => (tagPriority.get(a) ?? 9999) - (tagPriority.get(b) ?? 9999))
    .slice(0, Math.max(0, limit));
}

export function isLaptopFriendlyVenue(venue: Venue): boolean {
  if (venue.laptopFriendly) return true;
  return getValidatedEditorialTags(venue).includes("Laptop-Friendly");
}

export function hasEditorialTag(venue: Venue, tag: string): boolean {
  return getValidatedEditorialTags(venue).includes(tag);
}
