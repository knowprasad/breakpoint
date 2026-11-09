import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllIncidents, getIncidentById, getRelatedResourcesForIncident } from '@/lib/db';
import { getCuratedTalksForIncident } from '@/data/incidentVideos';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { SeverityBadge, RootCausePill, CategoryPill, ResourceTypeBadge } from '@/components/common/Badge';
import { ExternalLink, MessageSquare, Clock, BookOpen, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, Play, Flame } from 'lucide-react';

export async function generateStaticParams() {
  const incidents = getAllIncidents();
  return incidents.map((inc) => ({ id: inc.id }));
}

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const incident = getIncidentById(id);

  if (!incident) {
    notFound();
  }

  const relatedResources = getRelatedResourcesForIncident(incident.id);
  const relatedVideos = getCuratedTalksForIncident(incident.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/#disasters"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Disaster Encyclopedia</span>
        </Link>

        {/* Header Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0e14] border border-[#232938] space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-3xl" role="img" aria-label={incident.company}>
              {incident.company_logo || '🔥'}
            </span>
            <span className="font-mono text-base font-bold text-zinc-300">
              {incident.company}
            </span>
            <span className="text-zinc-500 font-mono text-sm">({incident.year})</span>
            <SeverityBadge severity={incident.severity} />
            <RootCausePill tag={incident.root_cause_tag} />
            <CategoryPill category={incident.category} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {incident.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400 pt-2 border-t border-[#1a1f2c]">
            <div>
              <span className="text-zinc-500">Service Affected: </span>
              <span className="text-zinc-200 font-medium">{incident.service_affected}</span>
            </div>
            <div>
              <span className="text-zinc-500">Duration: </span>
              <span className="text-zinc-200 font-medium">{incident.duration}</span>
            </div>
          </div>
        </div>

        {/* Blast Radius Box */}
        <div className="p-5 rounded-xl bg-red-950/25 border border-red-500/30 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
              Impact & Production Blast Radius
            </span>
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">{incident.impact}</p>
          </div>
        </div>

        {/* Trigger */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>The Trigger (Immediate Catalyst)</span>
          </h3>
          <div className="p-5 rounded-xl bg-[#0f1218] border border-[#1e2432] text-sm sm:text-base text-zinc-200 leading-relaxed">
            {incident.trigger}
          </div>
        </div>

        {/* CS Mechanism & Architecture Diagram */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>The Hidden Mechanism (The Deep CS Concept)</span>
          </h3>
          <div className="p-5 rounded-xl bg-[#0f1218] border border-[#1e2432] space-y-4">
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
              {incident.mechanism_explanation}
            </p>

            {incident.mechanism_diagram && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                  Failure Flow Topology
                </span>
                <div className="p-4 rounded-lg bg-[#050608] border border-[#1b202c] font-mono text-xs text-red-300 leading-relaxed overflow-x-auto select-all">
                  {incident.mechanism_diagram.map((line, idx) => (
                    <div key={idx} className="whitespace-pre">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Minute-by-Minute Timeline</span>
          </h3>
          <div className="p-6 rounded-xl bg-[#0f1218] border border-[#1e2432]">
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#202735]">
              {incident.timeline.map((entry, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-red-400 ring-4 ring-[#0f1218]" />
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
        </div>

        {/* Mitigation & Defensive Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mitigation Formula & PR Review Checklist</span>
          </h3>
          <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                The Hard Mitigation Rule
              </span>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">{incident.mitigation_rule}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                Defensive Rules for Code Reviews
              </span>
              <div className="space-y-2">
                {incident.checklist_rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bidirectional Linking: HackerTube Talks Explaining Solutions */}
        {relatedVideos.length > 0 && (
          <div className="pt-6 border-t border-[#1a1f28] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <span>HackerTube Talks Explaining Solutions</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                Bidirectional Knowledge Graph
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedVideos.map((vid) => (
                <Link
                  key={vid.vid}
                  href={`/watch/${vid.vid}`}
                  className="p-4 rounded-xl bg-[#0f1218] hover:bg-[#141822] border border-[#1e2432] hover:border-red-500/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60">
                      <img
                        src={vid.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                        <span className="font-semibold text-zinc-300 truncate max-w-[180px]">
                          {vid.channel}
                        </span>
                        <span className="text-amber-400 font-bold">★ {vid.score.toFixed(1)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-200 group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
                        {vid.title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1a1f2a] flex items-center justify-between text-xs font-mono text-red-400">
                    <span>Watch Mitigating Talk</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bidirectional Linking: Canonical Studies to Prevent This */}
        <div className="pt-6 border-t border-[#1a1f28] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Canonical Literature to Prevent This Failure
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Bidirectional Cross-Link
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedResources.map((res) => (
              <Link
                key={res.id}
                href={`/resources/${res.id}`}
                className="p-4 rounded-xl bg-[#0f1218] hover:bg-[#141822] border border-[#1e2432] hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <ResourceTypeBadge type={res.type} />
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Lindy {res.lindy_score}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug mb-1">
                    {res.title}
                  </h4>
                  <span className="text-xs font-mono text-zinc-400 block mb-2">by {res.creator}</span>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {res.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1a1f2a] flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span>Read 3-Min Mental Model</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* External Post-Mortem & HN Links */}
        <div className="p-4 rounded-xl bg-[#0a0c10] border border-[#1a1f2b] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
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

          <Link href="/#disasters" className="text-zinc-500 hover:text-white transition-colors">
            ← Return to all disasters
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
