import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

type Props = {
  searchText: string;
  onSearchTextChange: (value: string) => void;
};

export function VenueFiltersDesktop({
  searchText,
  onSearchTextChange,
}: Props) {
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
    </div>
  );
}
