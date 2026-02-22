type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function VenueSearchAndCategoriesMobile({
  search,
  onSearchChange,
}: Props) {
  return (
    <div
      style={{
        padding: 12,
        background: "#FBF6F1",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <input
        type="text"
        placeholder="Search venues or perks"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #eee",
          marginBottom: 0,
        }}
      />
    </div>
  );
}
