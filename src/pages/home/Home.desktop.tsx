import { Alert, Col, Empty, Row, Spin, Typography } from "antd";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SavingsSummary } from "../../components/SavingsSummary";
import { FooterDesktop } from "../../components/desktop/Footer.Desktop";
import { FreeGuideCtaDesktop } from "../../components/desktop/FreeGuideCta.Desktop";
import { HeroDesktop } from "../../components/desktop/Hero.Desktop";
import { VenueFiltersDesktop } from "../../components/desktop/VenueFilters.Desktop";
import { VenueCard } from "../../components/VenueCard";
import { useVenues } from "../../hooks/useVenues";

type SectionKey = "most-popular" | "best-discounts" | "beach-road" | "wellness";

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getReviewsCount(v: { reviews?: unknown }): number {
  const n = toNumber(v.reviews);
  return n != null ? Math.round(n) : 0;
}

function formatOfferLabel(offer: unknown): string | null {
  if (!offer || typeof offer !== "object") return null;
  const rec = offer as Record<string, unknown>;
  if (typeof rec.label === "string" && rec.label.trim())
    return rec.label.trim();
  if (typeof rec.type === "string" && rec.type.trim()) return rec.type.trim();
  return null;
}

function discountPercentFromValue(discount: unknown): number | null {
  if (discount == null) return null;
  if (typeof discount === "number" && Number.isFinite(discount)) {
    if (discount > 0 && discount < 1) return Math.round(discount * 100);
    if (discount >= 1) return Math.round(discount);
    return null;
  }
  if (typeof discount === "string") {
    const raw = discount.trim();
    if (!raw) return null;
    const match = raw.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match?.[1]) {
      const parsed = Number.parseFloat(match[1]);
      return Number.isFinite(parsed) ? Math.round(parsed) : null;
    }
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return null;
    if (parsed > 0 && parsed < 1) return Math.round(parsed * 100);
    if (parsed >= 1) return Math.round(parsed);
    return null;
  }
  return null;
}

function maxPercentOfferScore(v: {
  discount?: unknown;
  offers?: unknown[];
}): number {
  const percents: number[] = [];
  const discountPct = discountPercentFromValue(v.discount);
  if (discountPct != null) percents.push(discountPct);

  for (const offer of v.offers ?? []) {
    const label = typeof offer === "string" ? offer : formatOfferLabel(offer);
    if (!label) continue;
    const match = label.match(/(\d+(?:\.\d+)?)\s*%/);
    if (match?.[1]) {
      const parsed = Number.parseFloat(match[1]);
      if (Number.isFinite(parsed)) percents.push(Math.round(parsed));
    }
  }

  return percents.length ? Math.max(...percents) : 0;
}

