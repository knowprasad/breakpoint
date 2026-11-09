'use client';

import React, { useState, useEffect } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import { VideoCard } from './VideoCard';
import { VideoTheaterModal } from './VideoTheaterModal';
import { DisasterIncident } from '@/types/incident';
import { Search, Flame, Star, Sparkles, Filter, SlidersHorizontal, Loader2, ArrowRight } from 'lucide-react';

interface HackerTubeExplorerProps {
  initialVideos?: HackerTubeVideo[];
  onSelectIncident?: (incident: DisasterIncident) => void;
}

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

  // Fetch videos from API
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
    const timer = setTimeout(() => {
      fetchVideos(true, 0);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, selectedArea, sortBy, level]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchVideos(false, offset + 24);
    }
  };

  return (
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
              onChange={(e) => setSortBy(e.target.value as any)}
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

      {/* Theater Modal Player */}
      <VideoTheaterModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onSelectIncident={onSelectIncident}
      />
    </div>
  );
}
