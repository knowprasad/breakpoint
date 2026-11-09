'use client';

import React, { useEffect, useState } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import { DisasterIncident } from '@/types/incident';
import { getIncidentById } from '@/lib/db';
import { SeverityBadge } from '@/components/common/Badge';
import {
  X,
  ExternalLink,
  MessageSquare,
  Star,
  Flame,
  ArrowRight,
  Play,
  Heart,
  Bookmark,
  FolderPlus,
  Compass
} from 'lucide-react';
import {
  recordWatchHistory,
  isVideoLiked,
  toggleLikedVideo,
  isVideoInWatchLater,
  toggleWatchLater
} from '@/lib/userStore';
import { AddToPlaylistPopover } from './AddToPlaylistPopover';
import { getClientVideoCatalog } from '@/lib/clientCatalog';

interface VideoTheaterModalProps {
  video: HackerTubeVideo | null;
  onClose: () => void;
  onSelectIncident?: (incident: DisasterIncident) => void;
  onSelectVideo?: (video: HackerTubeVideo) => void;
  onOpenPlaylistModal?: (video: HackerTubeVideo) => void;
}

export function VideoTheaterModal({
  video,
  onClose,
  onSelectIncident,
  onSelectVideo,
  onOpenPlaylistModal
}: VideoTheaterModalProps) {
  const [, setStoreRev] = useState(0);
  const [similarTalks, setSimilarTalks] = useState<HackerTubeVideo[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Sync with user store updates (likes, watch later, playlists)
  useEffect(() => {
    const handleStoreChange = () => setStoreRev((r) => r + 1);
    window.addEventListener('breakpoint-store-changed', handleStoreChange);
    return () => window.removeEventListener('breakpoint-store-changed', handleStoreChange);
  }, []);

  // Auto-record watch history and fetch similar talks
  useEffect(() => {
    if (!video) return;

    recordWatchHistory(video);

    // Fetch similar talks
    let active = true;
    queueMicrotask(() => {
      if (active) setLoadingSimilar(true);
    });

    getClientVideoCatalog()
      .then((catalog) => {
        if (!active) return;
        const matches = catalog
          .filter((v) => v.vid !== video.vid && (v.primary_topic === video.primary_topic || v.tags?.some((t) => video.tags?.includes(t))))
          .slice(0, 6);
        setSimilarTalks(matches.length > 0 ? matches : catalog.slice(0, 6));
      })
      .catch((err) => console.error("Error finding similar talks:", err))
      .finally(() => {
        if (active) setLoadingSimilar(false);
      });

    return () => {
      active = false;
    };
  }, [video]);

  // Handle keyboard shortcuts (L = like, W = watch later, Escape = close)
  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'l' || e.key === 'L') {
        toggleLikedVideo(video);
      } else if (e.key === 'w' || e.key === 'W') {
        toggleWatchLater(video);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video, onClose]);

  if (!video) return null;

  const liked = isVideoLiked(video.vid);
  const savedLater = isVideoInWatchLater(video.vid);

  const handleToggleLike = () => {
    toggleLikedVideo(video);
  };

  const handleToggleWatchLater = () => {
    toggleWatchLater(video);
  };

  const linkedIncidents = (video.related_incident_ids || [])
    .map((id) => getIncidentById(id))
    .filter(Boolean) as DisasterIncident[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal Surface */}
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl bg-[#090b10] border border-[#232938] shadow-2xl text-zinc-200 overflow-hidden z-10 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-3 border-b border-[#1b202c] bg-[#0e1117] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">
              HackerTube Theater
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400 font-semibold truncate max-w-[200px] sm:max-w-none">
              {video.channel}
            </span>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              title={liked ? 'Unlike (L)' : 'Like Talk (L)'}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                liked
                  ? 'bg-red-950/80 border-red-500/60 text-red-400'
                  : 'bg-[#151922] border-[#222938] text-zinc-400 hover:text-red-400 hover:border-red-500/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
            </button>

            {/* Watch Later Button */}
            <button
              onClick={handleToggleWatchLater}
              title={savedLater ? 'Saved in Watch Later (W)' : 'Watch Later (W)'}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
                savedLater
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-400'
                  : 'bg-[#151922] border-[#222938] text-zinc-400 hover:text-amber-400 hover:border-amber-500/40'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedLater ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{savedLater ? 'Saved' : 'Watch Later'}</span>
            </button>

            {/* Add to Playlist */}
            {video && <AddToPlaylistPopover video={video} variant="button" />}

            <button
              onClick={onClose}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Responsive 16:9 YouTube Embed */}
          <div className="relative aspect-video w-full bg-black border-b border-[#1b202c]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.vid}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Details & Community Endorsements */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Meta Row */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>HN Score: {video.score.toFixed(1)}</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {video.hn.mentions} HN Mentions ({video.hn.rec_months} Months)
                </span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 capitalize">
                  {video.primary_topic}
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold uppercase">
                  {video.shelf_life}
                </span>
                <span className="px-2 py-0.5 text-[11px] text-zinc-500 font-mono hidden md:inline ml-auto">
                  Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">L</kbd> Like • <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">W</kbd> Watch Later • <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">ESC</kbd> Close
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {video.title}
              </h1>

              <p className="text-sm text-zinc-400 font-mono">
                Delivered by <strong className="text-zinc-200">{video.channel}</strong>
              </p>
            </div>

            {/* Hacker News Pull Quote */}
            {video.quote && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                    Why Hacker News Loves This Talk
                  </span>
                  <p className="text-sm italic text-zinc-200 leading-relaxed font-serif">
                    &ldquo;{video.quote.text}&rdquo;
                  </p>
                  {video.quote.hn_comment_id && (
                    <a
                      href={`https://news.ycombinator.com/item?id=${video.quote.hn_comment_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/80 hover:text-amber-300 underline underline-offset-4"
                    >
                      <span>Read original HN comment ({video.quote.year})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Summary & Why HN Recommends It */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-[#0e1117] border border-[#1b202c] space-y-1.5">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Talk Summary & Thesis
                </span>
                <p className="text-zinc-300 text-xs sm:text-sm">{video.summary}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0e1117] border border-[#1b202c] space-y-1.5">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  The Community Consensus
                </span>
                <p className="text-zinc-300 text-xs sm:text-sm">{video.why_hn}</p>
              </div>
            </div>

            {/* Content-Based Similar Talks Carousel */}
            {(loadingSimilar || similarTalks.length > 0) && (
              <div className="pt-4 border-t border-[#1b202c] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Similar High-Signal Talks</span>
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Calculated from Topic, Tags & Categories
                  </span>
                </div>

                {loadingSimilar ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="p-3 rounded-xl bg-[#0c0e14] border border-[#1a1f2c] animate-pulse space-y-2">
                        <div className="aspect-video rounded-lg bg-zinc-800" />
                        <div className="h-3 w-2/3 bg-zinc-800 rounded" />
                        <div className="h-4 w-full bg-zinc-800 rounded" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {similarTalks.map((sim) => (
                    <div
                      key={sim.vid}
                      onClick={() => {
                        if (onSelectVideo) {
                          onSelectVideo(sim);
                        }
                      }}
                      className="p-3 rounded-xl bg-[#0c0e14] hover:bg-[#131722] border border-[#1a1f2c] hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60">
                          <img
                            src={sim.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                            <span className="truncate max-w-[140px] font-semibold text-zinc-300">
                              {sim.channel}
                            </span>
                            <span className="text-amber-400 font-bold">★ {sim.score.toFixed(1)}</span>
                          </div>

                          <h5 className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                            {sim.title}
                          </h5>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#161a24] flex items-center justify-between text-[10px] font-mono text-cyan-400">
                        <span>Play Recommended Talk</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Bidirectional Linking: Historical Outages This Talk Mitigates */}
            {linkedIncidents.length > 0 && (
              <div className="pt-4 border-t border-[#1b202c] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-400" />
                    <span>Real Production Disasters Solved by This Concept</span>
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Bidirectional Knowledge Graph
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {linkedIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        if (onSelectIncident) {
                          onClose();
                          onSelectIncident(inc);
                        }
                      }}
                      className="p-3.5 rounded-lg bg-[#0e1117] hover:bg-[#141822] border border-[#1b202c] hover:border-red-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 font-bold">
                            <span>{inc.company_logo || '🔥'}</span>
                            <span>{inc.company}</span>
                            <span className="text-zinc-500 font-normal">({inc.year})</span>
                          </div>
                          <SeverityBadge severity={inc.severity} />
                        </div>
                        <h5 className="text-sm font-bold text-zinc-200 group-hover:text-red-400 transition-colors leading-snug mb-1">
                          {inc.title}
                        </h5>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {inc.trigger}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#181d26] flex items-center justify-between text-[11px] font-mono text-red-400">
                        <span>Examine Forensic Autopsy</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 border-t border-[#1b202c] bg-[#0c0e14] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Watch Directly on YouTube</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
