'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import { VideoCard } from './VideoCard';
import { VideoTheaterModal } from './VideoTheaterModal';
import { PlaylistManagerModal } from './PlaylistManagerModal';
import { DisasterIncident } from '@/types/incident';
import {
  loadUserStore,
  clearWatchHistory,
  exportUserDataAsJSON,
  exportUserDataAsMarkdown,
  UserStoreState,
  Playlist
} from '@/lib/userStore';
import {
  Search,
  Flame,
  Star,
  Sparkles,
  Filter,
  SlidersHorizontal,
  Loader2,
  ArrowRight,
  Heart,
  Clock,
  Bookmark,
  FolderKanban,
  Download,
  Trash2,
  FileCode,
  FileText
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

export function HackerTubeExplorer({ initialVideos = [], onSelectIncident }: HackerTubeExplorerProps) {
  const [activeTab, setActiveTab] = useState<TabMode>('all');
  const [videos, setVideos] = useState<HackerTubeVideo[]>(initialVideos);
  const [selectedVideo, setSelectedVideo] = useState<HackerTubeVideo | null>(null);
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
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlistTargetVideo, setPlaylistTargetVideo] = useState<HackerTubeVideo | null>(null);

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

  const handleOpenPlaylistForVideo = (video: HackerTubeVideo) => {
    setPlaylistTargetVideo(video);
    setPlaylistModalOpen(true);
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

  return (
    <div className="space-y-6">
      {/* Top Bar: View Mode Switcher + Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#1b202c] pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-red-950/70 border border-red-500/50 text-red-200'
                : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>All Talks (6,454)</span>
          </button>

          <button
            onClick={() => setActiveTab('liked')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'liked'
                ? 'bg-red-950/70 border border-red-500/50 text-red-200'
                : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
            <span>Liked ({userStore.liked.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-blue-950/70 border border-blue-500/50 text-blue-200'
                : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>History ({userStore.history.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watchLater')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'watchLater'
                ? 'bg-amber-950/70 border border-amber-500/50 text-amber-200'
                : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Watch Later ({userStore.watchLater.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('playlists');
              setPlaylistTargetVideo(null);
              setPlaylistModalOpen(true);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'playlists'
                ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />
            <span>Playlists ({userStore.playlists.length})</span>
          </button>
        </div>

        {/* Data Portability / Curriculum Export Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <button
            onClick={handleExportMarkdown}
            title="Export your curriculum to Markdown format"
            className="px-2.5 py-1.5 rounded-lg bg-[#10131a] hover:bg-[#161a24] border border-[#202735] hover:border-zinc-500 text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handleExportJSON}
            title="Export full user store state as JSON"
            className="px-2.5 py-1.5 rounded-lg bg-[#10131a] hover:bg-[#161a24] border border-[#202735] hover:border-zinc-500 text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export .json</span>
          </button>
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
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 6,454 conference talks (e.g. Rich Hickey, Raft, B-Trees, eBPF, Rust)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0e1117] border border-[#202735] focus:border-red-500 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'score' | 'mentions' | 'recommenders')}
                  className="py-2.5 px-3 rounded-xl bg-[#0e1117] border border-[#202735] text-xs font-mono text-zinc-300 focus:outline-none"
                >
                  <option value="score">Sort: Highest HN Score</option>
                  <option value="mentions">Sort: Most HN Mentions</option>
                  <option value="recommenders">Sort: Most Recommenders</option>
                </select>

                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="py-2.5 px-3 rounded-xl bg-[#0e1117] border border-[#202735] text-xs font-mono text-zinc-300 focus:outline-none"
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
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                    selectedArea === area.id
                      ? 'bg-red-950/70 border border-red-500/50 text-red-200 font-bold shadow-sm'
                      : 'bg-[#10131a] border border-[#1e2330] text-zinc-400 hover:text-zinc-200 hover:bg-[#141822]'
                  }`}
                >
                  {area.name}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <div className="flex items-center gap-2">
              <span>Displaying <strong>{videos.length}</strong> of <strong>{totalCount}</strong> curated talks</span>
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />}
            </div>
            <span className="text-zinc-500 hidden sm:inline">
              Filtered by organic Hacker News recommendations
            </span>
          </div>

          {/* Video Grid */}
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((video) => (
                <VideoCard
                  key={video.vid}
                  video={video}
                  onSelect={setSelectedVideo}
                  onOpenPlaylistModal={handleOpenPlaylistForVideo}
                />
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
                className="text-xs text-red-400 hover:underline"
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
                className="px-6 py-2.5 rounded-xl bg-[#121620] hover:bg-[#181e2b] text-zinc-200 border border-[#202735] font-mono text-xs font-bold transition-all flex items-center gap-2 active:scale-[0.98]"
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
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span>You have <strong>{userStore.liked.length}</strong> liked talks saved locally</span>
          </div>

          {filteredLiked.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLiked.map((video) => (
                <VideoCard
                  key={video.vid}
                  video={video}
                  onSelect={setSelectedVideo}
                  onOpenPlaylistModal={handleOpenPlaylistForVideo}
                />
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
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span>Watch History ({userStore.history.length} talks watched)</span>
            {userStore.history.length > 0 && (
              <button
                onClick={() => {
                  clearWatchHistory();
                }}
                className="text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredHistory.map((item) => (
                <div key={item.video.vid} className="flex flex-col space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500">
                    Watched: {new Date(item.watchedAt).toLocaleDateString()} {new Date(item.watchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <VideoCard
                    video={item.video}
                    onSelect={setSelectedVideo}
                    onOpenPlaylistModal={handleOpenPlaylistForVideo}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-[#0e1117] border border-[#1f2533] text-center space-y-2 font-mono">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-zinc-300 font-bold">Your watch history is clean</p>
              <p className="text-zinc-500 text-xs">
                Any video you open in the theater modal is saved here so you never lose track.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Watch Later View */}
      {activeTab === 'watchLater' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span>Watch Later Queue ({userStore.watchLater.length} talks queued)</span>
          </div>

          {filteredWatchLater.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWatchLater.map((video) => (
                <VideoCard
                  key={video.vid}
                  video={video}
                  onSelect={setSelectedVideo}
                  onOpenPlaylistModal={handleOpenPlaylistForVideo}
                />
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

      {/* Theater Modal Player */}
      <VideoTheaterModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onSelectIncident={onSelectIncident}
        onSelectVideo={(v) => setSelectedVideo(v)}
        onOpenPlaylistModal={handleOpenPlaylistForVideo}
      />

      {/* Playlist Manager Modal */}
      <PlaylistManagerModal
        isOpen={playlistModalOpen}
        onClose={() => setPlaylistModalOpen(false)}
        targetVideo={playlistTargetVideo}
        onPlayVideo={(v) => setSelectedVideo(v)}
      />
    </div>
  );
}
