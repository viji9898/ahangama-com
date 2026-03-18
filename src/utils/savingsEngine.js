import { PLACES } from "../data/places.js";

const DESTINATION_SLUG = "ahangama";

const DEFAULTS = {
  currency: "USD",
  stayNightlyByBand: {
    budget: 35,
    "mid-range": 95,
    "upper-mid": 140,
    premium: 225,
  },
  baseSpend: {
    breakfast: 8,
    lunch: 12,
    dinner: 18,
  },
  baseRates: {
    scooterPerDay: 10,
    surfSession: 20,
    wellnessSession: 25,
    premiumWellnessSession: 45,
    coworkingPerDay: 12,
  },
  perkValues: {
    lateCheckout: 15,
    earlyCheckIn: 15,
    roomUpgrade: 25,
    airportTransfer: 30,
    freeCoffee: 3,
    freeDessert: 6,
    freeDrink: 5,
    freeProsecco: 6,
    freeCoconutWater: 3,
    freePastry: 4,
    tinyUpgrade: 2,
    freeConsultation: 10,
    freeMeditation: 8,
    comboDiscount: 12,
  },
};

function clampNumber(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function asArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

function safeLower(value) {
  if (value == null) return "";
  return String(value).toLowerCase();
}

function compactText(value) {
  return safeLower(value).replace(/\s+/g, " ").trim();
}

function getPlaceText(place) {
  const parts = [
    place?.name,
    place?.category,
    place?.excerpt,
    place?.description,
    place?.cardPerk,
    ...asArray(place?.offer),
    ...asArray(place?.bestFor),
    ...asArray(place?.tags),
  ];

  return compactText(parts.filter(Boolean).join(" | "));
}

export function normalizePlaceCategory(place) {
  const raw = compactText(place?.category);
  if (!raw) return "other";

  if (raw === "eat") return "food";
  if (raw === "stays" || raw === "stay" || raw === "accommodation")
    return "accommodation";

  if (raw === "wellness" || raw === "surf" || raw === "experiences")
    return "experiences";

  if (raw === "transport") return "transport";
  if (raw === "co-working" || raw === "coworking") return "coworking";

  return "other";
}

export function isActivePlace(place) {
  return compactText(place?.status) === "active";
}

export function extractDiscountValue(place) {
  const direct =
    typeof place?.discount === "number" && Number.isFinite(place.discount)
      ? place.discount
      : typeof place?.discounts === "number" && Number.isFinite(place.discounts)
        ? place.discounts
        : null;

  if (typeof direct === "number") return clampNumber(direct, 0, 0.9);

  const text = getPlaceText(place);
  const percentMatches = [...text.matchAll(/(\d{1,3})\s*%/g)];
  if (percentMatches.length === 0) return null;

  const best = percentMatches
    .map((m) => clampNumber(m?.[1], 0, 90) / 100)
    .sort((a, b) => b - a)[0];
  if (!Number.isFinite(best) || best <= 0) return null;

  return clampNumber(best, 0, 0.9);
}

export function extractPerkValue(place) {
  const text = getPlaceText(place);
  if (!text) return { totalValueUsd: 0, reasons: [] };

  const reasons = [];
  let totalValueUsd = 0;

  const add = (key, label) => {
    const value = DEFAULTS.perkValues[key];
    if (!value) return;
    totalValueUsd += value;
    reasons.push(label);
  };

  if (/late checkout/.test(text)) add("lateCheckout", "Late checkout");
  if (/early check[- ]?in/.test(text)) add("earlyCheckIn", "Early check-in");
  if (/room upgrade|upgrade your room/.test(text))
    add("roomUpgrade", "Room upgrade");
  if (/airport transfer/.test(text)) add("airportTransfer", "Airport transfer");

  if (/free prosecco/.test(text)) add("freeProsecco", "Free prosecco");
  if (/free dessert/.test(text)) add("freeDessert", "Free dessert");
  if (/free (drink|cocktail|beer|wine)/.test(text))
    add("freeDrink", "Free drink");
  if (/free (coffee|espresso)|coffee refill/.test(text))
    add("freeCoffee", "Free coffee");
  if (/free pastry|free cake|free croissant/.test(text))
    add("freePastry", "Free pastry");
  if (/free coconut water/.test(text))
    add("freeCoconutWater", "Free coconut water");

  if (
    /protein boost|honey upgrade|espresso upgrade|extra shot|add( |-)?on/.test(
      text,
    )
  )
    add("tinyUpgrade", "Small add-on upgrade");

  if (/free consultation/.test(text))
    add("freeConsultation", "Free consultation");
  if (/free meditation/.test(text)) add("freeMeditation", "Free meditation");
  if (/combo discount/.test(text)) add("comboDiscount", "Combo discount");

  return { totalValueUsd, reasons };
}

export function classifyFoodMoment(place) {
  const category = normalizePlaceCategory(place);
  if (category !== "food") return [];

  const text = getPlaceText(place);
  const moments = new Set();

  if (/breakfast|brunch|coffee|cafe|smoothie|espresso|bakery/.test(text)) {
    moments.add("breakfast");
  }

  if (/lunch|bowls|salad|wrap|tacos|burrito|casual|sandwich|poke/.test(text)) {
    moments.add("lunch");
  }

  if (
    /dinner|drinks|sunset|cocktail|bar|rooftop|fine dining|steak|wine/.test(
      text,
    )
  ) {
    moments.add("dinner");
  }

  if (moments.size === 0) moments.add("lunch");
  return [...moments];
}

export function classifyExperienceType(place) {
  const normalizedCategory = normalizePlaceCategory(place);
  const text = getPlaceText(place);

  if (normalizedCategory === "coworking") return "coworking";
  if (normalizedCategory === "transport") return "transport";
  if (normalizedCategory === "accommodation") return "stay";

  if (normalizedCategory !== "experiences") return "other";
  if (/surf|board|lesson|rental/.test(text)) return "surf";
  if (/yoga|spa|massage|ayurveda|treatment|wellness|meditation/.test(text))
    return "wellness";
  return "experience";
}

function getStayNightlyAssumptionUsd(place) {
  const rawBand = compactText(place?.price);
  if (rawBand.includes("budget")) return DEFAULTS.stayNightlyByBand.budget;
  if (rawBand.includes("upper")) return DEFAULTS.stayNightlyByBand["upper-mid"];
  if (rawBand.includes("premium")) return DEFAULTS.stayNightlyByBand.premium;
  if (rawBand.includes("mid")) return DEFAULTS.stayNightlyByBand["mid-range"];
  return DEFAULTS.stayNightlyByBand["mid-range"];
}

function scoreVenuePerUse(place, baseUsd) {
  const discount = extractDiscountValue(place);
  if (typeof discount === "number" && discount > 0) return baseUsd * discount;
  return extractPerkValue(place).totalValueUsd;
}

function pickBestVenue(places, scorer) {
  let best = null;
  let bestScore = 0;

  for (const place of places) {
    const score = scorer(place);
    if (!Number.isFinite(score) || score <= 0) continue;
    if (score > bestScore) {
      best = place;
      bestScore = score;
    }
  }

  return best ? { place: best, scoreUsd: bestScore } : null;
}

export function estimatePlaceSavings(place, usageContext) {
  const normalizedCategory = normalizePlaceCategory(place);
  const discount = extractDiscountValue(place);
  const perk = extractPerkValue(place);
  const text = getPlaceText(place);

  const result = {
    placeId: place?.id,
    name: place?.name,
    slug: place?.slug,
    normalizedCategory,
    savingsUsd: 0,
    basis: "none",
    notes: [],
  };

  if (normalizedCategory === "accommodation") {
    const nights = clampNumber(usageContext?.nights, 1, 60);
    const nightly = getStayNightlyAssumptionUsd(place);
    if (typeof discount === "number" && discount > 0) {
      result.savingsUsd = nights * nightly * discount;
      result.basis = "percentage";
      result.notes.push(
        `${Math.round(discount * 100)}% off assumed ${nightly}/night`,
      );
      return result;
    }

    if (perk.totalValueUsd > 0) {
      result.savingsUsd = perk.totalValueUsd;
      result.basis = "perk";
      result.notes.push(...perk.reasons);
      return result;
    }

    return result;
  }

  if (normalizedCategory === "food") {
    const moment = usageContext?.foodMoment;
    const base = DEFAULTS.baseSpend[moment] ?? DEFAULTS.baseSpend.lunch;
    const uses = clampNumber(usageContext?.uses, 0, 200);

    if (typeof discount === "number" && discount > 0) {
      result.savingsUsd = base * discount * uses;
      result.basis = "percentage";
      result.notes.push(
        `${Math.round(discount * 100)}% off assumed ${base}/meal`,
      );
      return result;
    }

    if (perk.totalValueUsd > 0) {
      result.savingsUsd = perk.totalValueUsd * uses;
      result.basis = "perk";
      result.notes.push(...perk.reasons);
      return result;
    }

    if (/free/.test(text) && uses > 0) {
      result.savingsUsd = 2 * uses;
      result.basis = "perk";
      result.notes.push("Vague free perk (conservative estimate)");
      return result;
    }

    return result;
  }

  if (normalizedCategory === "transport") {
    const mode = usageContext?.transportMode;
    if (mode !== "scooter" && mode !== "vehicle") return result;
    if (mode === "vehicle") return result;

    const days = clampNumber(usageContext?.days, 0, 60);
    const base = DEFAULTS.baseRates.scooterPerDay;
    if (typeof discount === "number" && discount > 0) {
      result.savingsUsd = base * discount * days;
      result.basis = "percentage";
      result.notes.push(
        `${Math.round(discount * 100)}% off assumed ${base}/day`,
      );
      return result;
    }

    if (perk.totalValueUsd > 0) {
      result.savingsUsd = perk.totalValueUsd;
      result.basis = "perk";
      result.notes.push(...perk.reasons);
      return result;
    }

    return result;
  }

  if (normalizedCategory === "coworking") {
    const days = clampNumber(usageContext?.days, 0, 60);
    const base = DEFAULTS.baseRates.coworkingPerDay;
    if (typeof discount === "number" && discount > 0) {
      result.savingsUsd = base * discount * days;
      result.basis = "percentage";
      result.notes.push(
        `${Math.round(discount * 100)}% off assumed ${base}/day`,
      );
      return result;
    }

    if (perk.totalValueUsd > 0) {
      result.savingsUsd = perk.totalValueUsd;
      result.basis = "perk";
      result.notes.push(...perk.reasons);
      return result;
    }

    return result;
  }

  if (normalizedCategory === "experiences") {
    const experienceType = usageContext?.experienceType;
    const count = clampNumber(usageContext?.count, 0, 200);

    if (count <= 0) return result;

    const isPremiumWellness =
      experienceType === "wellness" &&
      /massage|ayurveda|spa|treatment/.test(getPlaceText(place));

    const base =
      experienceType === "surf"
        ? DEFAULTS.baseRates.surfSession
        : experienceType === "wellness"
          ? isPremiumWellness
            ? DEFAULTS.baseRates.premiumWellnessSession
            : DEFAULTS.baseRates.wellnessSession
          : DEFAULTS.baseRates.wellnessSession;

    if (typeof discount === "number" && discount > 0) {
      result.savingsUsd = base * discount * count;
      result.basis = "percentage";
      result.notes.push(
        `${Math.round(discount * 100)}% off assumed ${base}/session`,
      );
      return result;
    }

    if (perk.totalValueUsd > 0) {
      result.savingsUsd = perk.totalValueUsd * count;
      result.basis = "perk";
      result.notes.push(...perk.reasons);
      return result;
    }

    return result;
  }

  return result;
}

function formatUsd(amount) {
  const rounded = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rounded);
}

