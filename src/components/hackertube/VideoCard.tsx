'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HackerTubeVideo } from '@/types/hackertube';
import {
  Play,
  Flame,
  MessageSquare,
  Star,
  Heart,
  Bookmark,
  X
} from 'lucide-react';
import {
  isVideoLiked,
  toggleLikedVideo,
  isVideoInWatchLater,
  toggleWatchLater
} from '@/lib/userStore';
import { AddToPlaylistPopover } from './AddToPlaylistPopover';

interface VideoCardProps {
  video: HackerTubeVideo;
  onSelect?: (video: HackerTubeVideo) => void;
  onOpenPlaylistModal?: (video: HackerTubeVideo) => void;
  onRemove?: () => void;
}

export function VideoCard({
  video,
  onSelect,
  onOpenPlaylistModal,
  onRemove
}: VideoCardProps) {
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
    e.preventDefault();
    e.stopPropagation();
    const newStatus = toggleLikedVideo(video);
    setLiked(newStatus);
  };

  const handleToggleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = toggleWatchLater(video);
    setSavedLater(newStatus);
  };

  return (
    <Link
      href={`/watch/${video.vid}`}
      onClick={(e) => {
        if (onSelect) {
          onSelect(video);
        }
      }}
      className="group relative flex flex-col justify-between rounded-xl bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#444c56] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md overflow-hidden active:scale-[0.99]"
    >
      <div>
        {/* 16:9 Thumbnail Box */}
        <div className="relative aspect-video w-full bg-[#1c2128] overflow-hidden">
          <img
            src={imgSrc}
            alt={video.title}
            onError={() => {
              if (imgSrc.includes('/hq2.jpg')) {
                setImgSrc(`https://i.ytimg.com/vi/${video.vid}/hqdefault.jpg`);
              } else {
                setImgSrc(`https://i.ytimg.com/vi/${video.vid}/mqdefault.jpg`);
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#22272e] via-transparent to-transparent opacity-80" />

          {/* Hover Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <div className="w-11 h-11 rounded-full bg-[#f47067] text-white flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          {/* Remove from Playlist Button (if in playlist view) */}
          {onRemove && (
            <div className="absolute top-2 left-2 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove();
                }}
                title="Remove talk from this playlist"
                className="px-2 py-1 rounded-md backdrop-blur-md bg-[#1c2128]/90 hover:bg-[#f47067]/20 border border-[#373e47] hover:border-[#f47067]/60 text-[#adbac7] hover:text-[#f47067] text-[10px] font-mono flex items-center gap-1 transition-all shadow-md cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          )}

          {/* Quick Action Floating Controls (Top Right) */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              title={liked ? 'Unlike' : 'Like Talk'}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                liked
                  ? 'bg-[#f47067]/20 border-[#f47067]/60 text-[#f47067]'
                  : 'bg-[#1c2128]/80 border-[#373e47] text-[#adbac7] hover:text-[#f47067] hover:border-[#f47067]/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            </button>

            {/* Watch Later Button */}
            <button
              onClick={handleToggleWatchLater}
              title={savedLater ? 'Remove from Watch Later' : 'Watch Later'}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
                savedLater
                  ? 'bg-[#c69026]/20 border-[#c69026]/60 text-[#c69026]'
                  : 'bg-[#1c2128]/80 border-[#373e47] text-[#adbac7] hover:text-[#c69026] hover:border-[#c69026]/40'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${savedLater ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Playlist Popover */}
            <AddToPlaylistPopover video={video} variant="icon" />
          </div>

          {/* Channel Badge Overlay (Bottom) */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-[#1c2128]/90 backdrop-blur-md text-[#adbac7] border border-[#373e47] font-semibold truncate max-w-[170px]">
              {video.channel}
            </span>

            <span className="px-2 py-0.5 rounded bg-[#1c2128]/90 backdrop-blur-md text-[#c69026] border border-[#373e47] flex items-center gap-1 font-bold">
              <Star className="w-3 h-3 fill-current text-[#c69026]" />
              <span>{video.score.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          {/* Topic & Level */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-[#1c2128] border border-[#373e47] text-[#768390] capitalize">
              {video.primary_topic || video.content_type}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#1c2128] text-[#768390] capitalize">
              {video.level}
            </span>
            {video.shelf_life === 'evergreen' && (
              <span className="px-1.5 py-0.5 rounded bg-[#57ab5a]/15 border border-[#57ab5a]/40 text-[#57ab5a] font-semibold">
                Evergreen
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-[#adbac7] group-hover:text-white transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-[#768390] line-clamp-2 leading-relaxed">
            {video.summary}
          </p>

          {/* Hacker News Pull Quote */}
          {video.quote && (
            <div className="p-2.5 rounded-lg bg-[#1c2128] border border-[#373e47]/60 text-[11px] italic text-[#768390] line-clamp-2">
              &ldquo;{video.quote.text}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: HN Mentions & Linked Disasters */}
      <div className="p-4 pt-0">
        <div className="pt-2.5 border-t border-[#373e47]/60 flex items-center justify-between text-[11px] font-mono text-[#768390]">
          <div className="flex items-center gap-1 text-[#768390]">
            <MessageSquare className="w-3 h-3 text-[#c69026]" />
            <span>{video.hn.mentions} HN recs ({video.hn.rec_months} mos)</span>
          </div>

          {video.related_incident_ids && video.related_incident_ids.length > 0 && (
            <div className="flex items-center gap-1 text-[#f47067] font-semibold">
              <Flame className="w-3 h-3 text-[#f47067]" />
              <span>Prevents Outages</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
