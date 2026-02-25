import type { PowerBackup, Venue } from "../types/venue";
import { hasEditorialTag, isLaptopFriendlyVenue } from "./venueEditorial";
import { EDITORIAL_TAGS } from "../config/editorialTags";

export type VenueSortKey = "curated" | "top" | "reviews" | "nearest";

export type VenueListQuery = {
  q: string;
  pass: boolean;
  pick: boolean;
  laptop: boolean;
  power: PowerBackup | "";
  tag: string;
  sort: VenueSortKey;
};

function toBoolFlag(value: string | null): boolean {
  if (!value) return false;
  const s = value.trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

function toPower(value: string | null): PowerBackup | "" {
  if (!value) return "";
  const s = value.trim().toLowerCase();
  if (s === "generator" || s === "inverter" || s === "none" || s === "unknown")
    return s;
  return "";
}

function toSort(value: string | null): VenueSortKey {
  const s = (value ?? "").trim().toLowerCase();
  if (s === "curated" || s === "top" || s === "reviews" || s === "nearest")
    return s;
  return "curated";
}

export function parseVenueListQuery(params: URLSearchParams): VenueListQuery {
  const tagRaw = params.get("tag") ?? "";
  const tag = EDITORIAL_TAGS.includes(tagRaw as (typeof EDITORIAL_TAGS)[number])
    ? tagRaw
    : "";

  return {
    q: params.get("q") ?? "",
    pass: toBoolFlag(params.get("pass")),
    pick: toBoolFlag(params.get("pick")),
    laptop: toBoolFlag(params.get("laptop")),
    power: toPower(params.get("power")),
    tag,
    sort: toSort(params.get("sort")),
  };
}

export function applyVenueListQuery(
  params: URLSearchParams,
  next: Partial<VenueListQuery>,
): URLSearchParams {
  const out = new URLSearchParams(params);

  const setOrDelete = (key: string, value: string) => {
    const v = value.trim();
    if (!v) out.delete(key);
    else out.set(key, v);
  };

  if (next.q !== undefined) setOrDelete("q", next.q);
  if (next.tag !== undefined) setOrDelete("tag", next.tag);

  if (next.pass !== undefined)
    next.pass ? out.set("pass", "1") : out.delete("pass");
  if (next.pick !== undefined)
    next.pick ? out.set("pick", "1") : out.delete("pick");
  if (next.laptop !== undefined)
    next.laptop ? out.set("laptop", "1") : out.delete("laptop");

  if (next.power !== undefined) {
    const p = next.power;
    if (!p) out.delete("power");
    else out.set("power", p);
  }

  if (next.sort !== undefined) {
    const s = next.sort;
    if (!s || s === "curated") out.delete("sort");
    else out.set("sort", s);
  }

  return out;
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function haystack(v: Venue): string {
  return [
    v.name,
    v.area,
    v.excerpt,
    v.cardPerk,
    ...(v.categories ?? []),
    ...(v.bestFor ?? []),
    ...(v.tags ?? []),
    ...(v.editorialTags ?? []),
  ]
    .filter((x): x is string => Boolean(x))
    .join(" ")
    .toLowerCase();
}

export function filterVenues(venues: Venue[], query: VenueListQuery): Venue[] {
  const q = query.q.trim().toLowerCase();

  return venues.filter((v) => {
    if (query.pass && !v.isPassVenue) return false;
    if (query.pick && !v.staffPick) return false;
    if (query.laptop && !isLaptopFriendlyVenue(v)) return false;
    if (query.power && v.powerBackup !== query.power) return false;
    if (query.tag && !hasEditorialTag(v, query.tag)) return false;

    if (!q) return true;
    return haystack(v).includes(q);
  });
}

export function sortVenues(
  venues: Venue[],
  sort: VenueSortKey,
  distanceById?: Map<string, number>,
): Venue[] {
  const list = venues.slice();

  if (sort === "nearest") {
    if (!distanceById) return list;
    return list.sort((a, b) => {
      const da = distanceById.get(String(a.id));
      const db = distanceById.get(String(b.id));
      if (da == null && db == null) return 0;
      if (da == null) return 1;
      if (db == null) return -1;
      return da - db;
    });
  }

  if (sort === "top") {
    return list.sort((a, b) => toNumber(b.stars) - toNumber(a.stars));
  }

  if (sort === "reviews") {
    return list.sort((a, b) => toNumber(b.reviews) - toNumber(a.reviews));
  }

  // curated
  return list.sort((a, b) => {
    const score = (x: Venue) => x.priorityScore ?? 0;
    const staff = (x: Venue) => (x.staffPick ? 1 : 0);
    const stars = (x: Venue) => toNumber(x.stars);
    const reviews = (x: Venue) => toNumber(x.reviews);

    return (
      score(b) - score(a) ||
      staff(b) - staff(a) ||
      stars(b) - stars(a) ||
      reviews(b) - reviews(a)
    );
  });
}
