export type IncidentSeverity = 'P0' | 'P1' | 'Critical P0' | 'Major P1' | 'High P2';

export interface TimelineEntry {
  time: string;
  description: string;
}

export interface DisasterRecord {
  id: string;
  slug?: string;
  organization?: string;
  severity: IncidentSeverity;
  headline?: string;
  blastRadius?: string;
  rootCauseSnippet?: string;
  whyLocalhostMissedIt?: string;
  mitigationApplied?: string;
  recommendedTalkIds?: string[];
}

export interface DisasterIncident extends DisasterRecord {
  title: string;
  company: string;                    // e.g. "Shopify", "GitLab", "Cloudflare"
  company_logo?: string;              // Emoji or SVG identifier
  year: number;
  duration: string;                   // e.g. "6 hours", "73 minutes"
  impact: string;                     // e.g. "Complete database downtime, data loss"
  service_affected: string;
  category: string;                   // e.g. "databases-storage", "networking-bgp", "distributed-systems"
  root_cause_tag: string;             // e.g. "thundering-herd", "redos", "split-brain"
  trigger: string;                    // Immediate human action or release catalyst
  mechanism_explanation: string;      // Deep CS mechanism & architectural flaw
  mechanism_diagram?: string[];       // Architecture flow diagram lines / ASCII representation
  timeline: TimelineEntry[];          // Step-by-step chronology
  mitigation_rule: string;            // Concrete mitigation formula
  checklist_rules: string[];          // Practical defensive rules for PR reviews
  original_postmortem_url: string;
  hn_discussion_url?: string;
  related_resource_ids: string[];     // Bidirectionally linked to canonical resources
}