export default function HomeDesktop() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedBestFor, setSelectedBestFor] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewAllSection, setViewAllSection] = useState<SectionKey | null>(null);
  const viewAllRef = useRef<HTMLDivElement | null>(null);

  const { venues, loading, error } = useVenues({
    destinationSlug,
    liveOnly: true,
  });

  const { categoryOptions, bestForOptions, tagOptions } = useMemo(() => {
    const categories = new Set<string>();
    const bestFor = new Set<string>();
    const tags = new Set<string>();

    for (const v of venues) {
      for (const c of v.categories ?? []) categories.add(String(c));
      for (const b of v.bestFor ?? []) bestFor.add(String(b));
      for (const t of v.tags ?? []) tags.add(String(t));
    }

    const sortStrings = (values: Set<string>) =>
      Array.from(values)
        .map((x) => x.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

    return {
      categoryOptions: sortStrings(categories),
      bestForOptions: sortStrings(bestFor),
      tagOptions: sortStrings(tags),
    };
  }, [venues]);

  const filteredVenues = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return venues.filter((v) => {
      if (category && !(v.categories ?? []).includes(category)) return false;

      if (selectedBestFor.length) {
        const set = new Set((v.bestFor ?? []).map(String));
        const matchesAny = selectedBestFor.some((b) => set.has(b));
        if (!matchesAny) return false;
      }

      if (selectedTags.length) {
        const set = new Set((v.tags ?? []).map(String));
        const matchesAny = selectedTags.some((t) => set.has(t));
        if (!matchesAny) return false;
      }

      if (!q) return true;

      const haystack = [
        v.name,
        v.area,
        v.excerpt,
        ...(v.categories ?? []),
        ...(v.bestFor ?? []),
        ...(v.tags ?? []),
      ]
        .filter((x): x is string => Boolean(x))
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [venues, category, selectedBestFor, selectedTags, searchText]);

  const sections = useMemo(() => {
    const base = filteredVenues;

    const mostPopularAll = base
      .slice()
      .sort((a, b) => getReviewsCount(b) - getReviewsCount(a));
    const mostPopular = mostPopularAll.slice(0, 8);

    const bestDiscountsAll = base
      .slice()
      .map((v) => ({ v, score: maxPercentOfferScore(v) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.v);
    const bestDiscounts = bestDiscountsAll.slice(0, 8);

    const beachRoadAll = base.filter((v) => {
      const area = (v.area ?? "").toString().toLowerCase();
      return area.includes("matara road") || area.includes("beach road");
    });
    const beachRoad = beachRoadAll.slice(0, 8);

    const wellnessAll = base.filter((v) => {
      const cats = (v.categories ?? []).map((c) => String(c).toLowerCase());
      return cats.some(
        (c) => c.includes("experiences") || c.includes("wellness"),
      );
    });
    const wellness = wellnessAll.slice(0, 8);

    return {
      mostPopular,
      mostPopularAll,
      bestDiscounts,
      bestDiscountsAll,
      beachRoad,
      beachRoadAll,
      wellness,
      wellnessAll,
    };
  }, [filteredVenues]);

  const handleViewAll = (key: SectionKey) => {
    setViewAllSection(key);
    requestAnimationFrame(() => {
      viewAllRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const viewAllVenues = (() => {
    switch (viewAllSection) {
      case "most-popular":
        return { title: "⭐ Most Popular", venues: sections.mostPopularAll };
      case "best-discounts":
        return {
          title: "🔥 Best Discounts",
          venues: sections.bestDiscountsAll,
        };
      case "beach-road":
        return { title: "🏝️ Beach Road Picks", venues: sections.beachRoadAll };
      case "wellness":
        return {
          title: "🌿 Wellness Favourites",
          venues: sections.wellnessAll,
        };
      default:
        return null;
    }
  })();

  const Section = ({
    title,
    venues,
    onViewAll,
  }: {
    title: string;
    venues: typeof filteredVenues;
    onViewAll: () => void;
  }) => {
    if (!venues.length) return null;
    return (
      <div style={{ marginTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16, color: "#222" }}>
            {title}
          </div>
          <Typography.Link
            onClick={onViewAll}
            style={{ fontWeight: 800, fontSize: 12 }}
          >
            View All
          </Typography.Link>
        </div>

        <Row gutter={[12, 18]} justify="start">
          {venues.slice(0, 8).map((v) => (
            <Col
              key={String(v.id)}
              xs={24}
              sm={12}
              md={12}
              lg={6}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <VenueCard
                venue={v}
                variant="desktop"
                cardStyle={{ width: 250, height: 340 }}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <HeroDesktop image="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-2.jpg" />

      <div style={{ marginBottom: 12 }}>
        <FreeGuideCtaDesktop
          onGuideClick={() => {
            const text = encodeURIComponent(
              "Hi! I'd like the free Ahangama guide via WhatsApp.",
            );
            window.open(
              `https://wa.me/94777879087?text=${text}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
        />
      </div>

      {!loading && !error && venues.length > 0 ? (
        <VenueFiltersDesktop
          searchText={searchText}
          onSearchTextChange={setSearchText}
          category={category}
          onCategoryChange={setCategory}
          selectedBestFor={selectedBestFor}
          onSelectedBestForChange={setSelectedBestFor}
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
          categoryOptions={categoryOptions}
          bestForOptions={bestForOptions}
          tagOptions={tagOptions}
        />
      ) : null}

      <div style={{ marginTop: 12 }}>
        <SavingsSummary />
      </div>

      <div style={{ marginTop: 16, background: "var(--venue-listing-bg)" }}>
        {error ? (
          <Alert
            type="error"
            showIcon
            message="Could not load venues"
            description={
              <span>
                {error}. Tip: run locally with <code>netlify dev</code>.
              </span>
            }
          />
        ) : null}

        {loading ? (
          <div
            style={{ padding: 48, display: "flex", justifyContent: "center" }}
          >
            <Spin size="large" />
          </div>
        ) : null}

        {!loading && !error && venues.length === 0 ? (
          <Empty description="No venues found" />
        ) : null}

        {!loading &&
        !error &&
        venues.length > 0 &&
        filteredVenues.length === 0 ? (
          <Empty description="No venues match your filters" />
        ) : null}

        {!loading && !error && filteredVenues.length > 0 ? (
          <>
            <Section
              title="⭐ Most Popular"
              venues={sections.mostPopular}
              onViewAll={() => handleViewAll("most-popular")}
            />
            <Section
              title="🔥 Best Discounts"
              venues={sections.bestDiscounts}
              onViewAll={() => handleViewAll("best-discounts")}
            />
            <Section
              title="🏝️ Beach Road Picks"
              venues={sections.beachRoad}
              onViewAll={() => handleViewAll("beach-road")}
            />
            <Section
              title="🌿 Wellness Favourites"
              venues={sections.wellness}
              onViewAll={() => handleViewAll("wellness")}
            />

            {viewAllVenues ? (
              <div ref={viewAllRef} style={{ marginTop: 22 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 16, color: "#222" }}>
                    {viewAllVenues.title}
                  </div>
                  <Typography.Link
                    onClick={() => setViewAllSection(null)}
                    style={{ fontWeight: 800, fontSize: 12, color: "#666" }}
                  >
                    Hide
                  </Typography.Link>
                </div>
                <Row gutter={[12, 18]} justify="start">
                  {viewAllVenues.venues.map((v) => (
                    <Col
                      key={String(v.id)}
                      xs={24}
                      sm={12}
                      md={12}
                      lg={6}
                      style={{ display: "flex", justifyContent: "flex-start" }}
                    >
                      <VenueCard
                        venue={v}
                        variant="desktop"
                        cardStyle={{ width: 250, height: 340 }}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ) : null}
          </>
        ) : null}
      </div>

      <FooterDesktop />
    </div>
  );
}
