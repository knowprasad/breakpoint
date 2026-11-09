import { HackerTubeVideo } from '@/types/hackertube';
import { INCIDENT_CANONICAL_TALKS } from '@/data/incidentVideos';

let cachedCatalog: HackerTubeVideo[] | null = null;
let fetchPromise: Promise<HackerTubeVideo[]> | null = null;

function getFallbackCatalog(): HackerTubeVideo[] {
  return Object.values(INCIDENT_CANONICAL_TALKS).flat();
}

/**
 * Loads the video catalog on the client side from /data/videos.json
 * Falls back to canonical incident talks during SSR or if offline
 */
export async function getClientVideoCatalog(): Promise<HackerTubeVideo[]> {
  if (cachedCatalog) return cachedCatalog;
  if (typeof window === 'undefined') {
    return getFallbackCatalog();
  }
  if (!fetchPromise) {
    fetchPromise = fetch('/data/videos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load /data/videos.json');
        return res.json();
      })
      .then((data: unknown[]) => {
        const rawList = data as Record<string, unknown>[];
        cachedCatalog = rawList.map((v) => ({
          vid: String(v.vid || ''),
          url: `https://www.youtube.com/watch?v=${v.vid}`,
          title: String(v.title || ''),
          channel: String(v.channel || ''),
          summary: String(v.summary || ''),
          why_hn: String(v.why_hn || ''),
          content_type: 'talk' as const,
          level: (v.level as 'intro' | 'intermediate' | 'advanced') || 'intermediate',
          shelf_life: 'evergreen' as const,
          primary_topic: String(v.primary_topic || ''),
          tags: Array.isArray(v.tags) ? (v.tags as string[]) : [],
          categories: [],
          hn: (v.hn as { mentions: number; recommenders: number; rec_months: number; strong_recs: number }) || {
            mentions: 0,
            recommenders: 0,
            rec_months: 0,
            strong_recs: 0,
          },
          score: v.score || 0,
          thumbnail_url: `https://i.ytimg.com/vi/${v.vid}/hq2.jpg`,
          related_incident_ids: []
        }));
        return cachedCatalog;
      })
      .catch((err) => {
        console.warn('Falling back to curated catalog:', err);
        cachedCatalog = getFallbackCatalog();
        return cachedCatalog;
      });
  }
  return fetchPromise;
}

export function searchClientVideos(
  catalog: HackerTubeVideo[],
  options: {
    query?: string;
    area?: string;
    level?: string;
    sortBy?: 'score' | 'mentions' | 'recommenders';
    limit?: number;
    offset?: number;
  }
) {
  const {
    query = '',
    area = 'all',
    level = 'all',
    sortBy = 'score',
    limit = 24,
    offset = 0
  } = options;

  let results = catalog;

  // Filter area
  if (area && area !== 'all') {
    const qArea = area.toLowerCase();
    results = results.filter((v) =>
      v.primary_topic.toLowerCase().includes(qArea) ||
      v.tags.some((t) => t.toLowerCase().includes(qArea))
    );
  }

  // Filter level
  if (level && level !== 'all') {
    results = results.filter((v) => v.level === level);
  }

  // Filter query
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter((v) =>
      v.title.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.summary.toLowerCase().includes(q) ||
      v.primary_topic.toLowerCase().includes(q) ||
      v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort
  results = [...results].sort((a, b) => {
    if (sortBy === 'mentions') {
      return (b.hn?.mentions || 0) - (a.hn?.mentions || 0);
    }
    if (sortBy === 'recommenders') {
      return (b.hn?.recommenders || 0) - (a.hn?.recommenders || 0);
    }
    return (b.score || 0) - (a.score || 0);
  });

  const totalCount = results.length;
  const paginated = results.slice(offset, offset + limit);

  return {
    videos: paginated,
    totalCount,
    hasMore: offset + limit < totalCount
  };
}
