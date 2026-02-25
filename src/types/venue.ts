export type VenuePosition = { lat: number; lng: number };

export type PowerBackup = "generator" | "inverter" | "none" | "unknown";

export type Venue = {
  id: string | number;
  destinationSlug?: string;
  name: string;
  slug: string;
  status?: string;
  live?: boolean;

  editorialTags: string[];
  isPassVenue: boolean;
  staffPick: boolean;
  priorityScore: number;
  laptopFriendly: boolean;
  powerBackup: PowerBackup;

  categories: string[];
  emoji: string[];
  stars?: number | string | null;
  reviews?: number | string | null;
  discount?: string | number | null;

  excerpt?: string | null;
  description?: string | null;
  bestFor: string[];
  tags: string[];

  cardPerk?: string | null;
  offers: unknown[];
  howToClaim?: string | null;
  restrictions?: string | null;

  area?: string | null;

  position?: VenuePosition | null;
  lat?: number | null;
  lng?: number | null;

  logo?: string | null;
  image?: string | null;
  ogImage?: string | null;

  mapUrl?: string | null;
  instagramUrl?: string | null;
  whatsapp?: string | null;

  updatedAt?: string | null;
  createdAt?: string | null;
};

export type VenuesResponse =
  | { ok: true; venues: Venue[] }
  | { ok: false; error: string };
