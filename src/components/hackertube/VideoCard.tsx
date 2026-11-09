'use client';

import React, { useState } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import { Play, Flame, Quote, Sparkles, MessageSquare, Star, ArrowUpRight } from 'lucide-react';

interface VideoCardProps {
  video: HackerTubeVideo;
  onSelect: (video: HackerTubeVideo) => void;
}

export function VideoCard({ video, onSelect }: VideoCardProps) {
  const [imgSrc, setImgSrc] = useState(video.thumbnail_url);

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

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950 transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Channel Badge Overlay */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-zinc-200 border border-white/10 font-semibold truncate max-w-[180px]">
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
              "{video.quote.text}"
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
