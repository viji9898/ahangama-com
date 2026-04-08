export interface PlaceRecord {
  id: string;
  name: string;
  status?: string;
  logo?: string;
}

export const PLACES: PlaceRecord[];