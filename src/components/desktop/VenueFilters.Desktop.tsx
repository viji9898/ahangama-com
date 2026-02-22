import { Input, Select } from "antd";

type Props = {
  searchText: string;
  onSearchTextChange: (value: string) => void;

  category: string | null;
  onCategoryChange: (value: string | null) => void;

  selectedBestFor: string[];
  onSelectedBestForChange: (value: string[]) => void;

  selectedTags: string[];
  onSelectedTagsChange: (value: string[]) => void;

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
  categoryOptions,
  bestForOptions,
  tagOptions,
}: Props) {
  return (
    <div
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
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        placeholder="Search venues"
        style={{ flex: "1 1 260px", minWidth: 240 }}
        allowClear
      />

      <Select
        value={category ?? undefined}
        onChange={(value) => onCategoryChange(value ?? null)}
        placeholder="Category"
        allowClear
        showSearch
        optionFilterProp="label"
        getPopupContainer={() => document.body}
        options={categoryOptions.map((c) => ({ label: c, value: c }))}
        style={{ flex: "0 0 200px", minWidth: 180 }}
      />

      <Select
        mode="multiple"
        value={selectedBestFor}
        onChange={onSelectedBestForChange}
        placeholder="Best for"
        allowClear
        showSearch
        optionFilterProp="label"
        getPopupContainer={() => document.body}
        options={bestForOptions.map((b) => ({ label: b, value: b }))}
        style={{ flex: "1 1 260px", minWidth: 240 }}
      />

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
        style={{ flex: "1 1 260px", minWidth: 240 }}
      />
    </div>
  );
}
