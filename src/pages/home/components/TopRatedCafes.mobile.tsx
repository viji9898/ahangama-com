import type { Venue } from "../../../types/venue";

type Props = {
  venues: Venue[];
};

function formatStars(stars: Venue["stars"]): string {
  const parsed =
    typeof stars === "number"
      ? stars
      : typeof stars === "string"
        ? Number.parseFloat(stars)
        : null;
  return parsed != null && Number.isFinite(parsed) ? parsed.toFixed(1) : "-";
}

function formatReviews(reviews: Venue["reviews"]): number {
  const parsed =
    typeof reviews === "number"
      ? reviews
      : typeof reviews === "string"
        ? Number.parseFloat(reviews)
        : null;
  return parsed != null && Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

export function TopRatedCafesMobile({ venues }: Props) {
  const cafes = venues
    .filter((v) => {
      const cats = (v.categories ?? []).map((c) => String(c).toLowerCase());
      return cats.some((c) => c.includes("eat"));
    })
    .sort((a, b) => formatReviews(b.reviews) - formatReviews(a.reviews))
    .slice(0, 6);

  if (!cafes.length) return null;

  return (
    <div style={{ margin: "18px 0 0 0", padding: "0 0 0 8px" }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 17,
          margin: "0 0 10px 6px",
          color: "#222",
        }}
      >
        Top Rated Cafes
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          gap: 12,
          paddingBottom: 8,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cafes.map((venue) => (
          <div
            key={String(venue.id)}
            style={{
              minWidth: 140,
              maxWidth: 160,
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 1px 6px rgba(79,111,134,0.07)",
              padding: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {venue.image ? (
              <img
                src={String(venue.image)}
                alt={`${venue.name} photo`}
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 10,
                  margin: "10px 0 6px 0",
                }}
                loading="lazy"
              />
            ) : null}

            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                textAlign: "center",
                margin: "0 8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
            >
              {venue.name}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#666",
                margin: "2px 0 8px 0",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#f7b733", fontSize: 14 }}>★</span>{" "}
              {formatStars(venue.stars)}
              <span style={{ color: "#aaa", fontWeight: 400 }}>
                {" "}
                · {formatReviews(venue.reviews)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
