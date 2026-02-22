import {
  EnvironmentOutlined,
  InstagramOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { Venue } from "../types/venue";

type Props = {
  venue: Venue;
  variant?: "default" | "desktop";
  cardStyle?: CSSProperties;
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

function getNumericPx(value: CSSProperties["height"]): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.endsWith("px")) {
      const parsed = Number.parseFloat(trimmed);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }
  return null;
}

export function VenueCard({ venue, variant = "default", cardStyle }: Props) {
  const actions: ReactNode[] = [];

  const discountLabel =
    venue.discount != null && String(venue.discount).trim() !== ""
      ? String(venue.discount)
      : null;

  const starsAndReviews =
    variant === "desktop"
      ? formatStarsAndReviews(venue.stars, venue.reviews)
      : null;

  const desktopCoverHeightPx =
    variant === "desktop"
      ? (() => {
          const cardHeightPx = getNumericPx(cardStyle?.height);
          return cardHeightPx != null ? Math.round(cardHeightPx * 0.4) : null;
        })()
      : null;

  const hasDesktopCoverImage =
    variant === "desktop" && Boolean(venue.image || venue.logo);

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
      style={
        variant === "desktop"
          ? {
              ...cardStyle,
              display: "flex",
              flexDirection: "column",
            }
          : cardStyle
      }
      styles={
        variant === "desktop"
          ? {
              body: {
                flex: 1,
                overflowY: "auto",
              },
            }
          : undefined
      }
      cover={
        hasDesktopCoverImage ? (
          <div style={{ position: "relative" }}>
            <img
              src={String(venue.image || venue.logo)}
              alt={venue.name}
              style={{
                width: "100%",
                height: desktopCoverHeightPx ?? 180,
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
            {discountLabel ? (
              <div style={{ position: "absolute", top: 8, left: 8 }}>
                <Tag>{discountLabel}</Tag>
              </div>
            ) : null}
          </div>
        ) : undefined
      }
      actions={actions.length ? actions : undefined}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Space size={8} wrap>
          {variant === "desktop" && venue.emoji?.length ? (
            <span aria-label="emoji">{venue.emoji.join(" ")}</span>
          ) : null}
          <Typography.Text strong>{venue.name}</Typography.Text>
          {!hasDesktopCoverImage && discountLabel ? <Tag>{discountLabel}</Tag> : null}
        </Space>

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
