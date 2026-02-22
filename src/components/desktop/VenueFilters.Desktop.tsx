import {
  SearchOutlined,
  SwapOutlined,
  StarOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Button, Input, Select } from "antd";

export type VenueSortKey =
  | "recommended"
  | "most-popular"
  | "best-discounts"
  | "a-z";

type Props = {
  searchText: string;
  onSearchTextChange: (value: string) => void;

  category: string | null;
  onCategoryChange: (value: string | null) => void;

  selectedBestFor: string[];
  onSelectedBestForChange: (value: string[]) => void;

  selectedTags: string[];
  onSelectedTagsChange: (value: string[]) => void;

  sortKey: VenueSortKey;
  onSortKeyChange: (value: VenueSortKey) => void;

  onClearAll: () => void;

  categoryOptions: string[];
  bestForOptions: string[];
  tagOptions: string[];
};

export function VenueFiltersDesktop({
  searchText,
  onSearchTextChange,
  category,
  onCategoryChange,
  selectedBestFor,
  onSelectedBestForChange,
  selectedTags,
  onSelectedTagsChange,
  sortKey,
  onSortKeyChange,
  onClearAll,
  categoryOptions,
  bestForOptions,
  tagOptions,
}: Props) {
  const hasActiveFilters =
    Boolean(searchText.trim()) ||
    category != null ||
    selectedBestFor.length > 0 ||
    selectedTags.length > 0 ||
    sortKey !== "recommended";

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
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        placeholder="Search venues"
        size="large"
        prefix={<SearchOutlined style={{ opacity: 0.55 }} />}
        style={{ flex: "1 1 260px", minWidth: 240, borderRadius: 12 }}
        allowClear
      />

      <div
        className="ahg-filter-with-icon ahg-venue-filter-control"
        style={{ flex: "0 0 200px", minWidth: 180 }}
      >
        <TagOutlined className="ahg-filter-icon" />
        <Select
          value={category ?? undefined}
          onChange={(value) => onCategoryChange(value ?? null)}
          placeholder="Category"
          allowClear
          showSearch
          optionFilterProp="label"
          getPopupContainer={() => document.body}
          options={categoryOptions.map((c) => ({ label: c, value: c }))}
          size="large"
          style={{ width: "100%" }}
        />
      </div>

      <div
        className="ahg-filter-with-icon ahg-venue-filter-control"
        style={{ flex: "0 0 180px", minWidth: 160 }}
      >
        <SwapOutlined className="ahg-filter-icon" />
        <Select
          value={sortKey}
          onChange={(value) => onSortKeyChange(value)}
          placeholder="Sort"
          getPopupContainer={() => document.body}
          size="large"
          style={{ width: "100%" }}
          options={
            [
              { label: "Recommended", value: "recommended" },
              { label: "Most popular", value: "most-popular" },
              { label: "Best discounts", value: "best-discounts" },
              { label: "A → Z", value: "a-z" },
            ] satisfies Array<{ label: string; value: VenueSortKey }>
          }
        />
      </div>

      <Select
        className="ahg-venue-filter-control"
        mode="multiple"
        value={selectedBestFor}
        onChange={onSelectedBestForChange}
        placeholder="Best for"
        allowClear
        showSearch
        optionFilterProp="label"
        getPopupContainer={() => document.body}
        options={bestForOptions.map((b) => ({ label: b, value: b }))}
        size="large"
        style={{ flex: "1 1 260px", minWidth: 240 }}
      />

      <div
        className="ahg-filter-with-icon ahg-venue-filter-control"
        style={{ flex: "1 1 260px", minWidth: 240 }}
      >
        <StarOutlined className="ahg-filter-icon" />
        <Select
          mode="multiple"
          value={selectedTags}
          onChange={onSelectedTagsChange}
          placeholder="Tags"
          allowClear
          showSearch
          optionFilterProp="label"
          getPopupContainer={() => document.body}
          options={tagOptions.map((t) => ({ label: t, value: t }))}
          size="large"
          style={{ width: "100%" }}
        />
      </div>

      {hasActiveFilters ? (
        <Button
          type="text"
          size="large"
          onClick={onClearAll}
          className="ahg-venue-filters-clear"
          style={{
            marginLeft: "auto",
            fontWeight: 800,
            color: "var(--pass-primary)",
          }}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}
