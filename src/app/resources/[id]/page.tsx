import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllResources, getResourceById, getRelatedIncidentsForResource } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { ResourceTypeBadge, LindyBadge, CategoryPill, SeverityBadge } from '@/components/common/Badge';
import { ExternalLink, Sparkles, CheckCircle2, Quote, Flame, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const resources = getAllResources();
  return resources.map((res) => ({ id: res.id }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) {
    return { title: 'Resource Not Found - breakpoint' };
  }
  return {
    title: `${resource.title} by ${resource.creator} | Timeless Library`,
    description: resource.summary,
    openGraph: {
      title: `${resource.title} - Architectural Canon`,
      description: resource.summary
    }
  };
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    notFound();
  }

  const relatedIncidents = getRelatedIncidentsForResource(resource.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#57ab5a]/20 selection:text-[#57ab5a]">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between text-xs font-mono text-[#768390]">
          <Link
            href="/#library"
            className="inline-flex items-center gap-1.5 hover:text-[#adbac7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Timeless Library</span>
          </Link>
          <span className="hidden sm:inline">
            Engineering Canon / {resource.primary_topic}
          </span>
        </div>

        {/* Header Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#22272e] border border-[#373e47] shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ResourceTypeBadge type={resource.type} />
            <LindyBadge score={resource.lindy_score} />
            <CategoryPill category={resource.primary_topic} />
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#1c2128] border border-[#373e47] text-[#768390]">
              Level: {resource.level}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-[#1c2128] border border-[#373e47] text-[#768390]">
              {resource.shelf_life}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#cdd9e5] leading-tight font-mono">
            {resource.title}
          </h1>

          <p className="text-sm sm:text-base font-mono text-[#768390]">
            by <span className="text-[#adbac7] font-semibold">{resource.creator}</span>
          </p>

          <p className="text-sm sm:text-base text-[#adbac7] font-sans leading-relaxed pt-3 border-t border-[#373e47]">
            {resource.summary}
          </p>
        </div>

        {/* 3-Minute Mental Model Box */}
        <div className="p-6 rounded-2xl bg-[#22272e] border border-[#57ab5a]/30 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#57ab5a] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>The 3-Minute Mental Model</span>
          </div>
          <p className="text-sm sm:text-base text-[#adbac7] leading-relaxed font-sans">
            {resource.mental_model_3min}
          </p>
        </div>

        {/* Why Senior Engineers Recommend It */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#768390] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#539bf5]" />
            <span>Why Senior Engineers Recommend It</span>
          </h3>
          <div className="p-6 rounded-2xl bg-[#22272e] border border-[#373e47] space-y-4 shadow-sm">
            <p className="text-sm sm:text-base text-[#adbac7] leading-relaxed font-sans">
              {resource.why_recommended}
            </p>

            {resource.pull_quote && (
              <div className="p-4 rounded-xl bg-[#1c2128] border border-[#373e47] flex items-start gap-3 text-xs italic text-[#adbac7]">
                <Quote className="w-4 h-4 text-[#57ab5a] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm leading-relaxed">&ldquo;{resource.pull_quote.text}&rdquo;</p>
                  <span className="text-xs font-mono text-[#768390] not-italic block">
                    — {resource.pull_quote.source} ({resource.pull_quote.year})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actionable Production Code Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-[#768390] uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#57ab5a]" />
            <span>Key Takeaways & Production Invariants</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resource.key_takeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#22272e] border border-[#373e47] text-xs sm:text-sm text-[#adbac7] flex items-start gap-3 leading-relaxed shadow-sm"
              >
                <span className="font-mono text-[#57ab5a] font-bold shrink-0">{idx + 1}.</span>
                <span className="font-sans">{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bidirectional Linking: Famous Disasters Caused by Ignoring This Concept */}
        <div className="pt-6 border-t border-[#373e47] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-[#cdd9e5] uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#f47067]" />
              Catastrophes Caused by Violating This Concept
            </h3>
            <span className="text-xs font-mono text-[#768390]">
              Real-World Case Studies
            </span>
          </div>

          {relatedIncidents.length === 0 ? (
            <p className="text-xs font-mono text-[#768390] italic">
              No mapped catastrophic incidents for this foundational theory yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedIncidents.map((inc) => (
                <Link
                  key={inc.id}
                  href={`/incidents/${inc.id}`}
                  className="p-4 rounded-xl bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#f47067]/40 transition-all flex flex-col justify-between group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#adbac7] font-bold">
                        <span>{inc.company_logo || '🔥'}</span>
                        <span>{inc.company}</span>
                        <span className="text-[#768390] font-normal">({inc.year})</span>
                      </div>
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <h4 className="text-base font-bold text-[#cdd9e5] group-hover:text-[#f47067] transition-colors leading-snug mb-1">
                      {inc.title}
                    </h4>
                    <p className="text-xs text-[#768390] line-clamp-2 leading-relaxed font-sans">
                      {inc.trigger}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#373e47] flex items-center justify-between text-xs font-mono text-[#f47067]">
                    <span>Read Forensic Autopsy</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* External Link */}
        <div className="p-4 rounded-xl bg-[#22272e] border border-[#373e47] flex items-center justify-between gap-3 text-xs font-mono shadow-sm">
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1c2128] hover:bg-[#282e37] text-[#57ab5a] border border-[#57ab5a]/40 font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Access Original {resource.type.toUpperCase()}</span>
            </a>
          )}

          <Link href="/#library" className="text-[#768390] hover:text-[#adbac7] transition-colors">
            ← Return to library
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
