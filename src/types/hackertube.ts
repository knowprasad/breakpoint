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
}
