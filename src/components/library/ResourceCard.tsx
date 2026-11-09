'use client';

import React from 'react';
import { LibraryResource } from '@/types/resource';
import { ResourceTypeBadge, LindyBadge, CategoryPill } from '@/components/common/Badge';
import { getRelatedIncidentsForResource } from '@/lib/db';
import { BookOpen, Flame, Quote, ArrowRight, Sparkles } from 'lucide-react';

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
      className="group relative flex flex-col justify-between p-5 rounded-lg bg-[#0e1116] hover:bg-[#13171f] border border-[#1f242e] hover:border-emerald-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-emerald-950/20 active:scale-[0.99]"
    >
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
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug mb-1">
          {resource.title}
        </h3>
        <p className="text-xs font-mono text-zinc-400 mb-3">by {resource.creator}</p>

        {/* 3-Minute Mental Model Teaser */}
        <div className="p-3 rounded bg-[#090b0e] border border-[#181d26] mb-3">
          <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            3-Min Mental Model
          </span>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {resource.mental_model_3min}
          </p>
        </div>

        {/* Pull Quote */}
        {resource.pull_quote && (
          <div className="flex items-start gap-2 text-xs italic text-zinc-400 border-l-2 border-emerald-500/40 pl-2.5 mb-4">
            <Quote className="w-3 h-3 text-emerald-500/60 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{resource.pull_quote.text}</p>
          </div>
        )}
      </div>

      {/* Footer: Bidirectional Linking to Production Disasters */}
      <div className="pt-3 border-t border-[#1a1f28] flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <CategoryPill category={resource.primary_topic} />
          <span className="text-zinc-500 group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
            Study Canon <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {relatedIncidents.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-200 bg-red-950/40 px-2.5 py-1.5 rounded border border-red-500/30">
            <Flame className="w-3 h-3 text-red-400 shrink-0" />
            <span className="text-red-300 shrink-0 font-bold">Caused:</span>
            <span className="text-red-100/90 truncate">
              {relatedIncidents.map((i) => `${i.company} (${i.year})`).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
