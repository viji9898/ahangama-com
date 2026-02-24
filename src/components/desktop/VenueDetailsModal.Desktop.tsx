import { EnvironmentOutlined, InstagramOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Tag, Typography } from "antd";
import type { Venue } from "../../types/venue";

type Props = {
  open: boolean;
  onClose: () => void;
  venue: Venue;
  distanceText: string;
  ratingLine: string | null;
  discountLabel: string | null;
  excerptLine: string | null;
  offerLabels: string[];
  mapsUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
  isPassPartner: boolean;
};

export function VenueDetailsModalDesktop({
  open,
  onClose,
  venue,
  distanceText,
  ratingLine,
  discountLabel,
  excerptLine,
  offerLabels,
  mapsUrl,
  instagramUrl,
  whatsappUrl,
  isPassPartner,
}: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      title={
        <span>
          {venue.emoji?.length ? `${venue.emoji[0]} ` : ""}
          {venue.name}
        </span>
      }
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        {venue.area ? (
          <Typography.Text type="secondary">
            📍 {venue.area}
            {distanceText ? ` · ${distanceText}` : ""}
          </Typography.Text>
        ) : null}

        {ratingLine ? (
          <Typography.Text type="secondary">{ratingLine}</Typography.Text>
        ) : null}

        {discountLabel ? (
          <Typography.Text strong>{discountLabel}</Typography.Text>
        ) : null}

        {excerptLine ? (
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            {excerptLine}
          </Typography.Paragraph>
        ) : null}

        {venue.description && String(venue.description).trim() ? (
          <Typography.Paragraph style={{ marginBottom: 0 }}>
            {String(venue.description).trim()}
          </Typography.Paragraph>
        ) : null}

        {offerLabels.length ? (
          <div>
            <Typography.Text strong>Offers</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <Space size={6} wrap>
                {offerLabels.map((label) => (
                  <Tag key={label} style={{ margin: 0 }}>
                    {label}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        ) : null}

        {venue.bestFor?.length ? (
          <div>
            <Typography.Text strong>Best for</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <Space size={6} wrap>
                {venue.bestFor.map((b) => (
                  <Tag key={b} style={{ margin: 0 }}>
                    {b}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        ) : null}

        {venue.categories?.length ? (
          <div>
            <Typography.Text strong>Categories</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <Space size={6} wrap>
                {venue.categories.map((c) => (
                  <Tag key={c} style={{ margin: 0 }}>
                    {c}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        ) : null}

        {venue.howToClaim && String(venue.howToClaim).trim() ? (
          <div>
            <Typography.Text strong>How to claim</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
              {String(venue.howToClaim).trim()}
            </Typography.Paragraph>
          </div>
        ) : null}

        {venue.restrictions && String(venue.restrictions).trim() ? (
          <div>
            <Typography.Text strong>Restrictions</Typography.Text>
            <Typography.Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
              {String(venue.restrictions).trim()}
            </Typography.Paragraph>
          </div>
        ) : null}

        {venue.tags?.length ? (
          <div>
            <Typography.Text strong>Tags</Typography.Text>
            <div style={{ marginTop: 6 }}>
              <Space size={6} wrap>
                {venue.tags.map((t) => (
                  <Tag key={t} style={{ margin: 0 }}>
                    {t}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        ) : null}

        {mapsUrl || instagramUrl || whatsappUrl ? (
          <Space size={8} wrap>
            {mapsUrl ? (
              <Button
                icon={<EnvironmentOutlined />}
                onClick={() =>
                  window.open(mapsUrl, "_blank", "noopener,noreferrer")
                }
              >
                Google Maps
              </Button>
            ) : null}
            <Button
              icon={<InstagramOutlined />}
              onClick={() => {
                window.open(
                  instagramUrl ?? "https://instagram.com/",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              Instagram
            </Button>
            {whatsappUrl ? (
              <Button
                onClick={() =>
                  window.open(whatsappUrl, "_blank", "noopener,noreferrer")
                }
              >
                WhatsApp
              </Button>
            ) : null}
          </Space>
        ) : null}

        {isPassPartner ? (
          <Typography.Text type="secondary">
            Verified partner. Discount guaranteed with valid Ahangama Pass.
          </Typography.Text>
        ) : null}
      </Space>
    </Modal>
  );
}
