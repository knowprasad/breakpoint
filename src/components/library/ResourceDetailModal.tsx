'use client';

import React, { useEffect, useState } from 'react';
import { LibraryResource } from '@/types/resource';
import { DisasterIncident } from '@/types/incident';
import { ResourceTypeBadge, LindyBadge, CategoryPill, SeverityBadge } from '@/components/common/Badge';
import { getRelatedIncidentsForResource } from '@/lib/db';
import { X, ExternalLink, Flame, CheckCircle2, Quote, BookOpen, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface ResourceDetailModalProps {
  resource: LibraryResource | null;
  onClose: () => void;
  onSelectIncident?: (incident: DisasterIncident) => void;
}

export function ResourceDetailModal({ resource, onClose, onSelectIncident }: ResourceDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!resource) return null;

  const relatedIncidents = getRelatedIncidentsForResource(resource.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl bg-[#0c0e12] border border-[#272d3a] shadow-2xl text-zinc-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-[#1c212c] bg-[#101319] flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <ResourceTypeBadge type={resource.type} />
              <LindyBadge score={resource.lindy_score} />
              <CategoryPill category={resource.primary_topic} />
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                Level: {resource.level}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                {resource.shelf_life}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              {resource.title}
            </h2>

            <p className="text-sm font-mono text-zinc-400">
              by <span className="text-zinc-200 font-semibold">{resource.creator}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 3-Minute Mental Model Box */}
          <div className="p-5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>The 3-Minute Mental Model</span>
            </div>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
              {resource.mental_model_3min}
            </p>
          </div>

          {/* Why the Community Loves It */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Why Senior Engineers Recommend It
            </h4>
            <div className="p-4 rounded-lg bg-[#11141c] border border-[#202633] text-sm text-zinc-300 leading-relaxed space-y-3">
              <p>{resource.why_recommended}</p>

              {resource.pull_quote && (
                <div className="p-3.5 rounded-xl bg-[#090b0f] border border-[#1b202c] flex items-start gap-2.5 text-xs italic text-zinc-300">
                  <Quote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="mb-1">&ldquo;{resource.pull_quote.text}&rdquo;</p>
                    <span className="text-[11px] font-mono text-zinc-500 not-italic block">
                      — {resource.pull_quote.source} ({resource.pull_quote.year})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actionable Production Code Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Actionable Checklist for Production Code
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {resource.key_takeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#10141d] border border-[#1b202c] text-xs text-zinc-300 flex items-start gap-2 leading-relaxed"
                >
                  <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bidirectional Linking: Famous Disasters Caused by Ignoring This Concept */}
          <div className="pt-4 border-t border-[#1c212c] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                Catastrophes Caused by Violating This Concept
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">
                Bidirectional Knowledge Graph
              </span>
            </div>

            {relatedIncidents.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 italic">
                No mapped catastrophic incidents for this foundational theory yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      if (onSelectIncident) {
                        onClose();
                        onSelectIncident(inc);
                      }
                    }}
                    className="p-3.5 rounded-lg bg-[#11141c] hover:bg-[#161b25] border border-[#1f2533] hover:border-red-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 font-semibold">
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

                    <div className="pt-2 mt-2 border-t border-[#1b202c] flex items-center justify-between text-[11px] font-mono text-red-400">
                      <span>View Forensic Autopsy</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#1c212c] bg-[#101319] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div>
            {resource.url && (
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Original {resource.type.toUpperCase()} Link
              </a>
            )}
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
