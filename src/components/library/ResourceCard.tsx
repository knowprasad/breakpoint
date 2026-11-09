'use client';

import React from 'react';
import { LibraryResource } from '@/types/resource';
import { ResourceTypeBadge, LindyBadge, CategoryPill } from '@/components/common/Badge';
import { getRelatedIncidentsForResource } from '@/lib/db';
import { BookOpen, Flame, Quote, ArrowRight, Sparkles, Star } from 'lucide-react';

interface ResourceCardProps {
  resource: LibraryResource;
  onSelect?: (resource: LibraryResource) => void;
}

export function ResourceCard({ resource, onSelect }: ResourceCardProps) {
  const relatedIncidents = getRelatedIncidentsForResource(resource.id);

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(resource);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0c0e14] hover:bg-[#111520] border border-[#1e2332] hover:border-emerald-500/50 transition-all duration-200 cursor-pointer shadow-md hover:shadow-2xl hover:shadow-emerald-950/20 overflow-hidden active:scale-[0.99]"
    >
      {/* Top Green Accent for High Lindy */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 opacity-80" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <ResourceTypeBadge type={resource.type} />
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              {resource.shelf_life}
            </span>
          </div>
          <LindyBadge score={resource.lindy_score} />
        </div>

        {/* Title & Creator */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug mb-1">
          {resource.title}
        </h3>
        <p className="text-xs font-mono text-zinc-400 mb-3">by <span className="text-zinc-200">{resource.creator}</span></p>

        {/* 3-Minute Mental Model Box */}
        <div className="p-3.5 rounded-xl bg-[#07090c] border border-[#171c26] mb-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>3-Min Mental Model</span>
          </div>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-sans">
            {resource.mental_model_3min}
          </p>
        </div>

        {/* Pull Quote */}
        {resource.pull_quote && (
          <div className="p-2.5 rounded-lg bg-[#07090c] border border-[#171c26] text-xs italic text-zinc-300 leading-relaxed mb-4">
            <p className="line-clamp-2">&ldquo;{resource.pull_quote.text}&rdquo;</p>
            <span className="text-[10px] font-mono text-zinc-500 not-italic block mt-1">
              — {resource.pull_quote.source} ({resource.pull_quote.year})
            </span>
          </div>
        )}
      </div>

      {/* Footer: Topic & Linked Disasters */}
      <div className="pt-3 border-t border-[#181d26] space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <CategoryPill category={resource.primary_topic} />
          <span className="text-zinc-500 group-hover:text-emerald-400 flex items-center gap-1 transition-colors font-bold">
            Read Canon <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Caused Outages Badge */}
        {relatedIncidents.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/30 border border-red-500/30 text-[11px] font-mono text-red-200">
            <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-red-400 font-bold shrink-0">Violated in:</span>
            <span className="text-red-200/90 truncate">
              {relatedIncidents.map((i) => `${i.company} (${i.year})`).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
