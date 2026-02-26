import type { CSSProperties } from "react";
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

function chipStyle(active: boolean): CSSProperties {
  return {
    border: "1px solid rgba(0,0,0,0.10)",
    background: active ? "rgba(47, 62, 58, 0.10)" : "rgba(255,255,255,0.82)",
    color: "#1A1A1A",
    fontSize: 12,
    fontWeight: 900,
    padding: "7px 12px",
    borderRadius: 999,
    whiteSpace: "nowrap",
  };
}

function selectStyle(): CSSProperties {
  return {
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.92)",
    color: "#1A1A1A",
    fontSize: 12,
    fontWeight: 800,
    padding: "9px 10px",
    borderRadius: 12,
  };
}

export function VenueFiltersMobile({
  value,
  onChange,
  nearestAvailable = false,
}: Props) {
  const selectedEditorialTag = value.tag?.trim() ? value.tag.trim() : "";

  return (
    <div
      style={{
        padding: 12,
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: "var(--app-shell-header-height)",
        zIndex: 10,
      }}
    >
      <input
        type="text"
        placeholder="Search venues"
        value={value.q}
        onChange={(e) => onChange({ q: e.target.value })}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 10,
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.10)",
        }}
      />

      <div
        style={{
          marginTop: 10,
          display: "flex",
          gap: 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 2,
        }}
      >
        <button
          type="button"
          onClick={() => onChange({ pass: !value.pass })}
          style={chipStyle(value.pass)}
        >
          Pass
        </button>
      </div>

      <div
        style={{
          marginTop: 10,
          display: "flex",
          gap: 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 2,
        }}
        aria-label="Editorial tags"
      >
        {EDITORIAL_TAGS.map((tag) => {
          const active = selectedEditorialTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onChange({ tag: active ? "" : tag })}
              style={chipStyle(active)}
              aria-pressed={active}
              title={tag}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {selectedEditorialTag ? (
        <div
          style={{
            marginTop: 8,
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

      <div
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <select
          value={value.power}
          onChange={(e) =>
            onChange({ power: (e.target.value as PowerBackup) || "" })
          }
          style={selectStyle()}
        >
          <option value="">Power backup</option>
          <option value="generator">Generator</option>
          <option value="inverter">Inverter</option>
          <option value="none">None</option>
          <option value="unknown">Unknown</option>
        </select>

        <select
          value={value.sort}
          onChange={(e) => onChange({ sort: e.target.value as VenueSortKey })}
          style={selectStyle()}
        >
          <option value="curated">Curated</option>
          <option value="top">Top Rated</option>
          <option value="reviews">Most Reviewed</option>
          {nearestAvailable ? <option value="nearest">Nearest</option> : null}
        </select>
      </div>
    </div>
  );
}
