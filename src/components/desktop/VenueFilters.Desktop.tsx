import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space, Tag } from "antd";
import {
  EDITORIAL_TAGS,
  getEditorialTagDescription,
} from "../../config/editorialTags";
import type { PowerBackup } from "../../types/venue";
import type { VenueSortKey } from "../../utils/venueList";

type Props = {
  value: {
    q: string;
    pass: boolean;
    pick: boolean;
    laptop: boolean;
    power: PowerBackup | "";
    tag: string;
    sort: VenueSortKey;
  };
  onChange: (next: Partial<Props["value"]>) => void;
  nearestAvailable?: boolean;
};

export function VenueFiltersDesktop({
  value,
  onChange,
  nearestAvailable = false,
}: Props) {
  const { CheckableTag } = Tag;

  const selectedEditorialTag = value.tag?.trim() ? value.tag.trim() : "";

  return (
    <div
      className="ahg-venue-filters"
      style={{
        background: "var(--venue-card-bg)",
        borderRadius: 16,
        padding: 16,
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Input
        className="ahg-venue-filter-search"
        value={value.q}
        onChange={(e) => onChange({ q: e.target.value })}
        placeholder="Search venues"
        size="large"
        prefix={<SearchOutlined style={{ opacity: 0.55 }} />}
        style={{ flex: "1 1 260px", minWidth: 240, borderRadius: 12 }}
        allowClear
      />

      <Space size={8} wrap>
        <CheckableTag
          checked={value.pass}
          onChange={(checked) => onChange({ pass: checked })}
          style={{ fontWeight: 800, borderRadius: 999, padding: "4px 12px" }}
        >
          Pass
        </CheckableTag>
      </Space>

      <Select
        value={value.power || undefined}
        onChange={(v) => onChange({ power: (v as PowerBackup) ?? "" })}
        placeholder="Power backup"
        allowClear
        style={{ minWidth: 170 }}
        options={[
          { value: "generator", label: "Generator" },
          { value: "inverter", label: "Inverter" },
          { value: "none", label: "None" },
          { value: "unknown", label: "Unknown" },
        ]}
      />

      <Select
        value={value.sort}
        onChange={(v) => onChange({ sort: v as VenueSortKey })}
        style={{ minWidth: 160 }}
        options={[
          { value: "curated", label: "Curated" },
          { value: "top", label: "Top Rated" },
          { value: "reviews", label: "Most Reviewed" },
          ...(nearestAvailable ? [{ value: "nearest", label: "Nearest" }] : []),
        ]}
      />

      <div style={{ flexBasis: "100%" }} />

      <div style={{ width: "100%" }}>
        <div style={{ fontSize: 12, fontWeight: 900, color: "#222" }}>
          Editorial tags
        </div>
        <Space size={8} wrap style={{ marginTop: 8 }}>
          {EDITORIAL_TAGS.map((tag) => {
            const active = selectedEditorialTag === tag;
            return (
              <CheckableTag
                key={tag}
                checked={active}
                onChange={() => onChange({ tag: active ? "" : tag })}
                style={{
                  fontWeight: 800,
                  borderRadius: 999,
                  padding: "4px 12px",
                }}
              >
                {tag}
              </CheckableTag>
            );
          })}
        </Space>

        {selectedEditorialTag ? (
          <div
            style={{
              marginTop: 10,
              border: "1px solid rgba(0,0,0,0.06)",
              background: "rgba(255,255,255,0.92)",
              borderRadius: 12,
              padding: 10,
            }}
            aria-live="polite"
          >
            <div style={{ fontWeight: 900, fontSize: 12, color: "#222" }}>
              Editorial tag: {selectedEditorialTag}
            </div>
            <div style={{ marginTop: 2, fontSize: 12, color: "#666" }}>
              {getEditorialTagDescription(selectedEditorialTag) ??
                "Curated by Ahangama. Showing venues that match this vibe."}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
