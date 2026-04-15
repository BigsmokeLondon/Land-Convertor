export interface LatLng {
  lat: number;
  lng: number;
}

export interface Field {
  id: string;
  name: string;
  points: LatLng[];
  color: string;
  segmentsOverride?: Record<number, number>; // Maps segment index to manual distance (ft)
}

export interface SurveyState {
  fields: Field[];
  activeFieldId: string;
}
