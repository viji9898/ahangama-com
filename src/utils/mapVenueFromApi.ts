import type { PowerBackup, Venue, VenuePosition } from "../types/venue";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readFirstDefined(
  row: Record<string, unknown>,
  keys: string[],
): unknown {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
}

function coerceString(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function coerceBoolean(value: unknown): boolean | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(s)) return true;
    if (["false", "0", "no", "n"].includes(s)) return false;
  }
  return null;
}

function coerceNumber(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function coerceStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((x) => (x == null ? "" : String(x).trim()))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const s = value.trim();
    if (!s) return [];

    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s) as unknown;
        if (Array.isArray(parsed)) return coerceStringArray(parsed);
      } catch {
        // ignore
      }
    }

    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
}

function coerceUnknownArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

const POWER_BACKUP_VALUES: PowerBackup[] = [
  "generator",
  "inverter",
  "none",
  "unknown",
];

function coercePowerBackup(value: unknown): PowerBackup {
  const raw = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (POWER_BACKUP_VALUES.includes(raw as PowerBackup))
    return raw as PowerBackup;
  return "unknown";
}

function normalizeEditorialTags(value: unknown): string[] {
  const raw = coerceStringArray(value);
  const seen = new Set<string>();
  const out: string[] = [];

  for (const tag of raw) {
    const cleaned = tag.replace(/\s+/g, " ").trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(cleaned);
  }

  return out;
}

function coercePosition(value: unknown): VenuePosition | null {
  if (!isRecord(value)) return null;
  const lat = coerceNumber(value.lat);
  const lng = coerceNumber(value.lng);
  if (lat == null || lng == null) return null;
  return { lat, lng };
}

export function mapVenueFromApi(row: unknown): Venue {
  const r: Record<string, unknown> = isRecord(row) ? row : {};

  const id = readFirstDefined(r, ["id"]);
  const name = readFirstDefined(r, ["name"]);
  const slug = readFirstDefined(r, ["slug"]);

  const status = coerceString(readFirstDefined(r, ["status"])) ?? undefined;
  const live =
    coerceBoolean(readFirstDefined(r, ["live"])) ??
    (status ? status.toLowerCase() === "live" : null) ??
    undefined;

  const destinationSlug =
    coerceString(
      readFirstDefined(r, ["destinationSlug", "destination_slug"]),
    ) ?? undefined;

  const categories = coerceStringArray(readFirstDefined(r, ["categories"]));
  const emoji = coerceStringArray(readFirstDefined(r, ["emoji"]));
  const stars = readFirstDefined(r, ["stars"]);
  const reviews = readFirstDefined(r, ["reviews"]);
  const discount = readFirstDefined(r, ["discount"]);

  const excerpt = coerceString(readFirstDefined(r, ["excerpt"])) ?? undefined;
  const description =
    coerceString(readFirstDefined(r, ["description"])) ?? undefined;

  const bestFor = coerceStringArray(
    readFirstDefined(r, ["bestFor", "best_for"]),
  );
  const tags = coerceStringArray(readFirstDefined(r, ["tags"]));

  const cardPerk =
    coerceString(readFirstDefined(r, ["cardPerk", "card_perk"])) ?? undefined;
  const offers = coerceUnknownArray(readFirstDefined(r, ["offers"]));
  const howToClaim =
    coerceString(readFirstDefined(r, ["howToClaim", "how_to_claim"])) ??
    undefined;
  const restrictions =
    coerceString(readFirstDefined(r, ["restrictions"])) ?? undefined;

  const area = coerceString(readFirstDefined(r, ["area"])) ?? undefined;

  const lat = coerceNumber(readFirstDefined(r, ["lat"])) ?? undefined;
  const lng = coerceNumber(readFirstDefined(r, ["lng"])) ?? undefined;
  const position =
    coercePosition(readFirstDefined(r, ["position"])) ??
    (lat != null && lng != null ? { lat, lng } : null);

  const logo = coerceString(readFirstDefined(r, ["logo"])) ?? undefined;
  const image = coerceString(readFirstDefined(r, ["image"])) ?? undefined;
  const ogImage =
    coerceString(readFirstDefined(r, ["ogImage", "og_image"])) ?? undefined;

  const mapUrl =
    coerceString(readFirstDefined(r, ["mapUrl", "map_url"])) ?? undefined;
  const instagramUrl =
    coerceString(readFirstDefined(r, ["instagramUrl", "instagram_url"])) ??
    undefined;
  const whatsapp = coerceString(readFirstDefined(r, ["whatsapp"])) ?? undefined;

  const updatedAt =
    coerceString(readFirstDefined(r, ["updatedAt", "updated_at"])) ?? undefined;
  const createdAt =
    coerceString(readFirstDefined(r, ["createdAt", "created_at"])) ?? undefined;

  const editorialTags = normalizeEditorialTags(
    readFirstDefined(r, ["editorialTags", "editorial_tags"]),
  );

  const staffPick =
    coerceBoolean(readFirstDefined(r, ["staffPick", "staff_pick"])) ?? false;

  const priorityScore =
    coerceNumber(readFirstDefined(r, ["priorityScore", "priority_score"])) ?? 0;

  const laptopFriendly =
    coerceBoolean(readFirstDefined(r, ["laptopFriendly", "laptop_friendly"])) ??
    false;

  const powerBackup = coercePowerBackup(
    readFirstDefined(r, ["powerBackup", "power_backup"]),
  );

  const isPassVenueExplicit = coerceBoolean(
    readFirstDefined(r, ["isPassVenue", "is_pass_venue"]),
  );
  const isPassVenueLegacy = live === true;
  const isPassVenue = isPassVenueExplicit ?? isPassVenueLegacy;

  return {
    id: (id as Venue["id"]) ?? "",
    destinationSlug,
    name: (name != null ? String(name) : "").trim(),
    slug: (slug != null ? String(slug) : "").trim(),
    status,
    live,

    categories,
    emoji,
    stars: stars as Venue["stars"],
    reviews: reviews as Venue["reviews"],
    discount: discount as Venue["discount"],

    excerpt: excerpt ?? null,
    description: description ?? null,
    bestFor,
    tags,

    cardPerk: cardPerk ?? null,
    offers,
    howToClaim: howToClaim ?? null,
    restrictions: restrictions ?? null,

    area: area ?? null,

    position,
    lat: lat ?? null,
    lng: lng ?? null,

    logo: logo ?? null,
    image: image ?? null,
    ogImage: ogImage ?? null,

    mapUrl: mapUrl ?? null,
    instagramUrl: instagramUrl ?? null,
    whatsapp: whatsapp ?? null,

    updatedAt: updatedAt ?? null,
    createdAt: createdAt ?? null,

    editorialTags,
    isPassVenue,
    staffPick,
    priorityScore,
    laptopFriendly,
    powerBackup,
  };
}
