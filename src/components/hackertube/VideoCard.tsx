'use client';

import React, { useState, useEffect } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import {
  Play,
  Flame,
  MessageSquare,
  Star,
  Heart,
  Bookmark,
  FolderPlus
} from 'lucide-react';
import {
  isVideoLiked,
  toggleLikedVideo,
  isVideoInWatchLater,
  toggleWatchLater
} from '@/lib/userStore';

interface VideoCardProps {
  video: HackerTubeVideo;
  onSelect: (video: HackerTubeVideo) => void;
  onOpenPlaylistModal?: (video: HackerTubeVideo) => void;
}

export function VideoCard({ video, onSelect, onOpenPlaylistModal }: VideoCardProps) {
  const [imgSrc, setImgSrc] = useState(video.thumbnail_url);
  const [liked, setLiked] = useState(() => isVideoLiked(video.vid));
  const [savedLater, setSavedLater] = useState(() => isVideoInWatchLater(video.vid));

  useEffect(() => {
    const handleStoreChange = () => {
      setLiked(isVideoLiked(video.vid));
      setSavedLater(isVideoInWatchLater(video.vid));
    };

    window.addEventListener('breakpoint-store-changed', handleStoreChange);
    return () => window.removeEventListener('breakpoint-store-changed', handleStoreChange);
  }, [video.vid]);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleLikedVideo(video);
    setLiked(newStatus);
  };

  const handleToggleWatchLater = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = toggleWatchLater(video);
    setSavedLater(newStatus);
  };

  const handleOpenPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenPlaylistModal) {
      onOpenPlaylistModal(video);
    }
  };

  return (
    <div
      onClick={() => onSelect(video)}
      className="group relative flex flex-col justify-between rounded-xl bg-[#0c0e14] hover:bg-[#121620] border border-[#1e2330] hover:border-red-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-red-950/20 overflow-hidden active:scale-[0.99]"
    >
      <div>
        {/* 16:9 Thumbnail Box */}
        <div className="relative aspect-video w-full bg-[#161a24] overflow-hidden">
          <img
            src={imgSrc}
            alt={video.title}
            onError={() => setImgSrc(`https://i.ytimg.com/vi/${video.vid}/mqdefault.jpg`)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-transparent to-transparent opacity-80" />

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950 transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Quick Action Floating Controls (Top Right) */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              title={liked ? 'Unlike' : 'Like Talk'}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                liked
                  ? 'bg-red-950/80 border-red-500/60 text-red-400 hover:bg-red-900/90'
                  : 'bg-black/60 border-white/10 text-zinc-300 hover:text-red-400 hover:border-red-500/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            </button>

            {/* Watch Later Button */}
            <button
              onClick={handleToggleWatchLater}
              title={savedLater ? 'Remove from Watch Later' : 'Watch Later'}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                savedLater
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-400 hover:bg-amber-900/90'
                  : 'bg-black/60 border-white/10 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedLater ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Playlist Button */}
            {onOpenPlaylistModal && (
              <button
                onClick={handleOpenPlaylist}
                title="Add to Playlist"
                className="p-1.5 rounded-lg backdrop-blur-md bg-black/60 border border-white/10 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Channel Badge Overlay (Bottom) */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-zinc-200 border border-white/10 font-semibold truncate max-w-[170px]">
              {video.channel}
            </span>

            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
              <Star className="w-3 h-3 fill-current text-amber-400" />
              <span>{video.score.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          {/* Topic & Level */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 capitalize">
              {video.primary_topic || video.content_type}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#151922] text-zinc-500 capitalize">
              {video.level}
            </span>
            {video.shelf_life === 'evergreen' && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold">
                Evergreen
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {video.summary}
          </p>

          {/* Hacker News Pull Quote */}
          {video.quote && (
            <div className="p-2.5 rounded-lg bg-[#07080b] border border-[#161a24] text-[11px] italic text-zinc-300 line-clamp-2">
              &ldquo;{video.quote.text}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: HN Mentions & Linked Disasters */}
      <div className="p-4 pt-0">
        <div className="pt-2.5 border-t border-[#181d26] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1 text-zinc-400">
            <MessageSquare className="w-3 h-3 text-amber-400" />
            <span>{video.hn.mentions} HN recs ({video.hn.rec_months} mos)</span>
          </div>

          {video.related_incident_ids && video.related_incident_ids.length > 0 && (
            <div className="flex items-center gap-1 text-red-400 font-semibold">
              <Flame className="w-3 h-3 text-red-400" />
              <span>Prevents Outages</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