function summarizeVenues(used) {
  const byId = new Map();
  for (const item of used) {
    if (!item?.place?.id) continue;
    const prev = byId.get(item.place.id);
    const next = {
      id: item.place.id,
      name: item.place.name,
      slug: item.place.slug,
      category: normalizePlaceCategory(item.place),
      usedFor: new Set([...(prev?.usedFor ?? []), item.usedFor]),
      savingsUsd: (prev?.savingsUsd ?? 0) + (Number(item.savingsUsd) || 0),
    };
    byId.set(item.place.id, next);
  }

  return [...byId.values()]
    .map((v) => ({
      ...v,
      usedFor: [...v.usedFor],
    }))
    .sort((a, b) => b.savingsUsd - a.savingsUsd);
}

function computeHighlights(breakdown, internals) {
  const items = Object.entries(breakdown)
    .map(([k, v]) => ({ key: k, total: Number(v?.total) || 0 }))
    .filter((x) => x.total > 0);

  const biggest = items.sort((a, b) => b.total - a.total)[0];
  const highlights = [];

  if (biggest) {
    const labelMap = {
      stay: "Stay",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      scooter: "Scooter rental",
      vehicle: "Vehicle rental",
      experiences: "Experiences",
      coworking: "Coworking",
    };
    highlights.push(`Biggest saving: ${labelMap[biggest.key] ?? biggest.key}`);
  }

  const everyday =
    (Number(breakdown?.breakfast?.total) || 0) +
    (Number(breakdown?.lunch?.total) || 0) +
    (Number(breakdown?.dinner?.total) || 0);
  if (everyday > 0) highlights.push("Best everyday saving: Breakfast + coffee");

  if ((Number(breakdown?.experiences?.total) || 0) > 0) {
    const bestActivity =
      (internals?.surfSavingsUsd ?? 0) >= (internals?.wellnessSavingsUsd ?? 0)
        ? "Surf"
        : "Wellness";
    highlights.push(`Best activity saving: ${bestActivity}`);
  }

  return highlights;
}

