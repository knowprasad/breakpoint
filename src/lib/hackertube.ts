import fs from 'fs';
import path from 'path';
import { HackerTubeVideo } from '@/types/hackertube';

let cachedVideos: HackerTubeVideo[] | null = null;
let videoMap: Map<string, HackerTubeVideo> = new Map();

/**
 * Loads and indexes all 6,454 HackerTube videos from videos.jsonl
 */
export function getHackerTubeRepository(): HackerTubeVideo[] {
  if (cachedVideos) {
    return cachedVideos;
  }

  const filePath = path.join(process.cwd(), 'data', 'videos.jsonl');
  if (!fs.existsSync(filePath)) {
    console.warn(`HackerTube data not found at ${filePath}`);
    return [];
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const lines = fileContent.trim().split('\n');
  const videos: HackerTubeVideo[] = [];
  const map = new Map<string, HackerTubeVideo>();

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const v = JSON.parse(line);
      const video: HackerTubeVideo = {
        vid: v.vid,
        url: v.url || `https://www.youtube.com/watch?v=${v.vid}`,
        title: v.title,
        channel: v.channel,
        summary: v.summary || '',
        why_hn: v.why_hn || '',
        content_type: v.content_type || 'talk',
        level: v.level || 'intermediate',
        shelf_life: v.shelf_life || 'evergreen',
        primary_topic: v.primary_topic || '',
        tags: Array.isArray(v.tags) ? v.tags : [],
        categories: Array.isArray(v.categories) ? v.categories : [],
        quote: v.quote,
        hn: v.hn || { mentions: 0, recommenders: 0, rec_months: 0, strong_recs: 0 },
        score: typeof v.score === 'number' ? v.score : 0,
        thumbnail_url: `https://i.ytimg.com/vi/${v.vid}/hqdefault.jpg`,
        related_incident_ids: []
      };

      // Heuristic bidirectional cross-linking to famous disasters
      const lowerText = `${video.title} ${video.summary} ${video.primary_topic} ${video.tags.join(' ')}`.toLowerCase();

      if (lowerText.includes('cache') || lowerText.includes('redis') || lowerText.includes('stampede')) {
        video.related_incident_ids!.push('incident-shopify-2019-cache-avalanche');
      }
      if (lowerText.includes('kernel') || lowerText.includes('ebpf') || lowerText.includes('driver') || lowerText.includes('operating system')) {
        video.related_incident_ids!.push('incident-crowdstrike-2024-bsod-kernel-driver');
        video.related_incident_ids!.push('incident-datadog-2023-ebpf-kernel-panic');
      }
      if (lowerText.includes('postgres') || lowerText.includes('database') || lowerText.includes('replication') || lowerText.includes('backup')) {
        video.related_incident_ids!.push('incident-gitlab-2017-database-loss');
      }
      if (lowerText.includes('regex') || lowerText.includes('automata') || lowerText.includes('redos')) {
        video.related_incident_ids!.push('incident-cloudflare-2019-regex-cpu-spike');
      }
      if (lowerText.includes('consensus') || lowerText.includes('raft') || lowerText.includes('paxos') || lowerText.includes('split brain')) {
        video.related_incident_ids!.push('incident-github-2018-database-partition-split-brain');
      }
      if (lowerText.includes('retry') || lowerText.includes('backoff') || lowerText.includes('resilience') || lowerText.includes('circuit breaker')) {
        video.related_incident_ids!.push('incident-aws-s3-2017-typo-command');
        video.related_incident_ids!.push('incident-netflix-2012-christmas-eve-elb');
      }
      if (lowerText.includes('bgp') || lowerText.includes('dns') || lowerText.includes('networking') || lowerText.includes('tcp')) {
        video.related_incident_ids!.push('incident-facebook-2021-bgp-routing-blackhole');
        video.related_incident_ids!.push('incident-slack-2021-dnssec-expiration');
      }
      if (lowerText.includes('concurrency') || lowerText.includes('deadlock') || lowerText.includes('lock')) {
        video.related_incident_ids!.push('incident-stripe-2020-rate-limiter-cascade');
      }

      videos.push(video);
      map.set(video.vid, video);
    } catch (e) {
      // skip invalid line
    }
  }

  // Sort by HN score descending by default
  videos.sort((a, b) => b.score - a.score);

  cachedVideos = videos;
  videoMap = map;
  return videos;
}

export function getVideoByVid(vid: string): HackerTubeVideo | undefined {
  getHackerTubeRepository();
  return videoMap.get(vid);
}

export interface HackerTubeSearchParams {
  query?: string;
  area?: string;
  category?: string;
  level?: string;
  channel?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'score' | 'mentions' | 'recommenders' | 'rec_months';
}

export function searchHackerTube(params: HackerTubeSearchParams = {}) {
  const allVideos = getHackerTubeRepository();
  const query = (params.query || '').trim().toLowerCase();
  const area = params.area;
  const category = params.category;
  const level = params.level;
  const channel = params.channel;
  const limit = params.limit || 24;
  const offset = params.offset || 0;
  const sortBy = params.sortBy || 'score';

  let filtered = allVideos;

  if (query) {
    const terms = query.split(' ').filter(Boolean);
    filtered = filtered.filter((v) => {
      const haystack = `${v.title} ${v.channel} ${v.primary_topic} ${v.summary} ${v.tags.join(' ')}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }

  if (area && area !== 'all') {
    filtered = filtered.filter((v) =>
      v.categories.some((c) => c.area === area || c.area_name.toLowerCase() === area.toLowerCase())
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((v) =>
      v.categories.some((c) => c.id === category || c.name.toLowerCase() === category.toLowerCase())
    );
  }

  if (level && level !== 'all') {
    filtered = filtered.filter((v) => v.level.toLowerCase() === level.toLowerCase());
  }

  if (channel && channel !== 'all') {
    filtered = filtered.filter((v) => v.channel.toLowerCase() === channel.toLowerCase());
  }

  if (sortBy === 'mentions') {
    filtered.sort((a, b) => b.hn.mentions - a.hn.mentions);
  } else if (sortBy === 'recommenders') {
    filtered.sort((a, b) => b.hn.recommenders - a.hn.recommenders);
  } else if (sortBy === 'rec_months') {
    filtered.sort((a, b) => b.hn.rec_months - a.hn.rec_months);
  } else {
    filtered.sort((a, b) => b.score - a.score);
  }

  const paginated = filtered.slice(offset, offset + limit);

  return {
    videos: paginated,
    totalCount: filtered.length,
    hasMore: offset + limit < filtered.length
  };
}

export function getHackerTubeTopAreas() {
  const videos = getHackerTubeRepository();
  const areasMap = new Map<string, { id: string; name: string; count: number }>();

  videos.forEach((v) => {
    v.categories.forEach((c) => {
      const existing = areasMap.get(c.area) || { id: c.area, name: c.area_name, count: 0 };
      existing.count += 1;
      areasMap.set(c.area, existing);
    });
  });

  return Array.from(areasMap.values()).sort((a, b) => b.count - a.count);
}

export function getRelatedVideosForIncident(incidentId: string, limit = 4): HackerTubeVideo[] {
  const videos = getHackerTubeRepository();
  return videos
    .filter((v) => v.related_incident_ids && v.related_incident_ids.includes(incidentId))
    .slice(0, limit);
}

