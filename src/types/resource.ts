export type ResourceType = 'talk' | 'book' | 'course' | 'paper';
export type ResourceLevel = 'Intro' | 'Intermediate' | 'Advanced';
export type ShelfLife = 'Evergreen' | 'Classic' | 'Essential';

export interface PullQuote {
  text: string;
  source: string;
  year: string;
}

export interface LibraryResource {
  id: string;                         // e.g. "book-ddia", "talk-redis-internals"
  type: ResourceType;
  title: string;
  creator: string;                    // Author / Speaker / Professor
  url: string;                        // Canonical link or video link
  thumbnail_url?: string;
  primary_topic: string;              // e.g. "databases-storage", "distributed-systems"
  tags: string[];
  summary: string;                    // 1-2 sentence core thesis
  mental_model_3min: string;          // 3-minute distillation for busy engineers
  why_recommended: string;            // Why practitioners re-read and vouch for it
  pull_quote: PullQuote;
  level: ResourceLevel;
  shelf_life: ShelfLife;
  key_takeaways: string[];            // Actionable engineering checklists
  lindy_score: number;                // 0 to 100 resilience score
  related_incident_ids: string[];     // Bidirectionally linked to disasters
}
