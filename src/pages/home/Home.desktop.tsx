import { Alert, Col, Empty, Row, Space, Spin, Typography } from "antd";
import { useParams } from "react-router-dom";
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
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Typography.Title level={2} style={{ marginBottom: 0 }}>
          {destinationSlug}
        </Typography.Title>
        <Typography.Text type="secondary">Venues - Desktop</Typography.Text>
      </Space>

      <div style={{ marginTop: 16 }}>
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
          <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
            {venues.map((v) => (
              <Col key={String(v.id)} xs={24} sm={12} lg={8}>
                <VenueCard venue={v} variant="desktop" />
              </Col>
            ))}
          </Row>
        ) : null}
      </div>
    </div>
  );
}
