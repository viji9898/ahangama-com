import {
  EnvironmentOutlined,
  InstagramOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";
import type { ReactNode } from "react";
import type { Venue } from "../types/venue";

type Props = {
  venue: Venue;
  variant?: "default" | "desktop";
};

function formatOfferLabel(offer: unknown): string | null {
  if (!offer || typeof offer !== "object") return null;

  const maybeOffer = offer as Record<string, unknown>;
  if (typeof maybeOffer.label === "string" && maybeOffer.label.trim())
    return maybeOffer.label.trim();
  if (typeof maybeOffer.type === "string" && maybeOffer.type.trim())
    return maybeOffer.type.trim();

  return null;
}

function formatStarsAndReviews(
  stars: Venue["stars"],
  reviews: Venue["reviews"],
): string | null {
  const starsNum = typeof stars === "number" ? stars : null;
  const reviewsNum = typeof reviews === "number" ? reviews : null;

  if (starsNum == null && reviewsNum == null) return null;
  if (starsNum != null && reviewsNum != null)
    return `${starsNum} (${reviewsNum} Google reviews)`;
  if (starsNum != null) return `${starsNum}`;
  return `${reviewsNum} Google reviews`;
}

export function VenueCard({ venue, variant = "default" }: Props) {
  const actions: ReactNode[] = [];

  const starsAndReviews =
    variant === "desktop"
      ? formatStarsAndReviews(venue.stars, venue.reviews)
      : null;

  if (venue.mapUrl) {
    actions.push(
      <Button
        key="map"
        type="link"
        href={venue.mapUrl}
        target="_blank"
        rel="noreferrer"
        icon={<EnvironmentOutlined />}
      >
        Google Maps
      </Button>,
    );
  }

  if (venue.instagramUrl) {
    actions.push(
      <Button
        key="ig"
        type="link"
        href={venue.instagramUrl}
        target="_blank"
        rel="noreferrer"
        icon={<InstagramOutlined />}
      >
        Instagram
      </Button>,
    );
  }

  return (
    <Card
      cover={
        variant === "desktop" && (venue.image || venue.logo) ? (
          <img
            src={String(venue.image || venue.logo)}
            alt={venue.name}
            style={{ width: "100%", height: 180, objectFit: "cover" }}
            loading="lazy"
          />
        ) : undefined
      }
      title={
        <Space size={8} wrap>
          {variant === "desktop" && venue.emoji?.length ? (
            <span aria-label="emoji">{venue.emoji.join(" ")}</span>
          ) : null}
          <span>{venue.name}</span>
          {venue.discount != null && String(venue.discount).trim() !== "" ? (
            <Tag>{String(venue.discount)}</Tag>
          ) : null}
        </Space>
      }
      actions={actions.length ? actions : undefined}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        {variant === "desktop" ? (
          <Space size={10} wrap>
            {venue.area ? (
              <Typography.Text type="secondary">{venue.area}</Typography.Text>
            ) : null}
            {starsAndReviews ? (
              <Space size={6} wrap>
                <StarFilled />
                <Typography.Text type="secondary">
                  {starsAndReviews}
                </Typography.Text>
              </Space>
            ) : null}
          </Space>
        ) : venue.area ? (
          <Typography.Text type="secondary">{venue.area}</Typography.Text>
        ) : null}

        {venue.categories?.length ? (
          <Space size={6} wrap>
            {venue.categories.map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </Space>
        ) : null}

        {variant === "desktop" ? (
          <>
            {Array.isArray(venue.offers) && venue.offers.length ? (
              <Space size={6} wrap>
                {venue.offers
                  .map(formatOfferLabel)
                  .filter((x): x is string => Boolean(x))
                  .slice(0, 4)
                  .map((label) => (
                    <Tag key={label}>{label}</Tag>
                  ))}
                {venue.offers.length > 4 ? (
                  <Tag>+{venue.offers.length - 4} offers</Tag>
                ) : null}
              </Space>
            ) : null}

            {venue.bestFor?.length ? (
              <div>
                <Typography.Text type="secondary">Best for</Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={6} wrap>
                    {venue.bestFor.slice(0, 6).map((b) => (
                      <Tag key={b}>{b}</Tag>
                    ))}
                    {venue.bestFor.length > 6 ? (
                      <Tag>+{venue.bestFor.length - 6}</Tag>
                    ) : null}
                  </Space>
                </div>
              </div>
            ) : null}

            {venue.tags?.length ? (
              <div>
                <Typography.Text type="secondary">Tags</Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={6} wrap>
                    {venue.tags.slice(0, 8).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                    {venue.tags.length > 8 ? (
                      <Tag>+{venue.tags.length - 8}</Tag>
                    ) : null}
                  </Space>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </Space>
    </Card>
  );
}
