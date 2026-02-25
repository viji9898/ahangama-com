import { EnvironmentOutlined, InstagramOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Grid,
  Modal,
  Space,
  Tag,
  Typography,
  theme,
} from "antd";
import { useMemo, useState } from "react";
import type { Venue } from "../../types/venue";

type Props = {
  open: boolean;
  onClose: () => void;
  venue: Venue;
  distanceText: string;
  excerptLine: string | null;
  offerLabels: string[];
  mapsUrl: string | null;
  instagramUrl: string | null;
  whatsappUrl: string | null;
  isPassPartner: boolean;
};

const numberFormatter = new Intl.NumberFormat("en-US");

function getRatingDisplay(venue: Venue): {
  stars: number;
  reviews: number;
  text: string;
  isTopRated: boolean;
} | null {
  const starsRaw = venue.stars;
  const stars =
    typeof starsRaw === "number"
      ? starsRaw
      : typeof starsRaw === "string"
        ? Number.parseFloat(starsRaw)
        : null;
  if (stars == null || !Number.isFinite(stars)) return null;

  const reviewsRaw = venue.reviews;
  const reviewsNum =
    typeof reviewsRaw === "number"
      ? reviewsRaw
      : typeof reviewsRaw === "string"
        ? Number.parseFloat(reviewsRaw)
        : null;
  const reviews =
    reviewsNum != null && Number.isFinite(reviewsNum)
      ? Math.max(0, Math.round(reviewsNum))
      : null;
  if (reviews == null) return null;

  const isTopRated = stars >= 4.8 && reviews >= 20;
  return {
    stars,
    reviews,
    text: `⭐ ${stars.toFixed(1)} • ${numberFormatter.format(reviews)} reviews`,
    isTopRated,
  };
}

