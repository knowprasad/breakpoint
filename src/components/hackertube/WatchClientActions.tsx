'use client';

import React, { useEffect, useState } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import {
  Heart,
  Bookmark,
  Share2,
  ExternalLink,
  Check
} from 'lucide-react';
import {
  recordWatchHistory,
  isVideoLiked,
  toggleLikedVideo,
  isVideoInWatchLater,
  toggleWatchLater
} from '@/lib/userStore';
import { AddToPlaylistPopover } from './AddToPlaylistPopover';

interface WatchClientActionsProps {
  video: HackerTubeVideo;
}

export function WatchClientActions({ video }: WatchClientActionsProps) {
  const [, setStoreRev] = useState(0);
  const [copied, setCopied] = useState(false);

  // Sync with userStore changes
  useEffect(() => {
    const handleStoreChange = () => setStoreRev((r) => r + 1);
    window.addEventListener('breakpoint-store-changed', handleStoreChange);
    return () => window.removeEventListener('breakpoint-store-changed', handleStoreChange);
  }, []);

  // Auto-record watch history on mount
  useEffect(() => {
    recordWatchHistory(video);
  }, [video]);

  // Keyboard shortcuts (L = like, W = watch later)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'l' || e.key === 'L') {
        toggleLikedVideo(video);
      } else if (e.key === 'w' || e.key === 'W') {
        toggleWatchLater(video);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video]);

  const liked = isVideoLiked(video.vid);
  const savedLater = isVideoInWatchLater(video.vid);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      {/* Like Button */}
      <button
        onClick={() => toggleLikedVideo(video)}
        title="Press 'L' to toggle like"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
          liked
            ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-sm shadow-rose-950/50'
            : 'bg-[#121620] border-[#222838] text-zinc-300 hover:text-white hover:bg-[#181e2b]'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
        <span className="font-semibold">{liked ? 'Liked' : 'Like'}</span>
        <span className="text-[10px] text-zinc-500 hidden sm:inline">(L)</span>
      </button>

      {/* Watch Later Button */}
      <button
        onClick={() => toggleWatchLater(video)}
        title="Press 'W' to toggle watch later"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
          savedLater
            ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-sm shadow-amber-950/50'
            : 'bg-[#121620] border-[#222838] text-zinc-300 hover:text-white hover:bg-[#181e2b]'
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${savedLater ? 'fill-amber-500 text-amber-500' : ''}`} />
        <span className="font-semibold">{savedLater ? 'Saved' : 'Watch Later'}</span>
        <span className="text-[10px] text-zinc-500 hidden sm:inline">(W)</span>
      </button>

      {/* Add to Playlist Popover (Non-blocking inline dropdown) */}
      <AddToPlaylistPopover video={video} variant="button" />

      {/* Share Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121620] border border-[#222838] text-zinc-300 hover:text-white hover:bg-[#181e2b] transition-all cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Share</span>
          </>
        )}
      </button>

      {/* External YouTube Link */}
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121620] border border-[#222838] text-zinc-400 hover:text-white hover:bg-[#181e2b] transition-all ml-auto"
      >
        <span>Watch on YouTube</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
