export interface FailureModeCategory {
  slug: string;
  name: string;
  description: string;
  iconName: string;
}

export interface RootCauseMatrixItem {
  id: string;
  tag: string;
  title: string;
  category: string;
  cs_principle: string;
  summary: string;
  incident_ids: string[];
  resource_ids: string[];
  risk_level: 'High' | 'Critical' | 'Severe';
  typical_blast_radius: string;
  defensive_pattern: string;
}