function getDiscountPercent(discount: Venue["discount"]): number | null {
  if (discount == null) return null;

  if (typeof discount === "number" && Number.isFinite(discount)) {
    if (discount > 0 && discount < 1) return Math.round(discount * 100);
    if (discount >= 1) return Math.round(discount);
    return null;
  }

  if (typeof discount === "string") {
    const raw = discount.trim();
    if (!raw) return null;

    const percentMatch = raw.match(/(\d+(?:\.\d+)?)\s*%/);
    if (percentMatch?.[1]) {
      const parsed = Number.parseFloat(percentMatch[1]);
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

function toOfferScope(firstOfferLabel: string | null, venue: Venue): string {
  const raw = (firstOfferLabel ?? "").trim();
  if (raw) {
    const cleaned = raw
      .replace(/\b(save)\b\s*\d+(?:\.\d+)?\s*%/gi, "")
      .replace(/\b\d+(?:\.\d+)?\s*%\s*off\b/gi, "")
      .replace(/^[:\-–—\s]+/, "")
      .trim();

    if (cleaned) return cleaned;
  }

  const fallback = venue.categories?.length
    ? String(venue.categories[0]).trim()
    : "";
  return fallback || "your bill";
}

export function VenueDetailsModalDesktop({
  open,
  onClose,
  venue,
  distanceText,
  offerLabels,
  mapsUrl,
  instagramUrl,
  whatsappUrl,
  isPassPartner,
}: Props) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isSmall = !screens.md;

  const distance =
    distanceText && distanceText.trim() ? distanceText.trim() : "";

  const logoUrl =
    typeof venue.logo === "string" && venue.logo.trim()
      ? venue.logo.trim()
      : null;

  const bannerUrl =
    typeof venue.image === "string" && venue.image.trim()
      ? venue.image.trim()
      : typeof venue.ogImage === "string" && venue.ogImage.trim()
        ? venue.ogImage.trim()
        : null;

  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const dividerStyle = { margin: "12px 0" };

  const discountPercent = isPassPartner
    ? getDiscountPercent(venue.discount)
    : null;
  const offerScope =
    discountPercent != null ? toOfferScope(offerLabels[0] ?? null, venue) : "";
  const typicalSavingRange = { min: 5, max: 15 };

  const howToClaimText =
    venue.howToClaim && String(venue.howToClaim).trim()
      ? String(venue.howToClaim).trim()
      : isPassPartner
        ? "Show your Ahangama Pass at checkout."
        : "Check with the venue for current offers and booking details.";

  const whyCopy =
    venue.excerpt && String(venue.excerpt).trim()
      ? String(venue.excerpt).trim()
      : venue.description && String(venue.description).trim()
        ? String(venue.description).trim()
        : null;
  const whyIsLong = Boolean(whyCopy && whyCopy.length > 140);

  const rating = getRatingDisplay(venue);

  const tagsModel = useMemo(() => {
    const bestForRaw = Array.isArray(venue.bestFor) ? venue.bestFor : [];
    const tagsRaw = Array.isArray(venue.tags) ? venue.tags : [];

    const bestFor = bestForRaw.map((x) => String(x).trim()).filter(Boolean);
    const tags = tagsRaw.map((x) => String(x).trim()).filter(Boolean);

    const fullMap = new Map<string, string>();
    for (const value of [...bestFor, ...tags]) {
      const key = value.toLowerCase();
      if (!fullMap.has(key)) fullMap.set(key, value);
    }
    const full = Array.from(fullMap.values());

    const collapsedMap = new Map<string, string>();
    for (const value of bestFor.slice(0, 3)) {
      const key = value.toLowerCase();
      if (!collapsedMap.has(key)) collapsedMap.set(key, value);
    }
    for (const value of tags) {
      if (collapsedMap.size >= 5) break;
      const key = value.toLowerCase();
      if (!collapsedMap.has(key)) collapsedMap.set(key, value);
    }
    const collapsed = Array.from(collapsedMap.values()).slice(0, 5);

    return {
      full,
      collapsed,
      hiddenCount: Math.max(0, full.length - collapsed.length),
    };
  }, [venue.bestFor, venue.tags]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      style={{ maxHeight: "80vh" }}
      styles={{
        header: {
          padding: 0,
        },
        body: {
          maxHeight: "calc(80vh - 260px)",
          overflowY: "auto",
        },
      }}
      title={
        <div style={{ width: "100%" }}>
          {bannerUrl ? (
            <div
              style={{
                width: "100%",
                height: isSmall ? 140 : 180,
                overflow: "hidden",
                background: token.colorFillSecondary,
                borderTopLeftRadius: token.borderRadiusLG,
                borderTopRightRadius: token.borderRadiusLG,
              }}
            >
              <img
                src={bannerUrl}
                alt={`${venue.name} banner`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                loading="lazy"
              />
            </div>
          ) : null}

          <div
            style={{ padding: isSmall ? "12px 16px 10px" : "14px 24px 12px" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {logoUrl ? (
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: token.borderRadiusLG,
                      overflow: "hidden",
                      border: `1px solid ${token.colorBorderSecondary}`,
                      background: token.colorFillSecondary,
                      flex: "0 0 auto",
                    }}
                  >
                    <img
                      src={logoUrl}
                      alt={`${venue.name} logo`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    {venue.emoji?.length ? `${venue.emoji[0]} ` : ""}
                    {venue.name}
                  </span>

                  {venue.area || rating || distance ? (
                    <Typography.Text
                      type="secondary"
                      style={{ marginTop: 4, fontSize: 12, lineHeight: "16px" }}
                    >
                      {[
                        venue.area ? (
                          <span key="area">{venue.area}</span>
                        ) : null,
                        rating ? (
                          <span key="stars">⭐ {rating.stars.toFixed(1)}</span>
                        ) : null,
                        rating ? (
                          <span key="reviews">
                            {numberFormatter.format(rating.reviews)} Google
                            reviews
                          </span>
                        ) : null,
                        distance ? (
                          <span key="distance">{distance}</span>
                        ) : null,
                      ]
                        .filter(Boolean)
                        .map((item, index, arr) => (
                          <span key={(item as any).key ?? index}>
                            {item}
                            {index < arr.length - 1 ? (
                              <span
                                aria-hidden="true"
                                style={{
                                  margin: "0 8px",
                                  color: token.colorTextTertiary,
                                }}
                              >
                                ·
                              </span>
                            ) : null}
                          </span>
                        ))}
                    </Typography.Text>
                  ) : null}
                </div>
              </div>
              {discountPercent != null ? (
                <div
                  style={{
                    marginTop: 8,
                    padding: "10px 12px",
                    background: token.colorFillTertiary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: isSmall ? "column" : "row",
                      gap: 10,
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 12 }}
                      >
                        With Pass
                      </Typography.Text>
                      <Typography.Text strong style={{ fontSize: 12 }}>
                        {discountPercent}% off
                      </Typography.Text>
                    </div>

                    <div
                      aria-hidden="true"
                      style={
                        isSmall
                          ? {
                              height: 1,
                              width: "100%",
                              background: token.colorSplit,
                            }
                          : {
                              width: 1,
                              background: token.colorSplit,
                            }
                      }
                    />

                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 12 }}
                      >
                        Without Pass
                      </Typography.Text>
                      <Typography.Text strong style={{ fontSize: 12 }}>
                        Full price
                      </Typography.Text>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {discountPercent != null ? (
          <div>
            <Typography.Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              Save {discountPercent}% on {offerScope}
            </Typography.Title>
            <Typography.Text type="secondary">
              Typical saving: ${typicalSavingRange.min}-$
              {typicalSavingRange.max} per rental
            </Typography.Text>
          </div>
        ) : null}

        {discountPercent != null ? <Divider style={dividerStyle} /> : null}

        <div>
          <Typography.Text strong>How to claim</Typography.Text>
          <Typography.Paragraph style={{ marginTop: 6, marginBottom: 0 }}>
            {howToClaimText}
          </Typography.Paragraph>
          <div style={{ marginTop: 6 }}>
            <Typography.Text type="secondary" style={{ display: "block" }}>
              ✅ Takes 5 seconds
            </Typography.Text>
            {isPassPartner ? (
              <Typography.Text type="secondary" style={{ display: "block" }}>
                ✅ Instant discount
              </Typography.Text>
            ) : null}
          </div>
        </div>

        {whyCopy ? (
          <div>
            <Typography.Text strong>Why we recommend it</Typography.Text>
            <Typography.Paragraph
              style={{
                marginTop: 6,
                marginBottom: 0,
                fontSize: 13,
                lineHeight: "18px",
                color: token.colorTextSecondary,
                ...(whyIsLong && !whyExpanded
                  ? {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }
                  : null),
              }}
            >
              {whyCopy}
            </Typography.Paragraph>
            {whyIsLong ? (
              <div style={{ marginTop: 6 }}>
                <Typography.Link
                  style={{ fontSize: 12 }}
                  onClick={() => setWhyExpanded((v) => !v)}
                >
                  {whyExpanded ? "Read less" : "Read more"}
                </Typography.Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <Divider style={dividerStyle} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            {isPassPartner && offerLabels.length ? (
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
          </Space>

          <Space direction="vertical" size={16} style={{ width: "100%" }}>
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

            {tagsModel.full.length ? (
              <div>
                <Typography.Text strong>Tags</Typography.Text>
                <div style={{ marginTop: 6 }}>
                  <Space size={6} wrap>
                    {(tagsExpanded ? tagsModel.full : tagsModel.collapsed).map(
                      (t) => (
                        <Tag key={t.toLowerCase()} style={{ margin: 0 }}>
                          {t}
                        </Tag>
                      ),
                    )}
                    {tagsModel.hiddenCount > 0 ? (
                      <Tag
                        role="button"
                        tabIndex={0}
                        style={{
                          margin: 0,
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        onClick={() => setTagsExpanded((v) => !v)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setTagsExpanded((v) => !v);
                          }
                        }}
                      >
                        {tagsExpanded
                          ? "Show less"
                          : `+${tagsModel.hiddenCount} more`}
                      </Tag>
                    ) : null}
                  </Space>
                </div>
              </div>
            ) : null}

            {venue.restrictions && String(venue.restrictions).trim() ? (
              <div>
                <Typography.Text strong>Restrictions</Typography.Text>
                <Typography.Paragraph
                  style={{
                    marginTop: 6,
                    marginBottom: 0,
                    fontSize: 12,
                    lineHeight: "16px",
                    color: token.colorTextSecondary,
                  }}
                >
                  {String(venue.restrictions).trim()}
                </Typography.Paragraph>
              </div>
            ) : null}
          </Space>
        </div>

        {mapsUrl || instagramUrl || whatsappUrl ? (
          <Divider style={dividerStyle} />
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
