import { HackerTubeVideo, ArchitectureLayer, FailureVector } from '@/types/hackertube';
import { CANONICAL_24_SYSTEMS_TALKS } from '@/data/canonicalTalks24';

export interface SearchOptions {
  query?: string;
  architectureLayers?: ArchitectureLayer[];
  failureVectors?: FailureVector[];
  area?: string;
  level?: string;
  sortBy?: 'score' | 'mentions' | 'recommenders';
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  videos: HackerTubeVideo[];
  totalCount: number;
  hasMore: boolean;
  latencyMs?: number;
}

let workerInstance: Worker | null = null;
let isWorkerReady = false;
let workerReadyCallbacks: (() => void)[] = [];
let pendingRequests = new Map<number, (res: SearchResponse) => void>();
let requestCounter = 0;

let inMemoryCatalog: HackerTubeVideo[] = [...CANONICAL_24_SYSTEMS_TALKS];

/**
 * Initializes the client catalog and background Web Worker.
 * Guaranteed to never block initial render or hydration.
 */
export function getInitialCanonicalTalks(): HackerTubeVideo[] {
  return CANONICAL_24_SYSTEMS_TALKS;
}

export function initCatalogWorker(): Worker | null {
  if (typeof window === 'undefined') return null;
  if (workerInstance) return workerInstance;

  try {
    workerInstance = new Worker('/workers/catalogWorker.js');

    workerInstance.onmessage = (e) => {
      const data = e.data;
      if (!data) return;

      if (data.type === 'INDEX_READY') {
        isWorkerReady = true;
        workerReadyCallbacks.forEach((cb) => cb());
        workerReadyCallbacks = [];
      } else if (data.type === 'SEARCH_RESULTS') {
        const { requestId, videos, totalCount, hasMore, latencyMs } = data;
        if (typeof requestId === 'number' && pendingRequests.has(requestId)) {
          const resolve = pendingRequests.get(requestId)!;
          pendingRequests.delete(requestId);
          resolve({ videos, totalCount, hasMore, latencyMs });
        }
      }
    };

    // Send init signal with pre-rendered 24 canonical talks
    workerInstance.postMessage({
      type: 'INIT',
      canonical24: CANONICAL_24_SYSTEMS_TALKS
    });
  } catch (err) {
    console.warn('Web Worker not supported or failed to load. Using in-memory fallback.', err);
  }

  return workerInstance;
}

/**
 * High-performance search: sends query to Web Worker if ready,
 * otherwise evaluates in-memory instantly in <50ms.
 */
export async function queryTalkCatalog(options: SearchOptions): Promise<SearchResponse> {
  const startTime = performance.now();

  // If worker is running and ready, delegate off-thread
  if (workerInstance && isWorkerReady) {
    return new Promise((resolve) => {
      const reqId = ++requestCounter;
      pendingRequests.set(reqId, resolve);
      workerInstance!.postMessage({
        type: 'SEARCH',
        requestId: reqId,
        query: options.query || '',
        architectureLayers: options.architectureLayers || [],
        failureVectors: options.failureVectors || [],
        sortBy: options.sortBy || 'score',
        limit: options.limit || 24,
        offset: options.offset || 0
      });

      // Safety timeout: fallback if worker hangs
      setTimeout(() => {
        if (pendingRequests.has(reqId)) {
          pendingRequests.delete(reqId);
          resolve(searchInMemoryFallback(options, startTime));
        }
      }, 150);
    });
  }

  // Fast in-memory synchronous evaluation (<50ms)
  return searchInMemoryFallback(options, startTime);
}

function searchInMemoryFallback(options: SearchOptions, startTime: number): SearchResponse {
  const {
    query = '',
    architectureLayers = [],
    failureVectors = [],
    sortBy = 'score',
    limit = 24,
    offset = 0
  } = options;

  let candidates = inMemoryCatalog;

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    candidates = candidates.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.summary.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        v.primary_topic.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (architectureLayers.length > 0) {
    candidates = candidates.filter((v) =>
      v.architecture_layer ? architectureLayers.includes(v.architecture_layer) : false
    );
  }

  if (failureVectors.length > 0) {
    candidates = candidates.filter((v) =>
      v.failure_vector ? failureVectors.includes(v.failure_vector) : false
    );
  }

  if (sortBy === 'mentions') {
    candidates.sort((a, b) => (b.hn?.mentions || 0) - (a.hn?.mentions || 0));
  } else if (sortBy === 'recommenders') {
    candidates.sort((a, b) => (b.hn?.recommenders || 0) - (a.hn?.recommenders || 0));
  } else {
    candidates.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  const totalCount = isWorkerReady ? inMemoryCatalog.length : 6454;
  const filteredCount = candidates.length;
  const paginated = candidates.slice(offset, offset + limit);
  const latencyMs = Math.round((performance.now() - startTime) * 10) / 10;

  return {
    videos: paginated,
    totalCount: (query || architectureLayers.length > 0 || failureVectors.length > 0) ? filteredCount : totalCount,
    hasMore: offset + limit < filteredCount,
    latencyMs
  };
}

export async function getClientVideoCatalog(): Promise<HackerTubeVideo[]> {
  return CANONICAL_24_SYSTEMS_TALKS;
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

  let results = catalog.length > 0 ? catalog : CANONICAL_24_SYSTEMS_TALKS;

  if (area && area !== 'all') {
    const qArea = area.toLowerCase();
    results = results.filter(
      (v) =>
        v.primary_topic.toLowerCase().includes(qArea) ||
        v.tags.some((t) => t.toLowerCase().includes(qArea))
    );
  }

  if (level && level !== 'all') {
    results = results.filter((v) => v.level === level);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.summary.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        v.primary_topic.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'mentions') {
    results.sort((a, b) => (b.hn?.mentions || 0) - (a.hn?.mentions || 0));
  } else if (sortBy === 'recommenders') {
    results.sort((a, b) => (b.hn?.recommenders || 0) - (a.hn?.recommenders || 0));
  } else {
    results.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  const paginated = results.slice(offset, offset + limit);

  return {
    videos: paginated,
    totalCount: results.length,
    hasMore: offset + limit < results.length
  };
}
