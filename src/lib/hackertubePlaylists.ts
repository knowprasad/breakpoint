import fs from 'fs';
import path from 'path';
import { OfficialPlaylist, PlaylistSummary } from '@/types/playlist';
import { HackerTubeCategory, HackerTubeQuote } from '@/types/hackertube';

interface RawCategory {
  id?: string;
  name?: string;
  area?: string;
  area_name?: string;
  description?: string;
}

interface RawQuote {
  text: string;
  id?: number;
  hn_comment_id?: number;
  year?: string | number;
}

interface RawPlaylistVideo {
  vid: string;
  url?: string;
  title: string;
  channel: string;
  summary?: string;
  why_hn?: string;
  content_type?: string;
  level?: string;
  shelf_life?: string;
  primary_topic?: string;
  tags?: string[];
  categories?: (RawCategory | string)[];
  quote?: RawQuote | string;
  hn?: { mentions: number; recommenders: number; rec_months: number; strong_recs: number };
  score?: number;
  note?: string;
  duration_s?: number;
  published?: string;
  views?: number;
  likes?: number;
}

interface RawPlaylist {
  slug: string;
  title: string;
  pitch?: string;
  intro?: string;
  kind?: string;
  tier?: string;
  minutes?: number;
  count?: number;
  cover?: string[];
  videos?: RawPlaylistVideo[];
}

function parseLevel(lvl?: string): 'intro' | 'intermediate' | 'advanced' | 'general' {
  if (lvl === 'intro' || lvl === 'intermediate' || lvl === 'advanced' || lvl === 'general') {
    return lvl;
  }
  return 'intermediate';
}

let cachedPlaylists: OfficialPlaylist[] | null = null;
let playlistMap: Map<string, OfficialPlaylist> = new Map();

/**
 * Loads all 27 official playlists imported from hackertube.org
 */
export function getOfficialPlaylists(): OfficialPlaylist[] {
  if (cachedPlaylists) {
    return cachedPlaylists;
  }

  const filePath = path.join(process.cwd(), 'data', 'hackertube', 'playlists.json');
  if (!fs.existsSync(filePath)) {
    console.warn(`HackerTube playlists file not found at ${filePath}`);
    return [];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed: RawPlaylist[] = JSON.parse(raw);

    const playlists: OfficialPlaylist[] = parsed.map((p) => ({
      slug: p.slug,
      title: p.title,
      pitch: p.pitch || p.intro || '',
      kind: p.kind || 'curated',
      tier: p.tier || 'start',
      minutes: p.minutes || 0,
      count: p.count || p.videos?.length || 0,
      cover: Array.isArray(p.cover) ? p.cover : (p.videos || []).slice(0, 4).map((v: RawPlaylistVideo) => v.vid),
      videos: (p.videos || []).map((v: RawPlaylistVideo) => ({
        vid: v.vid,
        url: v.url || `https://www.youtube.com/watch?v=${v.vid}`,
        title: v.title,
        channel: v.channel,
        summary: v.summary || '',
        why_hn: v.why_hn || '',
        content_type: v.content_type || 'talk',
        level: parseLevel(v.level),
        shelf_life: v.shelf_life || 'evergreen',
        primary_topic: v.primary_topic || '',
        tags: Array.isArray(v.tags) ? v.tags : [],
        categories: Array.isArray(v.categories)
          ? v.categories.map((c) =>
              typeof c === 'string'
                ? { id: c, name: c, area: 'tech', area_name: 'Technology' }
                : {
                    id: c.id || 'tech',
                    name: c.name || 'General',
                    area: c.area || 'tech',
                    area_name: c.area_name || 'Technology'
                  }
            )
          : [],
        quote: v.quote
          ? typeof v.quote === 'string'
            ? { text: v.quote }
            : {
                text: v.quote.text,
                hn_comment_id: v.quote.hn_comment_id || v.quote.id,
                year: v.quote.year ? String(v.quote.year) : undefined
              }
          : undefined,
        hn: v.hn || { mentions: 0, recommenders: 0, rec_months: 0, strong_recs: 0 },
        score: typeof v.score === 'number' ? v.score : 0,
        thumbnail_url: `https://i.ytimg.com/vi/${v.vid}/hq2.jpg`,
        note: v.note || '',
        duration_s: v.duration_s,
        published: v.published,
        views: v.views,
        likes: v.likes,
        related_incident_ids: []
      }))
    }));

    cachedPlaylists = playlists;
    playlistMap = new Map(playlists.map((pl) => [pl.slug, pl]));
    return playlists;
  } catch (e) {
    console.error('Failed to parse playlists.json', e);
    return [];
  }
}

/**
 * Returns lightweight summaries of all official playlists for rapid grid rendering
 */
export function getOfficialPlaylistSummaries(): PlaylistSummary[] {
  const all = getOfficialPlaylists();
  return all.map((p) => ({
    slug: p.slug,
    title: p.title,
    pitch: p.pitch,
    kind: p.kind,
    tier: p.tier,
    minutes: p.minutes,
    count: p.count,
    cover: p.cover
  }));
}

/**
 * Retrieves a single official playlist by its slug (e.g. 'hn-canon', 'systems-and-databases')
 */
export function getOfficialPlaylistBySlug(slug: string): OfficialPlaylist | null {
  if (!cachedPlaylists) {
    getOfficialPlaylists();
  }
  return playlistMap.get(slug) || null;
}
