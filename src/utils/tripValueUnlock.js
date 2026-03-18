const VALUE_STRENGTH = {
  light: { label: "Light", min: 0 },
  good: { label: "Good", min: 40 },
  strong: { label: "Strong", min: 80 },
  excellent: { label: "Excellent", min: 150 },
};

const clamp = (value, min, max) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
};

export const ACCOMMODATIONS = [
  {
    id: "samba",
    name: "Samba Ahangama",
    publicRateUsd: 95,
    passDiscount: 0.3,
    badge: "Best value",
    platformLine: "30% off — typically ~20% cheaper than Booking.com",
    whyShort:
      "Strong value on short stays — the discount shows up immediately.",
    whyLong: "Great for longer stays — the value compounds night after night.",
    upgrades: [
      { key: "late-checkout", label: "Late checkout", valueUsd: 15 },
      { key: "free-coffee", label: "Free coffee", valueUsd: 3 },
    ],
  },
  {
    id: "unu",
    name: "UNU Boutique Hotel",
    publicRateUsd: 225,
    passDiscount: 0.2,
    badge: "Popular",
    platformLine: "20% off — typically cheaper than Booking.com",
    whyShort: "Big per-night value — ideal for a 2–5 night surf trip.",
    whyLong: "Best for a longer Ahangama stay when you’ll stack perks daily.",
    upgrades: [
      { key: "room-upgrade", label: "Room upgrade", valueUsd: 25 },
      { key: "late-checkout", label: "Late checkout", valueUsd: 15 },
    ],
  },
  {
    id: "mosvold",
    name: "Mosvold Villa",
    publicRateUsd: 250,
    passDiscount: 0.2,
    badge: "Premium",
    platformLine: "20% off — typically cheaper than Booking.com",
    whyShort:
      "Premium stay with meaningful value — best if you’ll use activities too.",
    whyLong: "For slow stays, the stay value becomes a major anchor win.",
    upgrades: [
      { key: "early-checkin", label: "Early check-in", valueUsd: 15 },
      { key: "airport-transfer", label: "Airport transfer", valueUsd: 30 },
    ],
  },
];

export const VALUE_TILES = [
  {
    id: "coffee",
    label: "Coffee perks",
    valueRangeLabel: "Usually worth $3–$6/day",
    example: "Free add-ons and better-value café stops.",
    venues: ["Kaffi", "Cactus", "Black Honey"],
    whyItMatters: "Free add-ons and better-value café stops.",
    featured: true,
  },
  {
    id: "breakfast",
    label: "Breakfast perks",
    valueRangeLabel: "Usually worth $5–$10/meal",
    example: "Useful small wins if brunch is part of your routine.",
    venues: ["Kaffi", "The Kip", "Cactus", "Black Honey"],
    whyItMatters: "Useful small wins if brunch is part of your routine.",
    featured: true,
  },
  {
    id: "dinner",
    label: "Dinner perks",
    valueRangeLabel: "Usually worth $8–$15/meal",
    example: "Free starters, desserts, or meal-value extras.",
    venues: ["UNU", "Samba", "Teddies", "Meori"],
    whyItMatters: "Free starters, desserts, or meal-value extras.",
    featured: false,
  },
  {
    id: "surf",
    label: "Surf & activity value",
    valueRangeLabel: "Usually worth $15–$25/session",
    example:
      "Board rental, lesson perks, and bundled experiences add up quickly on short stays.",
    venues: ["The Board Hut", "Lotus Surf & Wellness"],
    whyItMatters:
      "Board rental, lesson perks, and bundled experiences add up quickly on short stays.",
    featured: true,
  },
  {
    id: "scooter",
    label: "Scooter & transport value",
    valueRangeLabel: "Usually worth $8–$15/rental",
    example:
      "Local-rate unlocks, extra hours, and multi-day perks make getting around cheaper.",
    venues: ["Niya Scooters", "Scooty Rental"],
    whyItMatters:
      "Local-rate unlocks, extra hours, and multi-day perks make getting around cheaper.",
    featured: true,
  },
  {
    id: "wellness",
    label: "Wellness extras",
    valueRangeLabel: "Usually worth $15–$30/visit",
    example:
      "Massage add-ons and recovery perks that feel good on longer stays.",
    venues: ["Aksaaya Ayurveda", "Shramalaya", "Senses"],
    whyItMatters:
      "Massage add-ons and recovery perks that feel good on longer stays.",
    featured: false,
  },
];

