import { useState } from "react";
import type { Venue } from "../../../types/venue";
import type { LatLng } from "./geo.mobile";
import { VenueListingCardMobile } from "./VenueListingCard.mobile";

type Props = {
  venues: Venue[];
  userLocation: LatLng | null;
};

export function VenueListMobile({ venues, userLocation }: Props) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  return (
    <>
      {venues.map((venue) => {
        const id = venue.id;
        const expanded = expandedId === id;

        return (
          <VenueListingCardMobile
            key={String(id)}
            venue={venue}
            userLocation={userLocation}
            expanded={expanded}
            onToggleExpanded={() => setExpandedId(expanded ? null : id)}
          />
        );
      })}
    </>
  );
}
