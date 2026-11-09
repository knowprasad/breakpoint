'use client';

import React, { useEffect, useState } from 'react';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { HackerTubeVideo } from '@/types/hackertube';
import { SeverityBadge, RootCausePill, CategoryPill, ResourceTypeBadge } from '@/components/common/Badge';
import { getRelatedResourcesForIncident } from '@/lib/db';
import { getCuratedTalksForIncident } from '@/data/incidentVideos';
import {
  X,
  ExternalLink,
  MessageSquare,
  Clock,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Flame,
  Star
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: DisasterIncident | null;
  onClose: () => void;
  onSelectResource?: (resource: LibraryResource) => void;
  onSelectVideo?: (video: HackerTubeVideo) => void;
}

export function IncidentDetailModal({
  incident,
  onClose,
  onSelectResource,
  onSelectVideo
}: IncidentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'mechanism' | 'timeline' | 'mitigation'>('mechanism');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!incident) return null;

  const relatedResources = getRelatedResourcesForIncident(incident.id);
  const relatedVideos = getCuratedTalksForIncident(incident.id);

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
              <span className="text-2xl" role="img" aria-label={incident.company}>
                {incident.company_logo || '🔥'}
              </span>
              <span className="font-mono text-sm font-bold text-zinc-300">
                {incident.company}
              </span>
              <span className="text-zinc-500 font-mono text-xs">({incident.year})</span>
              <SeverityBadge severity={incident.severity} />
              <RootCausePill tag={incident.root_cause_tag} />
              <CategoryPill category={incident.category} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
              {incident.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400">
              <div>
                <span className="text-zinc-500">Service: </span>
                <span className="text-zinc-200">{incident.service_affected}</span>
              </div>
              <div>
                <span className="text-zinc-500">Duration: </span>
                <span className="text-zinc-200">{incident.duration}</span>
              </div>
            </div>
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
          {/* Blast Radius Alert Box */}
          <div className="p-4 rounded-lg bg-red-950/30 border border-red-500/30 text-xs sm:text-sm font-mono flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-red-400 uppercase tracking-wider block mb-1">
                Impact & Blast Radius
              </span>
              <p className="text-zinc-300 leading-relaxed font-sans">{incident.impact}</p>
            </div>
          </div>

          {/* The Catalyst / Trigger */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              The Trigger (Immediate Catalyst)
            </h4>
            <div className="p-4 rounded-lg bg-[#11141c] border border-[#202633] text-sm text-zinc-300 leading-relaxed">
              {incident.trigger}
            </div>
          </div>

          {/* Tab Navigation for Deep Dive */}
          <div className="border-b border-[#202633] flex items-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('mechanism')}
              className={`px-4 py-2 font-mono text-xs font-semibold rounded-t-md transition-colors ${
                activeTab === 'mechanism'
                  ? 'bg-[#141822] text-white border-t border-x border-[#272d3a]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. The Deep CS Mechanism
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 font-mono text-xs font-semibold rounded-t-md transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-[#141822] text-white border-t border-x border-[#272d3a]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Minute-by-Minute Timeline
            </button>
            <button
              onClick={() => setActiveTab('mitigation')}
              className={`px-4 py-2 font-mono text-xs font-semibold rounded-t-md transition-colors ${
                activeTab === 'mitigation'
                  ? 'bg-[#141822] text-white border-t border-x border-[#272d3a]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. Defensive Mitigation & PR Rules
            </button>
          </div>

          {/* Tab 1: Mechanism & Architecture Diagram */}
          {activeTab === 'mechanism' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {incident.mechanism_explanation}
              </p>

              {incident.mechanism_diagram && incident.mechanism_diagram.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                    Architectural Failure Flow Diagram
                  </span>
                  <div className="p-4 rounded-lg bg-[#060709] border border-[#1b202c] font-mono text-xs text-red-300/90 leading-relaxed overflow-x-auto select-all">
                    {incident.mechanism_diagram.map((line, idx) => (
                      <div key={idx} className="whitespace-pre">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#202633]">
                {incident.timeline.map((entry, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-red-400 ring-4 ring-[#0c0e12]" />
                    <div className="font-mono text-xs font-bold text-red-400 mb-0.5">
                      {entry.time}
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {entry.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Mitigation & PR Review Checklist */}
          {activeTab === 'mitigation' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-sm">
                <span className="font-mono font-bold text-emerald-400 uppercase tracking-wider text-xs block mb-1">
                  The Production Mitigation Rule
                </span>
                <p className="text-zinc-200 leading-relaxed">{incident.mitigation_rule}</p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                  Checklist for PR Reviews & Architectural Design
                </h5>
                <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                  {incident.checklist_rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded bg-[#10141d] border border-[#1b202c]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Bidirectional Linking 1: HackerTube Canonical Talks Explaining Solutions */}
          {relatedVideos.length > 0 && (
            <div className="pt-4 border-t border-[#1c212c] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  HackerTube Talks Explaining Solutions
                </h4>
                <span className="text-[11px] font-mono text-zinc-500">
                  HackerTube Knowledge Graph
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedVideos.map((vid) => (
                  <div
                    key={vid.vid}
                    onClick={() => {
                      if (onSelectVideo) {
                        onClose();
                        onSelectVideo(vid);
                      }
                    }}
                    className="p-3.5 rounded-lg bg-[#11141c] hover:bg-[#161b25] border border-[#1f2533] hover:border-red-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="relative aspect-video rounded overflow-hidden bg-black/60">
                        <img
                          src={vid.thumbnail_url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                          <span className="font-semibold text-zinc-300 truncate max-w-[150px]">
                            {vid.channel}
                          </span>
                          <span className="text-amber-400 font-bold">★ {vid.score.toFixed(1)}</span>
                        </div>
                        <h5 className="text-xs font-bold text-zinc-200 group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
                          {vid.title}
                        </h5>
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#1b202c] flex items-center justify-between text-[11px] font-mono text-red-400">
                      <span>Watch Mitigating Talk</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bidirectional Linking 2: Canonical Studies to Prevent This */}
          <div className="pt-4 border-t border-[#1c212c] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Canonical Literature to Prevent This Failure
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">
                Bidirectional Knowledge Graph
              </span>
            </div>

            {relatedResources.length === 0 ? (
              <p className="text-xs font-mono text-zinc-500 italic">
                No canonical literature mapped yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedResources.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => {
                      if (onSelectResource) {
                        onClose();
                        onSelectResource(res);
                      }
                    }}
                    className="p-3.5 rounded-lg bg-[#11141c] hover:bg-[#161b25] border border-[#1f2533] hover:border-emerald-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <ResourceTypeBadge type={res.type} />
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                          Lindy {res.lindy_score}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-zinc-200 group-hover:text-emerald-300 transition-colors leading-snug">
                        {res.title}
                      </h5>
                      <span className="text-xs text-zinc-400 block mb-2">by {res.creator}</span>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {res.summary}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#1b202c] flex items-center justify-between text-[11px] font-mono text-emerald-400">
                      <span>Study 3-Min Mental Model</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with External Links */}
        <div className="p-4 sm:p-5 border-t border-[#1c212c] bg-[#101319] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            {incident.original_postmortem_url && (
              <a
                href={incident.original_postmortem_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Original Post-Mortem
              </a>
            )}
            {incident.hn_discussion_url && (
              <a
                href={incident.hn_discussion_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#ff6600]/20 hover:bg-[#ff6600]/30 text-[#ff8c40] border border-[#ff6600]/30 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Hacker News Discussion
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
