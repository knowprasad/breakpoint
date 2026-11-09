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

export type MatrixLayer =
  | 'Application Runtime'
  | 'Cache Tier'
  | 'Database & Storage'
  | 'Networking & Edge'
  | 'Deployment & Infrastructure';

export type MatrixPrimitive =
  | 'Resource Exhaustion'
  | 'Concurrency & Race Conditions'
  | 'State Corruption & Desync'
  | 'Network Partitions & Timeouts';

export interface DefensivePatternDetail {
  name: string;
  headline: string;
  mechanism: string;
  invariant: string;
  codeExample?: string;
}

export interface MatrixCellData {
  id: string;
  layer: MatrixLayer;
  primitive: MatrixPrimitive;
  patternName: string;
  shortCode: string;
  defensivePattern: DefensivePatternDetail;
  incidentIds: string[];
  talkIds: string[];
}
