export interface HackerTubeQuote {
  text: string;
  hn_comment_id?: number;
  year?: string;
}

export interface HackerTubeCategory {
  id: string;
  name: string;
  area: string;
  area_name: string;
}

export interface HackerTubeHNStats {
  mentions: number;
  recommenders: number;
  rec_months: number;
  strong_recs: number;
  first_year?: number;
  last_year?: number;
}

export interface ForensicSummary {
  trap: string;           // Concrete anti-pattern or failure mode
  mental_model: string;   // Core invariant (e.g., WAL, Fencing tokens, Jittered backoff)
  production_rule: string;// PR-level rule of thumb to enforce in code reviews
}

export type ArchitectureLayer =
  | 'Kernel/OS'
  | 'Databases/Storage'
  | 'Distributed Systems'
  | 'Networking & Edge'
  | 'Application Runtime'
  | string;

export type FailureVector =
  | 'Cascading Failures & Thundering Herds'
  | 'Data Loss & Split-Brain'
  | 'Concurrency & Deadlocks'
  | 'Configuration & Human Error'
  | 'Resource Exhaustion'
  | string;

export interface HackerTubeVideo {
  vid: string;
  url: string;
  title: string;
  channel: string;
  summary: string;
  why_hn: string;
  content_type: 'talk' | 'course' | 'lecture' | 'tutorial' | string;
  level: 'intro' | 'intermediate' | 'advanced' | 'general';
  shelf_life: 'evergreen' | string;
  primary_topic: string;
  tags: string[];
  categories: HackerTubeCategory[];
  quote?: HackerTubeQuote;
  hn: HackerTubeHNStats;
  score: number;
  thumbnail_url: string;
  related_incident_ids?: string[];
  prevented_outage?: string;
  architecture_layer?: ArchitectureLayer;
  failure_vector?: FailureVector;
  forensic_summary?: ForensicSummary;
}
