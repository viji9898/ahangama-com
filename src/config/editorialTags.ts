export const EDITORIAL_TAGS = [
  "Surf-Town Classic",
  "Post-Surf Ritual",
  "Beach Road Staple",
  "Golden Hour Pick",
  "Sunset Energy",
  "Ocean-Adjacent",
  "Laptop-Friendly",
  "Long-Stay Favourite",
  "Basecamp Spot",
  "Remote-Work Approved",
  "Slow Mornings",
  "All-Day Anchor",
  "Easy Default",
  "Reliable Repeat",
  "Social Scene",
  "Group Dinner Pick",
  "Date Energy",
  "Solo Reset",
  "Light & Fresh",
  "Recovery Mode",
  "Reset Energy",
  "Plant-Forward",
  "Central Staple",
  "Tucked Away",
  "Off Main Strip",
  "Elevated Pick",
  "Signature Experience",
  "Community Hub",
  "Local Favourite",
] as const;

export type EditorialTag = (typeof EDITORIAL_TAGS)[number];

export const EDITORIAL_TAG_DESCRIPTIONS: Record<EditorialTag, string> = {
  "Surf-Town Classic":
    "The places that define Ahangama — long boards out front, sandy feet inside, and energy that runs from sunrise to late.",
  "Post-Surf Ritual":
    "Where you go after the session. Coffee, carbs, cold drinks, or just sitting in salt and silence.",
  "Beach Road Staple":
    "Right on the main stretch. Always open, always reliable, always part of the rhythm.",
  "Golden Hour Pick":
    "Best experienced between 5–7pm — warm light, softer pace, better conversations.",
  "Sunset Energy":
    "Built for that final glow. Ocean views, cocktails, slow music, sky turning gold.",
  "Ocean-Adjacent":
    "Steps from the sea. You feel the breeze, hear the waves, and never forget where you are.",

  "Laptop-Friendly":
    "Good seating, stable WiFi, and no one glaring at you for staying awhile.",
  "Long-Stay Favourite":
    "The spots people return to week after week. Familiar faces, easy comfort.",
  "Basecamp Spot":
    "A practical anchor — meet here, start here, end here. A reliable default.",
  "Remote-Work Approved":
    "Consistent power, calm environment, and enough space to think clearly.",

  "Slow Mornings": "Best before 10am. Soft light, good coffee, no rush.",
  "All-Day Anchor":
    "You can arrive at 9am and still be here at sunset. Flexible, welcoming, dependable.",
  "Easy Default": "When you don’t want to overthink it. Always a safe, solid choice.",
  "Reliable Repeat": "Not flashy — just consistently good.",
  "Social Scene": "Where people gather. Conversations spill over tables.",
  "Group Dinner Pick": "Works for 4–8 people. Easy energy, good layout, relaxed vibe.",
  "Date Energy": "Intimate lighting, thoughtful atmosphere, slightly elevated mood.",
  "Solo Reset": "Comfortable alone. Quiet enough to reflect, read, or just sit.",

  "Light & Fresh": "Clean flavours, lighter plates, energising feel.",
  "Recovery Mode": "Best after long surfs or long nights. Nourishing, grounding.",
  "Reset Energy": "Calmer spaces that help you recalibrate.",
  "Plant-Forward": "Vegetable-led, fresh-focused, wellness-aligned menus.",

  "Central Staple": "In the middle of everything. Easy to find, easy to return to.",
  "Tucked Away": "Slightly hidden, worth the detour.",
  "Off Main Strip":
    "Away from traffic and buzz — quieter alternative to the main road.",

  "Elevated Pick": "A step above the everyday. Design, service, or experience stands out.",
  "Signature Experience": "You go specifically for this. Not generic.",
  "Community Hub": "Events, conversations, recurring faces. A gathering point.",
  "Local Favourite": "Loved by residents — not just travellers.",
};

export function getEditorialTagDescription(tag: string): string | null {
  const normalized = tag?.trim();
  if (!normalized) return null;
  if (!EDITORIAL_TAGS.includes(normalized as EditorialTag)) return null;
  return EDITORIAL_TAG_DESCRIPTIONS[normalized as EditorialTag] ?? null;
}
