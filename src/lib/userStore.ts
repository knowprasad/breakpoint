import { HackerTubeVideo } from '@/types/hackertube';

export interface HistoryItem {
  video: HackerTubeVideo;
  watchedAt: string; // ISO timestamp
  lastPositionSeconds?: number;
  completed?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  videos: HackerTubeVideo[];
}

export interface UserStoreState {
  history: HistoryItem[];
  liked: HackerTubeVideo[];
  watchLater: HackerTubeVideo[];
  playlists: Playlist[];
}

const STORAGE_KEY = 'breakpoint_hackertube_user_store_v1';
const EVENT_NAME = 'breakpoint-store-changed';

function getDefaultState(): UserStoreState {
  return {
    history: [],
    liked: [],
    watchLater: [],
    playlists: [
      {
        id: 'pl-foundations',
        name: 'Systems & Distributed Foundations',
        description: 'Iconic talks on consensus, storage engines, and concurrency.',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        videos: []
      },
      {
        id: 'pl-interview-prep',
        name: 'System Design Interview Prep',
        description: 'Talks explaining the failure modes tested in senior engineering rounds.',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        videos: []
      }
    ]
  };
}

export function loadUserStore(): UserStoreState {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw);
  } catch (e) {
    return getDefaultState();
  }
}

export function saveUserStore(state: UserStoreState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error('Failed to persist user store to localStorage', e);
  }
}

/* ---------------- History ---------------- */

export function recordWatchHistory(video: HackerTubeVideo, lastPositionSeconds?: number) {
  const store = loadUserStore();
  // Remove existing entry for same video
  const filtered = store.history.filter((h) => h.video.vid !== video.vid);
  const newItem: HistoryItem = {
    video,
    watchedAt: new Date().toISOString(),
    lastPositionSeconds: lastPositionSeconds || 0
  };
  // Prepend to top of history (max 200 items)
  store.history = [newItem, ...filtered].slice(0, 200);
  saveUserStore(store);
}

export function removeFromHistory(vid: string) {
  const store = loadUserStore();
  store.history = store.history.filter((h) => h.video.vid !== vid);
  saveUserStore(store);
}

export function clearWatchHistory() {
  const store = loadUserStore();
  store.history = [];
  saveUserStore(store);
}

/* ---------------- Liked Talks ---------------- */

export function toggleLikedVideo(video: HackerTubeVideo): boolean {
  const store = loadUserStore();
  const exists = store.liked.some((v) => v.vid === video.vid);
  let isNowLiked = false;

  if (exists) {
    store.liked = store.liked.filter((v) => v.vid !== video.vid);
    isNowLiked = false;
  } else {
    store.liked = [video, ...store.liked];
    isNowLiked = true;
  }

  saveUserStore(store);
  return isNowLiked;
}

export function isVideoLiked(vid: string): boolean {
  const store = loadUserStore();
  return store.liked.some((v) => v.vid === vid);
}

/* ---------------- Watch Later ---------------- */

export function toggleWatchLater(video: HackerTubeVideo): boolean {
  const store = loadUserStore();
  const exists = store.watchLater.some((v) => v.vid === video.vid);
  let isNowSaved = false;

  if (exists) {
    store.watchLater = store.watchLater.filter((v) => v.vid !== video.vid);
    isNowSaved = false;
  } else {
    store.watchLater = [video, ...store.watchLater];
    isNowSaved = true;
  }

  saveUserStore(store);
  return isNowSaved;
}

export function isVideoInWatchLater(vid: string): boolean {
  const store = loadUserStore();
  return store.watchLater.some((v) => v.vid === vid);
}

/* ---------------- Playlists ---------------- */

export function createPlaylist(name: string, description?: string): Playlist {
  const store = loadUserStore();
  const newPlaylist: Playlist = {
    id: `pl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    name: name.trim() || 'Untitled Playlist',
    description: description?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    videos: []
  };

  store.playlists.push(newPlaylist);
  saveUserStore(store);
  return newPlaylist;
}

export function deletePlaylist(playlistId: string) {
  const store = loadUserStore();
  store.playlists = store.playlists.filter((p) => p.id !== playlistId);
  saveUserStore(store);
}

export function addVideoToPlaylist(playlistId: string, video: HackerTubeVideo) {
  const store = loadUserStore();
  const pl = store.playlists.find((p) => p.id === playlistId);
  if (!pl) return;

  if (!pl.videos.some((v) => v.vid === video.vid)) {
    pl.videos.push(video);
    pl.updatedAt = new Date().toISOString();
    saveUserStore(store);
  }
}

export function removeVideoFromPlaylist(playlistId: string, vid: string) {
  const store = loadUserStore();
  const pl = store.playlists.find((p) => p.id === playlistId);
  if (!pl) return;

  pl.videos = pl.videos.filter((v) => v.vid !== vid);
  pl.updatedAt = new Date().toISOString();
  saveUserStore(store);
}

/* ---------------- Export & Portability ---------------- */

export function exportUserDataAsJSON(): string {
  const store = loadUserStore();
  return JSON.stringify(store, null, 2);
}

export function exportUserDataAsMarkdown(): string {
  const store = loadUserStore();
  let md = `# HackerTube & Breakpoint Personal Curriculum Export\n\n`;
  md += `Exported on: ${new Date().toLocaleDateString()}\n\n`;

  md += `## Liked Talks (${store.liked.length})\n\n`;
  store.liked.forEach((v, idx) => {
    md += `${idx + 1}. **[${v.title}](${v.url})** by ${v.channel} (HN Score: ${v.score})\n`;
    if (v.quote) md += `   > "${v.quote.text}"\n`;
  });

  md += `\n## Watch Later (${store.watchLater.length})\n\n`;
  store.watchLater.forEach((v, idx) => {
    md += `${idx + 1}. **[${v.title}](${v.url})** by ${v.channel}\n`;
  });

  md += `\n## Custom Playlists (${store.playlists.length})\n\n`;
  store.playlists.forEach((pl) => {
    md += `### ${pl.name} (${pl.videos.length} talks)\n`;
    if (pl.description) md += `*${pl.description}*\n\n`;
    pl.videos.forEach((v, idx) => {
      md += `- [${v.title}](${v.url}) by ${v.channel}\n`;
    });
    md += `\n`;
  });

  return md;
}
