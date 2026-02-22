import { neon } from "@neondatabase/serverless";

export const handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: cors,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" }),
    };
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers: cors,
        body: JSON.stringify({
          ok: false,
          error: "Missing DATABASE_URL environment variable",
        }),
      };
    }

    const sql = neon(databaseUrl);

    const qs = event.queryStringParameters || {};
    const destinationSlug = (qs.destinationSlug || "ahangama").trim();
    const category = qs.category ? qs.category.trim() : null;

    const liveOnly =
      qs.liveOnly === undefined ? true : String(qs.liveOnly) !== "false";

    const rows = category
      ? await sql`
          SELECT
            id, destination_slug, name, slug, status, live,
            categories, emoji, stars, reviews, discount,
            excerpt, description, best_for, tags,
            card_perk, offers, how_to_claim, restrictions,
            area, lat, lng, logo, image, og_image,
            map_url, instagram_url, whatsapp,
            updated_at, created_at
          FROM venues
          WHERE destination_slug = ${destinationSlug}
            AND (${liveOnly} = false OR live = true)
            AND ${category} = ANY(categories)
          ORDER BY name ASC
        `
      : await sql`
          SELECT
            id, destination_slug, name, slug, status, live,
            categories, emoji, stars, reviews, discount,
            excerpt, description, best_for, tags,
            card_perk, offers, how_to_claim, restrictions,
            area, lat, lng, logo, image, og_image,
            map_url, instagram_url, whatsapp,
            updated_at, created_at
          FROM venues
          WHERE destination_slug = ${destinationSlug}
            AND (${liveOnly} = false OR live = true)
          ORDER BY name ASC
        `;

    const venues = rows.map((r) => ({
      id: r.id,
      destinationSlug: r.destination_slug,
      name: r.name,
      slug: r.slug,
      status: r.status,
      live: r.live,
      categories: r.categories ?? [],
      emoji: r.emoji ?? [],
      stars: r.stars,
      reviews: r.reviews,
      discount: r.discount,
      excerpt: r.excerpt,
      description: r.description,
      bestFor: r.best_for ?? [],
      tags: r.tags ?? [],
      cardPerk: r.card_perk,
      offers: r.offers ?? [],
      howToClaim: r.how_to_claim,
      restrictions: r.restrictions,
      area: r.area,
      position:
        r.lat != null && r.lng != null
          ? { lat: Number(r.lat), lng: Number(r.lng) }
          : null,
      lat: r.lat,
      lng: r.lng,
      logo: r.logo,
      image: r.image,
      ogImage: r.og_image,
      mapUrl: r.map_url,
      instagramUrl: r.instagram_url,
      whatsapp: r.whatsapp,
      updatedAt: r.updated_at,
      createdAt: r.created_at,
    }));

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ ok: true, venues }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({
        ok: false,
        error: err?.message || "Server error",
      }),
    };
  }
};
