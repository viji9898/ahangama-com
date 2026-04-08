import { Col, Flex, Row, Tooltip, Typography } from "antd";
import { PLACES } from "../../data/places";
import styles from "../../pages/home/Home.desktop.new.module.css";

type VenueTrustLogo = {
  id: string;
  name: string;
  logo: string;
  featured?: boolean;
};

type VenueTrustCategory = {
  title: string;
  venues: VenueTrustLogo[];
};

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

const defaultCategories: VenueTrustCategory[] = FEATURED_VENUE_GROUPS.map(
  (group) => ({
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
      .map((place, index) => ({
        id: place.id,
        name: place.name,
        logo: place.logo,
        featured: index === 0,
      })),
  }),
).filter((group) => group.venues.length > 0);

const trustStats = [
  {
    value: "100+",
    label: "venues live",
  },
  {
    value: "4",
    label: "categories covered",
  },
  {
    value: "Same day",
    label: "ready to use",
  },
];

type Props = {
  categories?: VenueTrustCategory[];
};

export function NewHomeVenueTrustSection({
  categories = defaultCategories,
}: Props) {
  return (
    <section
      id="venue-trust"
      className={styles.section}
      aria-label="Venue logos and trust"
    >
      <div className={styles.logoProofPanel}>
        <Flex
          className={styles.logoProofHeader}
          justify="space-between"
          gap={20}
        >
          <div className={styles.logoProofCopy}>
            <span className={styles.eyebrow}>Venue trust</span>
            <Typography.Title level={2} className={styles.logoProofTitle}>
              Used at places you&apos;ll actually go
            </Typography.Title>
            <Typography.Paragraph className={styles.logoProofDescription}>
              100+ venues across Ahangama
            </Typography.Paragraph>
            <Typography.Paragraph className={styles.logoProofMicrocopy}>
              Cafes, stays, surf, wellness, and essentials you&apos;ll actually
              use.
            </Typography.Paragraph>
          </div>
          <div className={styles.logoProofBadge}>Premium local partners</div>
        </Flex>

        <div className={styles.logoWall}>
          <Row gutter={[14, 14]} className={styles.logoColumns}>
            {categories.map((group) => (
              <Col key={group.title} xs={24} md={12} xl={6}>
                <div className={styles.logoCategoryColumn}>
                  <div className={styles.logoCategoryHeader}>
                    <p className={styles.logoGroupTitle}>{group.title}</p>
                    <span className={styles.logoGroupCount}>
                      {group.venues.length} places
                    </span>
                  </div>
                  <div className={styles.logoColumnList}>
                    {group.venues.map((venue) => (
                      <Tooltip
                        key={venue.id}
                        title={venue.name}
                        mouseEnterDelay={0.2}
                      >
                        <div
                          className={[
                            styles.logoTile,
                            venue.featured ? styles.logoTileFeatured : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <img
                            src={venue.logo}
                            alt={venue.name}
                            className={styles.logoImage}
                            loading="lazy"
                            draggable={false}
                          />
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <Flex className={styles.logoStatsRow} gap={10} wrap>
          {trustStats.map((stat) => (
            <div key={stat.label} className={styles.logoStatCard}>
              <span className={styles.logoStatValue}>{stat.value}</span>
              <span className={styles.logoStatLabel}>{stat.label}</span>
            </div>
          ))}
        </Flex>

        <a href="/venues" className={styles.logoProofLink}>
          See all venues
        </a>
      </div>
    </section>
  );
}
