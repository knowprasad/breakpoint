import { HackerTubeVideo } from './hackertube';

export interface HackerTubePlaylistVideo extends HackerTubeVideo {
  note?: string;
  duration_s?: number;
  published?: string;
  views?: number;
  likes?: number;
}

export interface OfficialPlaylist {
  slug: string;
  title: string;
  pitch: string;
  kind: string;
  tier: string;
  minutes: number;
  count: number;
  cover: string[];
  videos: HackerTubePlaylistVideo[];
}

export interface PlaylistSummary {
  slug: string;
  title: string;
  pitch: string;
  kind: string;
  tier: string;
  minutes: number;
  count: number;
  cover: string[];
}
