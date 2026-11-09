'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HackerTubeVideo } from '@/types/hackertube';
import { OfficialPlaylist } from '@/types/playlist';
import { VideoCard } from './VideoCard';
import { DisasterIncident } from '@/types/incident';
import {
  loadUserStore,
  saveUserStore,
  clearWatchHistory,
  exportUserDataAsJSON,
  exportUserDataAsMarkdown,
  createPlaylist,
  deletePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  UserStoreState,
  Playlist
} from '@/lib/userStore';
import {
  Search,
  Flame,
  Star,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Heart,
  Clock,
  Bookmark,
  FolderKanban,
  FolderPlus,
  Trash2,
  Play,
  Plus,
  Upload,
  Compass,
  X
} from 'lucide-react';

interface HackerTubeExplorerProps {
  initialVideos?: HackerTubeVideo[];
  onSelectIncident?: (incident: DisasterIncident) => void;
}

type TabMode = 'all' | 'liked' | 'history' | 'watchLater' | 'playlists';

const TOP_AREAS = [
  { id: 'all', name: 'All 6,454 Talks' },
  { id: 'Systems, Networks & Security', name: 'Systems & Security (956)' },
  { id: 'Software Engineering & Languages', name: 'Software Craft (1,604)' },
  { id: 'AI, Machine Learning & Data', name: 'AI & Data (718)' },
  { id: 'Computing History & Culture', name: 'History & Culture (1,295)' },
  { id: 'Hardware & Electronics', name: 'Hardware & Chips (769)' },
  { id: 'Mathematics & Theoretical CS', name: 'Theoretical CS (479)' }
];

