import { Alert, Col, Empty, Row, Spin } from "antd";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FooterDesktop } from "../../components/Footer.Desktop";
import { FreeGuideCtaDesktop } from "../../components/FreeGuideCta.Desktop";
import { HeroDesktop } from "../../components/Hero.Desktop";
import { VenueFiltersDesktop } from "../../components/VenueFilters.Desktop";
import { VenueCard } from "../../components/VenueCard";
import { useVenues } from "../../hooks/useVenues";

export default function HomeDesktop() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedBestFor, setSelectedBestFor] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
          <Row gutter={[2, 18]} style={{ marginTop: 8 }} justify="start">
            {filteredVenues.map((v) => (
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
                  cardStyle={{ width: 250, height: 320 }}
                />
              </Col>
            ))}
          </Row>
        ) : null}
      </div>

      <FooterDesktop />
    </div>
  );
}