export function calculateTripSavings({
  nights,
  breakfasts,
  lunches,
  dinners,
  scooterDays,
  vehicleDays,
  experienceCount,
  coworkingDays,
  activeOnly = true,
  surfSessions,
  wellnessSessions,
  experienceSessions,
} = {}) {
  const safeNights = clampNumber(nights, 1, 60);
  const safeBreakfasts = clampNumber(breakfasts, 0, 6);
  const safeLunches = clampNumber(lunches, 0, 6);
  const safeDinners = clampNumber(dinners, 0, 6);
  const safeScooterDays = clampNumber(scooterDays, 0, 60);
  const safeVehicleDays = clampNumber(vehicleDays, 0, 60);
  const safeCoworkingDays = clampNumber(coworkingDays, 0, 60);

  const safeSurfSessions = clampNumber(surfSessions ?? 0, 0, 200);
  const safeWellnessSessions = clampNumber(wellnessSessions ?? 0, 0, 200);
  const safeExperienceSessions = clampNumber(
    experienceSessions ?? experienceCount ?? 0,
    0,
    200,
  );

  const scoped = PLACES.filter(
    (p) =>
      compactText(p?.destinationSlug) === DESTINATION_SLUG &&
      (!activeOnly || isActivePlace(p)),
  );

  const accommodationPlaces = scoped.filter(
    (p) => normalizePlaceCategory(p) === "accommodation",
  );
  const foodPlaces = scoped.filter((p) => normalizePlaceCategory(p) === "food");
  const transportPlaces = scoped.filter(
    (p) => normalizePlaceCategory(p) === "transport",
  );
  const coworkingPlaces = scoped.filter(
    (p) => normalizePlaceCategory(p) === "coworking",
  );
  const experiencePlaces = scoped.filter(
    (p) => normalizePlaceCategory(p) === "experiences",
  );

  const usedVenues = [];

  const bestStay = pickBestVenue(accommodationPlaces, (p) => {
    const nightly = getStayNightlyAssumptionUsd(p);
    return scoreVenuePerUse(p, nightly);
  });

  const staySavingsUsd = bestStay
    ? estimatePlaceSavings(bestStay.place, { nights: safeNights }).savingsUsd
    : 0;
  if (bestStay && staySavingsUsd > 0) {
    usedVenues.push({
      usedFor: "stay",
      place: bestStay.place,
      savingsUsd: staySavingsUsd,
    });
  }

  const mealMoments = [
    {
      key: "breakfast",
      perDay: safeBreakfasts,
      candidates: foodPlaces.filter((p) =>
        classifyFoodMoment(p).includes("breakfast"),
      ),
    },
    {
      key: "lunch",
      perDay: safeLunches,
      candidates: foodPlaces.filter((p) =>
        classifyFoodMoment(p).includes("lunch"),
      ),
    },
    {
      key: "dinner",
      perDay: safeDinners,
      candidates: foodPlaces.filter((p) =>
        classifyFoodMoment(p).includes("dinner"),
      ),
    },
  ];

  const mealSavings = {
    breakfast: { total: 0, venues: [] },
    lunch: { total: 0, venues: [] },
    dinner: { total: 0, venues: [] },
  };

  for (const moment of mealMoments) {
    const uses = safeNights * moment.perDay;
    if (uses <= 0) continue;
    const base = DEFAULTS.baseSpend[moment.key] ?? DEFAULTS.baseSpend.lunch;
    const best = pickBestVenue(moment.candidates, (p) =>
      scoreVenuePerUse(p, base),
    );
    if (!best) continue;

    const savingsUsd = estimatePlaceSavings(best.place, {
      foodMoment: moment.key,
      uses,
    }).savingsUsd;

    if (savingsUsd > 0) {
      mealSavings[moment.key].total += savingsUsd;
      mealSavings[moment.key].venues.push(best.place);
      usedVenues.push({
        usedFor: moment.key,
        place: best.place,
        savingsUsd,
      });
    }
  }

  const scooterCandidates = transportPlaces.filter((p) => {
    const text = getPlaceText(p);
    return /scooter|bike rental|motorbike|gik/.test(text);
  });

  const bestScooter = pickBestVenue(scooterCandidates, (p) =>
    scoreVenuePerUse(p, DEFAULTS.baseRates.scooterPerDay),
  );
  const scooterSavingsUsd =
    bestScooter && safeScooterDays > 0
      ? estimatePlaceSavings(bestScooter.place, {
          transportMode: "scooter",
          days: safeScooterDays,
        }).savingsUsd
      : 0;
  if (bestScooter && scooterSavingsUsd > 0) {
    usedVenues.push({
      usedFor: "scooter",
      place: bestScooter.place,
      savingsUsd: scooterSavingsUsd,
    });
  }

  const vehicleSavingsUsd = safeVehicleDays > 0 ? 0 : 0;

  const surfCandidates = experiencePlaces.filter(
    (p) => classifyExperienceType(p) === "surf",
  );
  const wellnessCandidates = experiencePlaces.filter(
    (p) => classifyExperienceType(p) === "wellness",
  );
  const genericExperienceCandidates = experiencePlaces.filter((p) => {
    const t = classifyExperienceType(p);
    return t === "experience";
  });

  const bestSurf = pickBestVenue(surfCandidates, (p) =>
    scoreVenuePerUse(p, DEFAULTS.baseRates.surfSession),
  );
  const bestWellness = pickBestVenue(wellnessCandidates, (p) =>
    scoreVenuePerUse(p, DEFAULTS.baseRates.wellnessSession),
  );
  const bestGeneric = pickBestVenue(genericExperienceCandidates, (p) =>
    scoreVenuePerUse(p, DEFAULTS.baseRates.wellnessSession),
  );

  const surfSavingsUsd =
    bestSurf && safeSurfSessions > 0
      ? estimatePlaceSavings(bestSurf.place, {
          experienceType: "surf",
          count: safeSurfSessions,
        }).savingsUsd
      : 0;

  const wellnessSavingsUsd =
    bestWellness && safeWellnessSessions > 0
      ? estimatePlaceSavings(bestWellness.place, {
          experienceType: "wellness",
          count: safeWellnessSessions,
        }).savingsUsd
      : 0;

  const genericExperienceSavingsUsd =
    bestGeneric && safeExperienceSessions > 0
      ? estimatePlaceSavings(bestGeneric.place, {
          experienceType: "experience",
          count: safeExperienceSessions,
        }).savingsUsd
      : 0;

  const experiencesSavingsUsd =
    surfSavingsUsd + wellnessSavingsUsd + genericExperienceSavingsUsd;

  if (bestSurf && surfSavingsUsd > 0)
    usedVenues.push({
      usedFor: "experiences",
      place: bestSurf.place,
      savingsUsd: surfSavingsUsd,
    });
  if (bestWellness && wellnessSavingsUsd > 0)
    usedVenues.push({
      usedFor: "experiences",
      place: bestWellness.place,
      savingsUsd: wellnessSavingsUsd,
    });
  if (bestGeneric && genericExperienceSavingsUsd > 0)
    usedVenues.push({
      usedFor: "experiences",
      place: bestGeneric.place,
      savingsUsd: genericExperienceSavingsUsd,
    });

  const bestCoworking = pickBestVenue(coworkingPlaces, (p) =>
    scoreVenuePerUse(p, DEFAULTS.baseRates.coworkingPerDay),
  );
  const coworkingSavingsUsd =
    bestCoworking && safeCoworkingDays > 0
      ? estimatePlaceSavings(bestCoworking.place, {
          days: safeCoworkingDays,
        }).savingsUsd
      : 0;
  if (bestCoworking && coworkingSavingsUsd > 0) {
    usedVenues.push({
      usedFor: "coworking",
      place: bestCoworking.place,
      savingsUsd: coworkingSavingsUsd,
    });
  }

  const breakdown = {
    stay: { total: staySavingsUsd, venues: bestStay ? [bestStay.place] : [] },
    breakfast: {
      total: mealSavings.breakfast.total,
      venues: mealSavings.breakfast.venues,
    },
    lunch: { total: mealSavings.lunch.total, venues: mealSavings.lunch.venues },
    dinner: {
      total: mealSavings.dinner.total,
      venues: mealSavings.dinner.venues,
    },
    scooter: {
      total: scooterSavingsUsd,
      venues: bestScooter ? [bestScooter.place] : [],
    },
    vehicle: { total: vehicleSavingsUsd, venues: [] },
    experiences: {
      total: experiencesSavingsUsd,
      venues: [bestSurf?.place, bestWellness?.place, bestGeneric?.place].filter(
        Boolean,
      ),
    },
    coworking: {
      total: coworkingSavingsUsd,
      venues: bestCoworking ? [bestCoworking.place] : [],
    },
  };

  const totalSavings = Object.values(breakdown).reduce(
    (sum, v) => sum + (Number(v?.total) || 0),
    0,
  );

  const highlights = computeHighlights(breakdown, {
    surfSavingsUsd,
    wellnessSavingsUsd,
  });

  const summary = `On a ${safeNights}-day trip, you could save around ${formatUsd(totalSavings)} using the pass.`;

  const recommendedVenues = summarizeVenues(usedVenues);

  const bestValueVenues = recommendedVenues
    .slice()
    .sort((a, b) => b.savingsUsd - a.savingsUsd)
    .slice(0, 6);

  return {
    totalSavings,
    currency: DEFAULTS.currency,
    breakdown,
    recommendedVenues,
    bestValueVenues,
    highlights,
    summary,
    disclaimer:
      "Savings are estimates based on typical spend and active pass offers.",
  };
}

export function getSampleSavingsOutputs() {
  const base = {
    breakfasts: 1,
    lunches: 1,
    dinners: 1,
    scooterDays: 1,
    vehicleDays: 0,
    surfSessions: 1,
    wellnessSessions: 1,
    experienceSessions: 0,
    coworkingDays: 0,
    activeOnly: true,
  };

  return {
    twoDays: calculateTripSavings({ ...base, nights: 2, scooterDays: 1 }),
    fiveDays: calculateTripSavings({ ...base, nights: 5, scooterDays: 3 }),
    fourteenDays: calculateTripSavings({
      ...base,
      nights: 14,
      scooterDays: 7,
      surfSessions: 3,
      wellnessSessions: 2,
      coworkingDays: 5,
    }),
  };
}
