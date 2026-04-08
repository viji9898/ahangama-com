import { Typography } from "antd";
import { PLACES } from "../../data/places";
import styles from "../../pages/home/Home.desktop.new.module.css";

const FEATURED_VENUE_GROUPS = [
  {
    title: "Eat & drink",
    venueIds: [
      "soko",
      "animals",
      "ceylon-sliders",
      "cafe-wave",
      "cafe-ceylon-ahangama",
      "samba-ahangama",
    ],
  },
  {
    title: "Stays",
    venueIds: [
      "the-kip",
      "kurulu-bay",
      "palm-hotel",
      "merchant",
      "pebble-alma",
      "mana",
    ],
  },
  {
    title: "Experiences",
    venueIds: [
      "solas-surf",
      "teddies-ahangama",
      "sarana-ahangama",
      "palm-and-paint",
    ],
  },
  {
    title: "Essentials",
    venueIds: ["focus-hub", "colive", "gusta", "gik-bike-rentals", "daydream"],
  },
] as const;

const venueGroups = FEATURED_VENUE_GROUPS.map((group) => ({
  title: group.title,
  venues: group.venueIds
    .map((venueId) =>
      PLACES.find(
        (place) =>
          place.id === venueId && place.status === "active" && place.logo,
      ),
    )
    .filter((place): place is { id: string; name: string; logo: string } =>
      Boolean(place),
    )
    .map((place) => ({
      id: place.id,
      name: place.name,
      logo: place.logo,
    })),
})).filter((group) => group.venues.length > 0);

export function NewHomeVenueTrustSection() {
  return (
    <section
      id="venue-trust"
      className={styles.section}
      aria-label="Venue logos and trust"
    >
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Venue trust</span>
        <Typography.Title level={2} className={styles.sectionTitle}>
          Used at places you&apos;ll actually go
        </Typography.Title>
        <Typography.Paragraph className={styles.sectionDescription}>
          100+ curated venues across Ahangama
        </Typography.Paragraph>
      </div>

      <div className={styles.logoWall}>
        <div className={styles.logoColumns}>
          {venueGroups.map((group) => (
            <div key={group.title} className={styles.logoCategoryColumn}>
              <p className={styles.logoGroupTitle}>{group.title}</p>
              <div className={styles.logoColumnList}>
                {group.venues.map((venue) => (
                  <div key={venue.id} className={styles.logoPill}>
                    <img
                      src={venue.logo}
                      alt={venue.name}
                      className={styles.logoImage}
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