export const VALUE_TILE_ICONS = {
  coffee: "☕",
  breakfast: "🍳",
  dinner: "🍽️",
  surf: "🏄",
  scooter: "🛵",
  wellness: "🧘",
};

export const TRAVEL_STYLE_DEFAULT_TILES = {
  Surf: ["coffee", "breakfast", "surf", "scooter"],
  Chill: ["coffee", "breakfast", "dinner", "scooter"],
  Wellness: ["coffee", "breakfast", "wellness"],
  Mixed: ["coffee", "breakfast", "dinner", "scooter", "wellness"],
};

export const TRIP_PRESETS = [
  {
    key: "escape",
    label: "2-night escape",
    nights: 2,
    accommodationId: "samba",
    travelStyle: "Chill",
    tiles: ["coffee", "breakfast", "dinner"],
  },
  {
    key: "surf",
    label: "5-day surf trip",
    nights: 5,
    accommodationId: "unu",
    travelStyle: "Surf",
    tiles: ["coffee", "breakfast", "surf", "scooter"],
  },
  {
    key: "slow",
    label: "14-day slow stay",
    nights: 14,
    accommodationId: "samba",
    travelStyle: "Mixed",
    tiles: ["coffee", "breakfast", "dinner", "scooter", "wellness"],
  },
];

