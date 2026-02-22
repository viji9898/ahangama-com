import { Alert, Empty, Space, Spin, Typography } from "antd";
import { useParams } from "react-router-dom";
import { VenueCard } from "../../components/VenueCard";
import { useVenues } from "../../hooks/useVenues";

export default function HomeMobile() {
  const params = useParams();
  const destinationSlug = String(params.destinationSlug || "ahangama");

  const { venues, loading, error } = useVenues({
    destinationSlug,
    liveOnly: true,
  });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Space direction="vertical" size={6} style={{ width: "100%" }}>
        <Typography.Title level={3} style={{ marginBottom: 0 }}>
          {destinationSlug}
        </Typography.Title>
        <Typography.Text type="secondary">Venues - Mobile</Typography.Text>
      </Space>

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
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {venues.map((v) => (
              <VenueCard key={String(v.id)} venue={v} />
            ))}
          </Space>
        ) : null}
      </div>
    </div>
  );
}
