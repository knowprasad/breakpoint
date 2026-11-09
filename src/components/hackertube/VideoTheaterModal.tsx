'use client';

import React, { useEffect } from 'react';
import { HackerTubeVideo } from '@/types/hackertube';
import { DisasterIncident } from '@/types/incident';
import { getIncidentById } from '@/lib/db';
import { SeverityBadge } from '@/components/common/Badge';
import { X, ExternalLink, MessageSquare, Star, Flame, Sparkles, ArrowRight, Play, Eye } from 'lucide-react';

interface VideoTheaterModalProps {
  video: HackerTubeVideo | null;
  onClose: () => void;
  onSelectIncident?: (incident: DisasterIncident) => void;
}

export function VideoTheaterModal({ video, onClose, onSelectIncident }: VideoTheaterModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const linkedIncidents = (video.related_incident_ids || [])
    .map((id) => getIncidentById(id))
    .filter(Boolean) as DisasterIncident[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal Surface */}
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-2xl bg-[#090b10] border border-[#232938] shadow-2xl text-zinc-200 overflow-hidden z-10 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#1b202c] bg-[#0e1117] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">
              HackerTube Canonical Talk
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 font-semibold">{video.channel}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
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
                    "{video.quote.text}"
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