function formatUsd(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

function getStrength(totalValue) {
  const t = Number(totalValue) || 0;
  if (t >= VALUE_STRENGTH.excellent.min) return "Excellent";
  if (t >= VALUE_STRENGTH.strong.min) return "Strong";
  if (t >= VALUE_STRENGTH.good.min) return "Good";
  return "Light";
}

function getStrengthMessage(strength, totalValue) {
  if (strength === "Excellent")
    return "This is where the pass becomes essential.";
  if (strength === "Strong")
    return "This is where the pass starts feeling really strong.";
  if (strength === "Good")
    return "A couple of meaningful wins and it pays off.";
  return totalValue > 0
    ? "Add scooter + surf and it clearly pays off."
    : "Choose a stay to see the big win.";
}

function getAccommodationById(accommodationId) {
  return (
    ACCOMMODATIONS.find((a) => a.id === accommodationId) ?? ACCOMMODATIONS[0]
  );
}

function inferUsage({ nights, travelStyle, selectedTiles }) {
  const n = clamp(nights, 1, 14);
  const style = String(travelStyle || "Mixed");

  const has = (k) => selectedTiles.includes(k);

  const coffeeDays = has("coffee") ? n : 0;
  const breakfastDays = has("breakfast") ? n : 0;
  const dinnerCount = has("dinner") ? Math.max(1, Math.round(n * 0.6)) : 0;
  const scooterDays = has("scooter")
    ? Math.max(1, Math.min(n, Math.round(n * 0.6)))
    : 0;

  const surfSessions = has("surf")
    ? style === "Surf"
      ? Math.max(1, Math.min(6, Math.round(n / 2)))
      : Math.max(1, Math.min(4, Math.round(n / 3)))
    : 0;

  const wellnessSessions = has("wellness")
    ? style === "Wellness"
      ? Math.max(1, Math.min(6, Math.round(n / 3)))
      : Math.max(1, Math.min(4, Math.round(n / 4)))
    : 0;

  return {
    nights: n,
    coffeeDays,
    breakfastDays,
    dinnerCount,
    scooterDays,
    surfSessions,
    wellnessSessions,
  };
}

function buildNarrative({
  totalValue,
  breakdown,
  accommodation,
  usage,
  strength,
  selectedTiles,
}) {
  const top = Object.entries(breakdown)
    .map(([k, v]) => ({ key: k, total: Number(v?.total) || 0 }))
    .sort((a, b) => b.total - a.total)
    .filter((x) => x.total > 0);

  const hasScooter = selectedTiles.includes("scooter");
  const hasSurf = selectedTiles.includes("surf");
  const hasWellness = selectedTiles.includes("wellness");

  const stayShare =
    totalValue > 0 ? (Number(breakdown?.stay?.total) || 0) / totalValue : 0;

  const headline = `You unlock about ${formatUsd(totalValue)} in value`;

  const supporting = [];
  if (hasScooter) supporting.push("scooter");
  if (hasSurf) supporting.push("surf");
  if (hasWellness) supporting.push("wellness");
  const supportingLine =
    supporting.length > 0
      ? supporting.slice(0, 2).join(" and ")
      : "everyday perks";

  const subheadline =
    stayShare >= 0.6
      ? `Mostly from your stay, with extra wins on ${supportingLine}.`
      : `A mix of stay value and ${supportingLine} makes the pass feel worth it.`;

  let ctaMessage = getStrengthMessage(strength, totalValue);
  if (usage.nights <= 2)
    ctaMessage = "2 nights at this stay already gets you close.";
  if (usage.nights >= 12)
    ctaMessage = "For longer stays, the pass becomes essential.";

  if (stayShare >= 0.7) {
    ctaMessage =
      usage.nights >= 5
        ? "Your stay does most of the work — the rest is upside."
        : "Your stay does most of the work — add one perk and it pays off.";
  }

  if (usage.nights <= 2) {
    ctaMessage = "2 nights at this stay already gets you close.";
  }

  if (
    !hasScooter &&
    !hasSurf &&
    usage.nights > 2 &&
    (strength === "Light" || strength === "Good")
  ) {
    ctaMessage = "Add scooter + surf and the pass clearly pays off.";
  }

  const stayLine =
    accommodation?.passDiscount >= 0.3
      ? "This stay gives the strongest pass value."
      : accommodation?.passDiscount >= 0.2
        ? "Your stay is a meaningful anchor saving."
        : "Accommodation usually drives the biggest saving.";

  return {
    headline,
    subheadline,
    ctaMessage,
    stayLine,
    top,
  };
}

export function calculateTripValueUnlock({
  nights,
  accommodationId,
  travelStyle,
  selectedTiles,
} = {}) {
  const safeNights = clamp(nights, 1, 14);
  const safeTiles = Array.isArray(selectedTiles) ? selectedTiles : [];
  const accommodation = getAccommodationById(accommodationId);
  const usage = inferUsage({
    nights: safeNights,
    travelStyle,
    selectedTiles: safeTiles,
  });

  const stayPublic = usage.nights * accommodation.publicRateUsd;
  const stayDiscountValue = stayPublic * accommodation.passDiscount;

  const upgradeCap = usage.nights >= 5 ? 30 : 18;
  const upgradeValue = Math.min(
    upgradeCap,
    (accommodation.upgrades ?? []).reduce(
      (sum, p) => sum + (Number(p?.valueUsd) || 0),
      0,
    ),
  );

  const longStayUnlock = usage.nights >= 10 ? 25 : usage.nights >= 7 ? 15 : 0;
  const stayValue = stayDiscountValue + upgradeValue + longStayUnlock;

  const coffeePublic = usage.coffeeDays * 6;
  const coffeeValue = usage.coffeeDays * 3;

  const breakfastPublic = usage.breakfastDays * 12;
  const breakfastValue = usage.breakfastDays * 6;

  const dinnerPublic = usage.dinnerCount * 25;
  const dinnerValue = usage.dinnerCount * 10;

  const scooterPublic = usage.scooterDays * 12;
  const scooterLocalUnlock =
    usage.nights >= 7 && usage.scooterDays > 0 ? 15 : 0;
  const scooterValue = usage.scooterDays * 10 + scooterLocalUnlock;

  const surfPublic = usage.surfSessions * 30;
  const surfBundleBonus = usage.surfSessions >= 2 ? 10 : 0;
  const surfValue = usage.surfSessions * 20 + surfBundleBonus;

  const wellnessPublic = usage.wellnessSessions * 35;
  const wellnessAddOn = usage.wellnessSessions >= 1 ? 10 : 0;
  const wellnessValue = usage.wellnessSessions * 20 + wellnessAddOn;

  const foodValue = coffeeValue + breakfastValue + dinnerValue;
  const foodPublic = coffeePublic + breakfastPublic + dinnerPublic;

  const transportValue = scooterValue;
  const transportPublic = scooterPublic;

  const activityValue = surfValue;
  const activityPublic = surfPublic;

  const wellnessExtrasValue = wellnessValue;
  const wellnessExtrasPublic = wellnessPublic;

  const publicPriceEquivalent =
    stayPublic +
    foodPublic +
    transportPublic +
    activityPublic +
    wellnessExtrasPublic;

  const totalValue =
    stayValue +
    foodValue +
    transportValue +
    activityValue +
    wellnessExtrasValue;
  const passAdjustedValue = Math.max(0, publicPriceEquivalent - totalValue);

  const strength = getStrength(totalValue);

  const breakdown = {
    stay: {
      total: stayValue,
      label: "Stay value",
      venues: [accommodation.name],
    },
    food: {
      total: foodValue,
      label: "Everyday perks",
      venues: [
        safeTiles.includes("coffee") ? "Coffee partners" : null,
        safeTiles.includes("breakfast") ? "Breakfast partners" : null,
        safeTiles.includes("dinner") ? "Dinner partners" : null,
      ].filter(Boolean),
    },
    transport: {
      total: transportValue,
      label: "Transport value",
      venues: safeTiles.includes("scooter") ? ["Scooter partners"] : [],
    },
    activity: {
      total: activityValue,
      label: "Experiences & activity value",
      venues: safeTiles.includes("surf") ? ["Surf partners"] : [],
    },
    wellness: {
      total: wellnessExtrasValue,
      label: "Wellness extras",
      venues: safeTiles.includes("wellness") ? ["Wellness partners"] : [],
    },
  };

  const narrative = buildNarrative({
    totalValue,
    breakdown,
    accommodation,
    usage,
    strength,
    selectedTiles: safeTiles,
  });

  const biggest = narrative.top[0]?.key;
  const biggestLabelMap = {
    stay: "Stay",
    activity: "Surf / activities",
    transport: "Scooter / transport",
    food: "Everyday perks",
    wellness: "Wellness",
  };

  const bestDaily =
    safeTiles.includes("coffee") && safeTiles.includes("breakfast")
      ? "Coffee + breakfast"
      : safeTiles.includes("breakfast")
        ? "Breakfast"
        : safeTiles.includes("coffee")
          ? "Coffee"
          : safeTiles.includes("dinner")
            ? "Dinner"
            : "Everyday perks";

  const hasAnyActivityLike =
    activityValue > 0 || transportValue > 0 || wellnessExtrasValue > 0;
  const bestActivity = !hasAnyActivityLike
    ? "Surf or scooter"
    : Math.max(activityValue, transportValue, wellnessExtrasValue) ===
        activityValue
      ? "Surf"
      : Math.max(activityValue, transportValue, wellnessExtrasValue) ===
          transportValue
        ? "Scooter"
        : "Wellness";

  const highlights = [
    { label: "Biggest saving", value: biggestLabelMap[biggest] ?? "Stay" },
    { label: "Best daily perk", value: bestDaily },
    { label: "Best activity perk", value: bestActivity },
  ];

  const stayValuePerNight =
    accommodation.publicRateUsd * accommodation.passDiscount;
  const stayWhy =
    usage.nights <= 3 ? accommodation.whyShort : accommodation.whyLong;

  return {
    totalValue,
    currency: "USD",
    publicPriceEquivalent,
    passAdjustedValue,
    strength,
    narrative: {
      headline: narrative.headline,
      subheadline: narrative.subheadline,
      ctaMessage: narrative.ctaMessage,
      stayLine: narrative.stayLine,
    },
    highlights,
    breakdown,
    meta: {
      nights: usage.nights,
      accommodationId: accommodation.id,
      accommodationName: accommodation.name,
      stayValuePerNight,
      stayWhy,
      platformLine: accommodation.platformLine,
      upgradeValue,
      longStayUnlock,
      usage,
    },
  };
}

export function getPresetOutputs() {
  return TRIP_PRESETS.map((p) => ({
    preset: p.label,
    result: calculateTripValueUnlock({
      nights: p.nights,
      accommodationId: p.accommodationId,
      travelStyle: p.travelStyle,
      selectedTiles: p.tiles,
    }),
  }));
}