export function HackerTubeExplorer({ initialVideos = [] }: HackerTubeExplorerProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('all');
  const [videos, setVideos] = useState<HackerTubeVideo[]>(initialVideos);
  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'mentions' | 'recommenders'>('score');
  const [level, setLevel] = useState('all');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(6454);

  // User Library Store State
  const [userStore, setUserStore] = useState<UserStoreState>(() => loadUserStore());

  // Inline Playlist View State (Zero modals!)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');

  // 27 Official Playlists imported from hackertube.org
  const [officialPlaylists, setOfficialPlaylists] = useState<OfficialPlaylist[]>([]);
  const [selectedOfficialPlaylistSlug, setSelectedOfficialPlaylistSlug] = useState<string | null>(null);
  const [playlistSection, setPlaylistSection] = useState<'all' | 'official' | 'custom'>('all');

  useEffect(() => {
    if (activeTab === 'playlists' && officialPlaylists.length === 0) {
      fetch('/api/playlists?full=true')
        .then((r) => r.json())
        .then((data) => {
          if (data.playlists) {
            setOfficialPlaylists(data.playlists);
          }
        })
        .catch((e) => console.error('Failed to load official playlists', e));
    }
  }, [activeTab, officialPlaylists.length]);

  useEffect(() => {
    const handleStoreChange = () => {
      setUserStore(loadUserStore());
    };
    window.addEventListener('breakpoint-store-changed', handleStoreChange);
    return () => window.removeEventListener('breakpoint-store-changed', handleStoreChange);
  }, []);

  // Fetch videos for "All Talks" from API
  const fetchVideos = async (reset = false, newOffset = 0) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        area: selectedArea,
        level: level,
        sort: sortBy,
        limit: '24',
        offset: newOffset.toString()
      });

      const res = await fetch(`/api/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (reset) {
          setVideos(data.videos);
        } else {
          setVideos((prev) => [...prev, ...data.videos]);
        }
        setTotalCount(data.totalCount);
        setHasMore(data.hasMore);
        setOffset(newOffset);
      }
    } catch (e) {
      console.error('Error fetching videos', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'all') {
      const timer = setTimeout(() => {
        fetchVideos(true, 0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [query, selectedArea, sortBy, level, activeTab]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchVideos(false, offset + 24);
    }
  };

  // Export handlers
  const handleExportJSON = () => {
    const jsonStr = exportUserDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breakpoint-curriculum-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const mdStr = exportUserDataAsMarkdown();
    const blob = new Blob([mdStr], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breakpoint-curriculum-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePlayAllOnYouTube = () => {
    let targetVideos: HackerTubeVideo[] = [];
    if (activeTab === 'liked') {
      targetVideos = userStore.liked;
    } else if (activeTab === 'watchLater') {
      targetVideos = userStore.watchLater;
    } else if (activeTab === 'history') {
      targetVideos = userStore.history.map((h) => h.video);
    } else if (activeTab === 'playlists') {
      if (selectedPlaylistId) {
        const currentPl = userStore.playlists.find((p) => p.id === selectedPlaylistId);
        targetVideos = currentPl ? currentPl.videos : [];
      } else if (userStore.playlists.length > 0) {
        targetVideos = userStore.playlists[0].videos;
      }
    } else {
      targetVideos = videos;
    }

    const vids = targetVideos.slice(0, 50).map((v) => v.vid).filter(Boolean);
    if (vids.length === 0) return;
    const url = `https://www.youtube.com/watch_videos?video_ids=${vids.join(',')}`;
    window.open(url, '_blank');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (parsed.history || parsed.liked || parsed.playlists || parsed.watchLater)) {
          saveUserStore(parsed);
          setUserStore(parsed);
          alert('Curriculum successfully imported!');
        } else {
          alert('Invalid Breakpoint curriculum JSON format.');
        }
      } catch (err) {
        alert('Failed to parse curriculum JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered lists for personal views
  const filteredLiked = useMemo(() => {
    if (!query) return userStore.liked;
    const q = query.toLowerCase();
    return userStore.liked.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        v.primary_topic.toLowerCase().includes(q)
    );
  }, [userStore.liked, query]);

  const filteredWatchLater = useMemo(() => {
    if (!query) return userStore.watchLater;
    const q = query.toLowerCase();
    return userStore.watchLater.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        v.primary_topic.toLowerCase().includes(q)
    );
  }, [userStore.watchLater, query]);

  const filteredHistory = useMemo(() => {
    if (!query) return userStore.history;
    const q = query.toLowerCase();
    return userStore.history.filter(
      (h) =>
        h.video.title.toLowerCase().includes(q) ||
        h.video.channel.toLowerCase().includes(q) ||
        h.video.primary_topic.toLowerCase().includes(q)
    );
  }, [userStore.history, query]);

  // Playlists filtering
  const filteredPlaylists = useMemo(() => {
    if (!query) return userStore.playlists;
    const q = query.toLowerCase();
    return userStore.playlists.filter(
      (pl) =>
        pl.name.toLowerCase().includes(q) ||
        (pl.description && pl.description.toLowerCase().includes(q)) ||
        pl.videos.some(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            v.channel.toLowerCase().includes(q) ||
            v.primary_topic.toLowerCase().includes(q)
        )
    );
  }, [userStore.playlists, query]);

  const activePlaylist = useMemo(() => {
    if (!selectedPlaylistId) return null;
    return userStore.playlists.find((p) => p.id === selectedPlaylistId) || null;
  }, [userStore.playlists, selectedPlaylistId]);

  const activeOfficialPlaylist = useMemo(() => {
    if (!selectedOfficialPlaylistSlug) return null;
    return officialPlaylists.find((p) => p.slug === selectedOfficialPlaylistSlug) || null;
  }, [selectedOfficialPlaylistSlug, officialPlaylists]);

  const filteredOfficialPlaylists = useMemo(() => {
    if (!query) return officialPlaylists;
    const q = query.toLowerCase();
    return officialPlaylists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.pitch.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [officialPlaylists, query]);

  const filteredActivePlaylistVideos = useMemo(() => {
    if (!activePlaylist) return [];
    if (!query) return activePlaylist.videos;
    const q = query.toLowerCase();
    return activePlaylist.videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.channel.toLowerCase().includes(q) ||
        v.primary_topic.toLowerCase().includes(q)
    );
  }, [activePlaylist, query]);

  return (
    <div className="space-y-6">
      {/* Top Bar: View Mode Switcher + Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#373e47]/70 pb-3">
        {/* Navigation Tabs (100% inline, zero modals!) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#2d333b] border border-[#444c56] text-[#adbac7]'
                : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#539bf5]" />
            <span>All Talks (6,454)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('liked');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'liked'
                ? 'bg-[#2d333b] border border-[#f47067]/40 text-[#adbac7]'
                : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#f47067] fill-current" />
            <span>Liked ({userStore.liked.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('history');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#2d333b] border border-[#539bf5]/40 text-[#adbac7]'
                : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#539bf5]" />
            <span>History ({userStore.history.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('watchLater');
              setSelectedPlaylistId(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'watchLater'
                ? 'bg-[#2d333b] border border-[#c69026]/40 text-[#adbac7]'
                : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#c69026] fill-current" />
            <span>Watch Later ({userStore.watchLater.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('playlists');
              setSelectedPlaylistId(null);
              setSelectedOfficialPlaylistSlug(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'playlists'
                ? 'bg-[#2d333b] border border-[#57ab5a]/40 text-[#adbac7]'
                : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-[#57ab5a]" />
            <span>Playlists ({(officialPlaylists.length || 27) + userStore.playlists.length})</span>
          </button>
        </div>

        {/* Actions Cluster: Play All on YouTube + Curriculum Import/Export */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
          <button
            onClick={handlePlayAllOnYouTube}
            title="Open current talks as a continuous playlist on YouTube"
            className="px-2.5 py-1.5 rounded-lg bg-[#2d333b] hover:bg-[#373e47] border border-[#444c56] text-[#adbac7] hover:text-white transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#f47067]" />
            <span>Play All</span>
          </button>

          <label
            title="Import curriculum backup JSON"
            className="px-2.5 py-1.5 rounded-lg bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#444c56] text-[#adbac7] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#57ab5a]" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <div className="flex items-center rounded-lg bg-[#22272e] border border-[#373e47] p-0.5 text-[#768390]">
            <span className="px-1.5 text-[10px] uppercase font-bold text-[#768390]">Export</span>
            <button
              onClick={handleExportMarkdown}
              title="Export curriculum to Markdown (.md)"
              className="px-2 py-1 rounded text-[11px] hover:text-[#adbac7] hover:bg-[#2d333b] transition-colors cursor-pointer"
            >
              .md
            </button>
            <button
              onClick={handleExportJSON}
              title="Export full store to JSON (.json)"
              className="px-2 py-1 rounded text-[11px] hover:text-[#adbac7] hover:bg-[#2d333b] transition-colors text-[#539bf5] cursor-pointer"
            >
              .json
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area Based on Active Tab */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Search & Area Chips Toolbar */}
          <div className="space-y-3">
            {/* Search Bar + Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#768390]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 6,454 conference talks (e.g. Rich Hickey, Raft, B-Trees, eBPF, Rust)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#22272e] border border-[#373e47] focus:border-[#539bf5] text-sm text-[#adbac7] placeholder:text-[#768390] focus:outline-none font-mono"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-3 text-[#768390] hover:text-[#adbac7] transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'score' | 'mentions' | 'recommenders')}
                  className="py-2.5 px-3 rounded-xl bg-[#22272e] border border-[#373e47] text-xs font-mono text-[#adbac7] focus:outline-none"
                >
                  <option value="score">Sort: Highest HN Score</option>
                  <option value="mentions">Sort: Most HN Mentions</option>
                  <option value="recommenders">Sort: Most Recommenders</option>
                </select>

                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="py-2.5 px-3 rounded-xl bg-[#22272e] border border-[#373e47] text-xs font-mono text-[#adbac7] focus:outline-none"
                >
                  <option value="all">All Difficulty Levels</option>
                  <option value="intro">Introductory</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Area Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono no-scrollbar">
              {TOP_AREAS.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    selectedArea === area.id
                      ? 'bg-[#2d333b] border border-[#444c56] text-[#adbac7] font-semibold shadow-sm'
                      : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between text-xs font-mono text-[#768390] border-b border-[#373e47]/60 pb-3">
            <div className="flex items-center gap-2">
              <span>Displaying <strong>{videos.length}</strong> of <strong>{totalCount}</strong> curated talks</span>
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#539bf5]" />}
            </div>
            <span className="text-[#768390] hidden sm:inline">
              Filtered by organic Hacker News recommendations
            </span>
          </div>

          {/* Video Grid */}
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((video) => (
                <VideoCard key={video.vid} video={video} />
              ))}
            </div>
          ) : !loading ? (
            <div className="p-12 rounded-xl bg-[#0e1117] border border-[#1f2533] text-center space-y-2 font-mono">
              <p className="text-zinc-400 text-sm">No videos found matching your query.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedArea('all');
                }}
                className="text-xs text-red-400 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : null}

          {/* Pagination Load More */}
          {hasMore && (
            <div className="pt-6 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#121620] hover:bg-[#181e2b] text-zinc-200 border border-[#202735] font-mono text-xs font-bold transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    <span>Loading more talks...</span>
                  </>
                ) : (
                  <>
                    <span>Load 24 More Talks ({totalCount - videos.length} remaining)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Liked Talks View */}
      {activeTab === 'liked' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span>You have <strong>{userStore.liked.length}</strong> liked talks saved locally</span>
            {userStore.liked.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter liked talks..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0e1117] border border-[#202735] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>
            )}
          </div>

          {filteredLiked.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLiked.map((video) => (
                <VideoCard key={video.vid} video={video} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#0e1117] border border-[#1f2533] text-center space-y-2 font-mono">
              <Heart className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-zinc-300 font-bold">No liked talks yet</p>
              <p className="text-zinc-500 text-xs">
                Click the heart icon on any talk in the catalog to build your favorites list.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Watch History View */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span>Watch History ({userStore.history.length} talks watched)</span>
            <div className="flex items-center gap-3">
              {userStore.history.length > 0 && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter history..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0e1117] border border-[#202735] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
              {userStore.history.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear entire watch history?')) {
                      clearWatchHistory();
                      setUserStore(loadUserStore());
                    }
                  }}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHistory.map((item) => (
                <div key={item.video.vid} className="flex flex-col space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500">
                    Watched: {new Date(item.watchedAt).toLocaleDateString()} {new Date(item.watchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <VideoCard video={item.video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#0e1117] border border-[#1f2533] text-center space-y-2 font-mono">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-zinc-300 font-bold">Your watch history is clean</p>
              <p className="text-zinc-500 text-xs">
                Any video you open on the watch page is saved here so you never lose track.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Watch Later View */}
      {activeTab === 'watchLater' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span>Watch Later Queue ({userStore.watchLater.length} talks queued)</span>
            {userStore.watchLater.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter watch later..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0e1117] border border-[#202735] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {filteredWatchLater.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWatchLater.map((video) => (
                <VideoCard key={video.vid} video={video} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#0e1117] border border-[#1f2533] text-center space-y-2 font-mono">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-zinc-300 font-bold">No talks in your queue</p>
              <p className="text-zinc-500 text-xs">
                Save talks for weekend study sessions with the bookmark icon.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 100% INLINE PLAYLISTS (Andrej Karpathy HackerTube Ethos - ZERO MODALS!) */}
      {activeTab === 'playlists' && (
        <div className="space-y-6">
          {/* Case 1: Official HackerTube Playlist Detail View */}
          {selectedOfficialPlaylistSlug !== null && activeOfficialPlaylist ? (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Navigation: Breadcrumb + Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedOfficialPlaylistSlug(null)}
                    className="px-3 py-1.5 rounded-lg bg-[#10131a] hover:bg-[#161a24] border border-[#202735] text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Playlists</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span>/</span>
                    <span className="text-zinc-200 font-bold truncate max-w-xs">
                      {activeOfficialPlaylist.title}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <a
                    href={`https://www.youtube.com/watch_videos?video_ids=${activeOfficialPlaylist.videos.map((v) => v.vid).slice(0, 50).join(',')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-red-950 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play All on YouTube ({activeOfficialPlaylist.count})</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const cloned = createPlaylist(
                        activeOfficialPlaylist.title,
                        activeOfficialPlaylist.pitch
                      );
                      activeOfficialPlaylist.videos.forEach((v) => addVideoToPlaylist(cloned.id, v));
                      setUserStore(loadUserStore());
                      alert(`Cloned "${activeOfficialPlaylist.title}" to your custom playlists!`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#10131a] hover:bg-[#161a24] border border-[#202735] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Save to My Tracks</span>
                  </button>
                </div>
              </div>

              {/* Hero Banner with Mosaic Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0e121a] to-[#07090e] border border-[#1e2330] flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-black grid grid-cols-2 gap-0.5 shrink-0 border border-white/5 shadow-lg">
                  {activeOfficialPlaylist.cover.slice(0, 4).map((vid, i) => (
                    <div key={i} className="relative w-full h-full bg-zinc-900 overflow-hidden">
                      <img
                        src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/80 border border-red-500/40 text-red-300 uppercase tracking-wider">
                      Official HackerTube Canon
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 font-semibold">{activeOfficialPlaylist.count} lectures</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{Math.round(activeOfficialPlaylist.minutes / 60)} hours total</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                    {activeOfficialPlaylist.title}
                  </h2>

                  <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                    {activeOfficialPlaylist.pitch}
                  </p>
                </div>
              </div>

              {/* Ordered list of talks with curator's note */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-2">
                  <span className="font-bold uppercase tracking-wider text-zinc-300">
                    Curated Track Curriculum ({activeOfficialPlaylist.videos.length} Lectures)
                  </span>
                  <span className="text-zinc-500 hidden sm:inline">
                    Click any talk to watch on dedicated player
                  </span>
                </div>

                <div className="space-y-3">
                  {activeOfficialPlaylist.videos.map((video, idx) => (
                    <div
                      key={video.vid}
                      className="p-4 rounded-xl bg-[#0c0e14] border border-[#1b202c] hover:border-zinc-700 transition-all flex flex-col md:flex-row gap-4 items-start group"
                    >
                      <div className="w-6 font-mono text-zinc-600 text-sm font-bold shrink-0 pt-1 hidden md:block">
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>

                      <Link
                        href={`/watch/${video.vid}`}
                        className="relative w-full md:w-52 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-white/5"
                      >
                        <img
                          src={video.thumbnail_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent flex items-center justify-center transition-colors">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                            <span className="font-semibold text-zinc-300">{video.channel}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-amber-400 font-bold">★ {video.score.toFixed(1)}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="capitalize text-zinc-500">{video.content_type || 'talk'}</span>
                          </div>

                          <Link
                            href={`/watch/${video.vid}`}
                            className="text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-2 block"
                          >
                            {video.title}
                          </Link>
                        </div>

                        {video.note && (
                          <p className="text-xs text-zinc-300 bg-[#121622] border border-[#202738] p-2.5 rounded-lg leading-relaxed font-sans">
                            <strong className="text-amber-400 font-mono text-[11px] block mb-0.5">
                              Why this talk is in this track:
                            </strong>
                            {video.note}
                          </p>
                        )}

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {video.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedPlaylistId !== null && activePlaylist ? (
            /* Case 2: Custom User Playlist Detail View */
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Navigation: Breadcrumb + Action Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPlaylistId(null)}
                    className="px-3 py-1.5 rounded-lg bg-[#10131a] hover:bg-[#161a24] border border-[#202735] text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Playlists</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span>/</span>
                    <span className="text-zinc-200 font-bold truncate max-w-xs">
                      {activePlaylist.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {activePlaylist.videos.length > 0 && (
                    <button
                      onClick={() => {
                        const vids = activePlaylist.videos.slice(0, 50).map((v) => v.vid).filter(Boolean);
                        if (vids.length > 0) {
                          window.open(
                            `https://www.youtube.com/watch_videos?video_ids=${vids.join(',')}`,
                            '_blank'
                          );
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-red-950 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play All on YouTube ({activePlaylist.videos.length})</span>
                    </button>
                  )}

                  {!activePlaylist.id.startsWith('track-') && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete playlist "${activePlaylist.name}"?`)) {
                          deletePlaylist(activePlaylist.id);
                          setUserStore(loadUserStore());
                          setSelectedPlaylistId(null);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#141012] hover:bg-red-950/80 border border-red-900/40 text-red-400 hover:text-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Playlist</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Playlist Hero Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0e121a] to-[#07090e] border border-[#1e2330] space-y-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      activePlaylist.id.startsWith('track-')
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                        : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                    }`}
                  >
                    {activePlaylist.id.startsWith('track-') ? 'Pre-Seeded Track' : 'Personal Collection'}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400">{activePlaylist.videos.length} curated talks</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                  {activePlaylist.name}
                </h2>

                {activePlaylist.description && (
                  <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
                    {activePlaylist.description}
                  </p>
                )}
              </div>

              {/* Videos in this playlist */}
              {filteredActivePlaylistVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredActivePlaylistVideos.map((video) => (
                    <VideoCard
                      key={video.vid}
                      video={video}
                      onRemove={() => {
                        removeVideoFromPlaylist(activePlaylist.id, video.vid);
                        setUserStore(loadUserStore());
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-xl bg-[#0e1117] border border-[#1f2533] text-center space-y-3 font-mono">
                  <FolderKanban className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-zinc-200 font-bold text-sm">This playlist is currently empty</p>
                  <p className="text-zinc-400 text-xs max-w-md mx-auto leading-relaxed">
                    Browse our catalog of 6,454 conference talks and click the &ldquo;+ Add to Playlist&rdquo; button on any talk card to add it to this track.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('all');
                      setSelectedPlaylistId(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-md shadow-red-950 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Browse All 6,454 Talks</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Case 3: All Playlists Overview Grid */
            <div className="space-y-6">
              {/* Header / Intro Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#181d26] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-emerald-400" />
                    <span>
                      HackerTube Canon & Playlists ({(officialPlaylists.length || 27) + userStore.playlists.length})
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    27 official curated tracks from Hacker News plus your custom study lists. Zero modals, 1-click YouTube export.
                  </p>
                </div>

                {/* Filter Search */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Filter playlists..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0e1117] border border-[#202735] text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Section Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono no-scrollbar">
                <button
                  onClick={() => setPlaylistSection('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    playlistSection === 'all'
                      ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 font-bold'
                      : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
                  }`}
                >
                  All Playlists ({(officialPlaylists.length || 27) + userStore.playlists.length})
                </button>
                <button
                  onClick={() => setPlaylistSection('official')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    playlistSection === 'official'
                      ? 'bg-red-950/70 border border-red-500/50 text-red-200 font-bold'
                      : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
                  }`}
                >
                  Official HackerTube Canon ({officialPlaylists.length || 27})
                </button>
                <button
                  onClick={() => setPlaylistSection('custom')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    playlistSection === 'custom'
                      ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 font-bold'
                      : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
                  }`}
                >
                  My Custom Playlists ({userStore.playlists.length})
                </button>
              </div>

              {/* Grid of Playlists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Official HackerTube Canon Playlists */}
                {(playlistSection === 'all' || playlistSection === 'official') &&
                  filteredOfficialPlaylists.map((pl) => {
                    const durationHours = Math.round(pl.minutes / 60);

                    return (
                      <div
                        key={pl.slug}
                        onClick={() => setSelectedOfficialPlaylistSlug(pl.slug)}
                        className="group relative flex flex-col justify-between rounded-xl bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#444c56] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md overflow-hidden active:scale-[0.99]"
                      >
                        <div>
                          {/* 2x2 Mosaic Thumbnail Cover */}
                          <div className="relative aspect-video w-full bg-[#1c2128] overflow-hidden grid grid-cols-2 gap-0.5">
                            {pl.cover.slice(0, 4).map((vid, idx) => (
                              <div key={idx} className="relative w-full h-full bg-[#1c2128] overflow-hidden">
                                <img
                                  src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ))}

                            {/* Playlist count overlay panel on the right */}
                            <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-[#1c2128]/95 via-[#1c2128]/80 to-transparent flex flex-col items-center justify-center gap-0.5 text-[#adbac7] font-mono z-10">
                              <FolderKanban className="w-5 h-5 text-[#539bf5] mb-0.5" />
                              <span className="text-sm font-bold text-white">{pl.count}</span>
                              <span className="text-[10px] text-[#768390] uppercase tracking-wider">talks</span>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] z-20">
                              <div className="px-3.5 py-1.5 rounded-lg bg-[#2d333b] text-white border border-[#444c56] font-bold font-mono text-xs flex items-center gap-1.5 shadow-md transform group-hover:scale-105 transition-transform">
                                <span>Open Track</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#539bf5]" />
                              </div>
                            </div>
                          </div>

                          {/* Content Body */}
                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1c2128] border border-[#373e47] text-[#adbac7]">
                                Official Canon
                              </span>
                              <span className="text-[10px] font-mono text-[#768390]">
                                {pl.count} talks · {durationHours}h
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-[#adbac7] group-hover:text-white transition-colors line-clamp-1 font-mono">
                              {pl.title}
                            </h3>

                            {pl.pitch && (
                              <p className="text-xs text-[#768390] line-clamp-2 leading-relaxed">
                                {pl.pitch}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Play on YouTube + Open */}
                        <div className="p-4 pt-0">
                          <div className="pt-2.5 border-t border-[#181d26] flex items-center justify-between font-mono text-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const vids = pl.videos ? pl.videos.map((v) => v.vid) : pl.cover;
                                window.open(
                                  `https://www.youtube.com/watch_videos?video_ids=${vids.slice(0, 50).join(',')}`,
                                  '_blank'
                                );
                              }}
                              className="text-red-400 hover:text-red-300 flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
                              title="Play entire playlist continuously on YouTube"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play on YouTube</span>
                            </button>

                            <span className="text-[11px] font-mono text-zinc-500 group-hover:text-red-400 transition-colors">
                              Explore ➔
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* 2. User Custom Playlists */}
                {(playlistSection === 'all' || playlistSection === 'custom') &&
                  filteredPlaylists.map((pl) => {
                    const isPreseeded = pl.id.startsWith('track-');
                    const hasVideos = pl.videos && pl.videos.length > 0;
                    const firstVideo = hasVideos ? pl.videos[0] : null;

                    return (
                      <div
                        key={pl.id}
                        onClick={() => setSelectedPlaylistId(pl.id)}
                        className="group relative flex flex-col justify-between rounded-xl bg-[#0c0e14] hover:bg-[#121620] border border-[#1e2330] hover:border-emerald-500/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-emerald-950/20 overflow-hidden active:scale-[0.99]"
                      >
                        <div>
                          {/* Thumbnail Stack / Preview */}
                          <div className="relative aspect-video w-full bg-[#161a24] overflow-hidden">
                            {firstVideo ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={firstVideo.thumbnail_url}
                                  alt={pl.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />

                                <div className="absolute top-0 right-0 bottom-0 w-28 bg-gradient-to-l from-black/95 via-black/80 to-transparent flex flex-col items-center justify-center gap-0.5 text-white font-mono z-10">
                                  <FolderKanban className="w-5 h-5 text-emerald-400 mb-0.5" />
                                  <span className="text-sm font-bold">{pl.videos.length}</span>
                                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                                    {pl.videos.length === 1 ? 'talk' : 'talks'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#090b10] text-zinc-600 font-mono">
                                <FolderKanban className="w-8 h-8 text-zinc-700" />
                                <span className="text-xs text-zinc-500">Empty Collection</span>
                              </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                              <div className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg transform group-hover:scale-105 transition-transform">
                                <span>Open Playlist</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>

                          {/* Content Body */}
                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isPreseeded
                                    ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                                    : 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                                }`}
                              >
                                {isPreseeded ? 'Pre-Seeded Track' : 'Personal Track'}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                {pl.videos.length} {pl.videos.length === 1 ? 'talk' : 'talks'}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1 font-mono">
                              {pl.name}
                            </h3>

                            {pl.description && (
                              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                {pl.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Play All on YouTube + Delete */}
                        <div className="p-4 pt-0">
                          <div className="pt-2.5 border-t border-[#181d26] flex items-center justify-between font-mono text-xs">
                            {hasVideos ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const vids = pl.videos.slice(0, 50).map((v) => v.vid).filter(Boolean);
                                  if (vids.length > 0) {
                                    window.open(
                                      `https://www.youtube.com/watch_videos?video_ids=${vids.join(',')}`,
                                      '_blank'
                                    );
                                  }
                                }}
                                className="text-red-400 hover:text-red-300 flex items-center gap-1.5 font-bold transition-colors cursor-pointer"
                                title="Play entire playlist continuously on YouTube"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Play on YouTube</span>
                              </button>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">No talks queued</span>
                            )}

                            {!isPreseeded && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (confirm(`Delete playlist "${pl.name}"?`)) {
                                    deletePlaylist(pl.id);
                                    setUserStore(loadUserStore());
                                  }
                                }}
                                className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Delete playlist"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* Inline "Create New Playlist" Card (No modals!) */}
                {(playlistSection === 'all' || playlistSection === 'custom') && (
                  <div className="rounded-xl border border-dashed border-[#222838] hover:border-emerald-500/50 bg-[#090b10]/60 p-5 flex flex-col justify-between transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                        <FolderPlus className="w-4 h-4" />
                        <span>Create New Playlist</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Assemble your own specialized study paths, conference replays, or oncall training collections.
                      </p>

                      <div className="space-y-2 pt-1 font-mono text-xs">
                        <input
                          type="text"
                          value={createTitle}
                          onChange={(e) => setCreateTitle(e.target.value)}
                          placeholder="Playlist title (e.g. Raft Consensus)..."
                          className="w-full px-3 py-2 rounded-lg bg-[#0e1117] border border-[#202735] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 text-xs"
                        />
                        <input
                          type="text"
                          value={createDesc}
                          onChange={(e) => setCreateDesc(e.target.value)}
                          placeholder="Description (optional)..."
                          className="w-full px-3 py-2 rounded-lg bg-[#0e1117] border border-[#202735] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[#181d26]">
                      <button
                        type="button"
                        onClick={() => {
                          if (!createTitle.trim()) return;
                          const newPl = createPlaylist(createTitle, createDesc);
                          setCreateTitle('');
                          setCreateDesc('');
                          setUserStore(loadUserStore());
                          setSelectedPlaylistId(newPl.id);
                        }}
                        disabled={!createTitle.trim()}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-black font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Playlist</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
