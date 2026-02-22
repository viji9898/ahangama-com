import { Alert, Col, Empty, Row, Spin } from "antd";
import { useParams } from "react-router-dom";
import { HeroDesktop } from "../../components/Hero.Desktop";
import { VenueCard } from "../../components/VenueCard";
import { useVenues } from "../../hooks/useVenues";

export default function HomeDesktop() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const { venues, loading, error } = useVenues({
    destinationSlug,
    liveOnly: true,
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <HeroDesktop image="https://customer-apps-techhq.s3.eu-west-2.amazonaws.com/app-ahangama-demo/hero-2.jpg" />

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

        {!loading && !error && venues.length > 0 ? (
          <Row gutter={[2, 18]} style={{ marginTop: 8 }} justify="start">
            {venues.map((v) => (
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
    </div>
  );
}
