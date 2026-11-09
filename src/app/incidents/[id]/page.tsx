import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllIncidents, getIncidentById, getRelatedResourcesForIncident } from '@/lib/db';
import { getCuratedTalksForIncident } from '@/data/incidentVideos';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { SeverityBadge, RootCausePill, CategoryPill, ResourceTypeBadge } from '@/components/common/Badge';
import { CopyPrChecklistButton } from '@/components/disasters/CopyPrChecklistButton';
import {
  ExternalLink,
  MessageSquare,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Flame,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const incidents = getAllIncidents();
  return incidents.map((inc) => ({ id: inc.id }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const incident = getIncidentById(id);
  if (!incident) {
    return { title: 'Incident Not Found - breakpoint' };
  }
  return {
    title: `${incident.title} | Production Post-Mortem`,
    description: incident.impact,
    openGraph: {
      title: `${incident.title} - Forensic Post-Mortem`,
      description: incident.impact
    }
  };
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
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#f47067]/20 selection:text-[#f47067]">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-[#768390]">
          <Link
            href="/#disasters"
            className="inline-flex items-center gap-1.5 hover:text-[#adbac7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Outage Autopsies</span>
          </Link>
          <span className="hidden sm:inline">
            Post-Mortem Library / {incident.company} ({incident.year})
          </span>
        </div>

        {/* Hero Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#22272e] border border-[#373e47] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-3xl select-none" role="img" aria-label={incident.company}>
              {incident.company_logo || '🔥'}
            </span>
            <span className="font-mono text-base font-bold text-[#adbac7]">
              {incident.company}
            </span>
            <span className="text-[#768390] font-mono text-sm">({incident.year})</span>
            <SeverityBadge severity={incident.severity} />
            <RootCausePill tag={incident.root_cause_tag} />
            <CategoryPill category={incident.category} />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#cdd9e5] leading-tight font-mono">
            {incident.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#768390] pt-3 border-t border-[#373e47]">
            <div>
              <span className="text-[#768390]">Service Affected: </span>
              <span className="text-[#adbac7] font-medium">{incident.service_affected}</span>
            </div>
            <div>
              <span className="text-[#768390]">Outage Duration: </span>
              <span className="text-[#adbac7] font-medium">{incident.duration}</span>
            </div>
          </div>
        </div>

        {/* Impact & Blast Radius Box */}
        <div className="p-5 rounded-2xl bg-[#22272e] border border-[#f47067]/30 flex items-start gap-3.5 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-[#f47067] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#f47067] uppercase tracking-wider block">
              Impact & Production Blast Radius
            </span>
            <p className="text-sm text-[#adbac7] leading-relaxed font-sans">{incident.impact}</p>
          </div>
        </div>

        {/* The Trigger */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#768390] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f47067]" />
            <span>The Trigger (Immediate Catalyst)</span>
          </h3>
          <div className="p-5 rounded-2xl bg-[#22272e] border border-[#373e47] text-sm sm:text-base text-[#adbac7] leading-relaxed font-sans shadow-sm">
            {incident.trigger}
          </div>
        </div>

        {/* Junior Engineer Special: Why Localhost & Unit Tests Missed It */}
        {incident.whyLocalhostMissedIt && (
          <div className="p-6 rounded-2xl bg-[#22272e] border border-[#c69026]/40 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#c69026] font-mono text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Junior Engineer Lesson: Why Localhost & Unit Tests Missed This</span>
            </div>
            <p className="text-sm sm:text-base text-[#adbac7] leading-relaxed font-sans">
              {incident.whyLocalhostMissedIt}
            </p>
          </div>
        )}

        {/* CS Mechanism & Architectural Topology */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#768390] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#539bf5]" />
            <span>The Hidden Mechanism (The Deep Computer Science Concept)</span>
          </h3>
          <div className="p-6 rounded-2xl bg-[#22272e] border border-[#373e47] space-y-4 shadow-sm">
            <p className="text-sm sm:text-base text-[#adbac7] leading-relaxed font-sans">
              {incident.mechanism_explanation}
            </p>

            {incident.mechanism_diagram && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono text-[#768390] uppercase tracking-wider block">
                  Failure Flow Topology
                </span>
                <div className="p-4 rounded-xl bg-[#1c2128] border border-[#373e47] font-mono text-xs text-[#adbac7] leading-relaxed overflow-x-auto select-all">
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

        {/* Minute-by-Minute Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#768390] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#768390]" />
            <span>Forensic Timeline</span>
          </h3>
          <div className="p-6 rounded-2xl bg-[#22272e] border border-[#373e47] shadow-sm">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#373e47]">
              {incident.timeline.map((entry, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-[#f47067] ring-4 ring-[#22272e]" />
                  <div className="font-mono text-xs font-bold text-[#f47067] mb-1">
                    {entry.time}
                  </div>
                  <div className="text-xs sm:text-sm text-[#adbac7] leading-relaxed font-sans">
                    {entry.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mitigation & Defensive PR Review Checklist */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-mono font-bold text-[#768390] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#57ab5a]" />
              <span>Mitigation Formula & PR Review Checklist</span>
            </h3>
            <CopyPrChecklistButton incident={incident} variant="full" />
          </div>
          <div className="p-6 rounded-2xl bg-[#22272e] border border-[#57ab5a]/30 space-y-4 shadow-sm">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#57ab5a] uppercase tracking-wider block mb-1">
                The Hard Architectural Invariant
              </span>
              <p className="text-sm sm:text-base text-[#adbac7] leading-relaxed font-sans">
                {incident.mitigation_rule}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#373e47]">
              <span className="text-[11px] font-mono font-bold text-[#768390] uppercase tracking-wider block">
                Defensive Rules for Code & Config Reviews
              </span>
              <div className="space-y-2">
                {incident.checklist_rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#adbac7]">
                    <CheckCircle2 className="w-4 h-4 text-[#57ab5a] shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bidirectional Linking: HackerTube Talks Explaining Solutions */}
        {relatedVideos.length > 0 && (
          <div className="pt-6 border-t border-[#373e47] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-[#f47067] uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#f47067]" />
                <span>Canonical Talks Explaining Solutions</span>
              </h3>
              <span className="text-xs font-mono text-[#768390]">
                Curated Video Deep Dives
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedVideos.map((vid) => (
                <Link
                  key={vid.vid}
                  href={`/watch/${vid.vid}`}
                  className="p-4 rounded-xl bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#f47067]/40 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 border border-[#373e47]">
                      <img
                        src={vid.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-[#f47067] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#768390] mb-1">
                        <span className="font-semibold text-[#adbac7] truncate max-w-[180px]">
                          {vid.channel}
                        </span>
                        <span className="text-[#c69026] font-bold">★ {vid.score.toFixed(1)}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#cdd9e5] group-hover:text-[#f47067] transition-colors leading-snug line-clamp-2">
                        {vid.title}
                      </h4>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#373e47] flex items-center justify-between text-xs font-mono text-[#f47067]">
                    <span>Watch Talk on HackerTube</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bidirectional Linking: Canonical Studies to Prevent This */}
        {relatedResources.length > 0 && (
          <div className="pt-6 border-t border-[#373e47] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-[#cdd9e5] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#57ab5a]" />
                <span>Canonical Literature to Prevent This Failure</span>
              </h3>
              <span className="text-xs font-mono text-[#768390]">
                Textbooks & Papers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedResources.map((res) => (
                <Link
                  key={res.id}
                  href={`/resources/${res.id}`}
                  className="p-4 rounded-xl bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#57ab5a]/40 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <ResourceTypeBadge type={res.type} />
                      <span className="text-xs font-mono font-bold text-[#57ab5a]">
                        Lindy {res.lindy_score}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#cdd9e5] group-hover:text-[#57ab5a] transition-colors leading-snug mb-1">
                      {res.title}
                    </h4>
                    <span className="text-xs font-mono text-[#768390] block mb-2">by {res.creator}</span>
                    <p className="text-xs text-[#768390] line-clamp-3 leading-relaxed font-sans">
                      {res.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#373e47] flex items-center justify-between text-xs font-mono text-[#57ab5a]">
                    <span>Read 3-Min Mental Model</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* External Post-Mortem & HN Links */}
        <div className="p-4 rounded-xl bg-[#22272e] border border-[#373e47] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm">
          <div className="flex items-center gap-3">
            {incident.original_postmortem_url && (
              <a
                href={incident.original_postmortem_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c2128] hover:bg-[#282e37] border border-[#373e47] text-[#adbac7] hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#539bf5]" />
                <span>Original Engineering Post-Mortem</span>
              </a>
            )}
            {incident.hn_discussion_url && (
              <a
                href={incident.hn_discussion_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c69026]/15 hover:bg-[#c69026]/25 text-[#c69026] border border-[#c69026]/30 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Hacker News Discussion</span>
              </a>
            )}
          </div>

          <Link href="/#disasters" className="text-[#768390] hover:text-[#adbac7] transition-colors">
            ← Return to all disasters
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
