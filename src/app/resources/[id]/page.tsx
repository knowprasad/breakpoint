import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllResources, getResourceById, getRelatedIncidentsForResource } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { ResourceTypeBadge, LindyBadge, CategoryPill, SeverityBadge } from '@/components/common/Badge';
import { ExternalLink, Sparkles, CheckCircle2, Quote, Flame, ArrowRight, ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const resources = getAllResources();
  return resources.map((res) => ({ id: res.id }));
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResourceById(id);

  if (!resource) {
    notFound();
  }

  const relatedIncidents = getRelatedIncidentsForResource(resource.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/#library"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Timeless Library</span>
        </Link>

        {/* Header Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0e14] border border-[#232938] space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ResourceTypeBadge type={resource.type} />
            <LindyBadge score={resource.lindy_score} />
            <CategoryPill category={resource.primary_topic} />
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
              Level: {resource.level}
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
              {resource.shelf_life}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            {resource.title}
          </h1>

          <p className="text-sm sm:text-base font-mono text-zinc-400">
            by <span className="text-zinc-200 font-semibold">{resource.creator}</span>
          </p>

          <p className="text-sm text-zinc-300 font-sans leading-relaxed pt-2 border-t border-[#1a1f2c]">
            {resource.summary}
          </p>
        </div>

        {/* 3-Minute Mental Model Box */}
        <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>The 3-Minute Mental Model</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
            {resource.mental_model_3min}
          </p>
        </div>

        {/* Why Senior Engineers Recommend It */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Why Senior Engineers Recommend It</span>
          </h3>
          <div className="p-5 rounded-xl bg-[#0f1218] border border-[#1e2432] space-y-4">
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
              {resource.why_recommended}
            </p>

            {resource.pull_quote && (
              <div className="p-4 rounded-lg bg-[#090b0f] border-l-2 border-emerald-400 flex items-start gap-3 text-xs italic text-zinc-300">
                <Quote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm leading-relaxed">"{resource.pull_quote.text}"</p>
                  <span className="text-xs font-mono text-zinc-500 not-italic block">
                    — {resource.pull_quote.source} ({resource.pull_quote.year})
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actionable Production Code Checklist */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Actionable Checklist for Production Systems</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resource.key_takeaways.map((takeaway, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0f1218] border border-[#1e2432] text-xs sm:text-sm text-zinc-300 flex items-start gap-3 leading-relaxed"
              >
                <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bidirectional Linking: Famous Disasters Caused by Ignoring This Concept */}
        <div className="pt-6 border-t border-[#1a1f28] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              Catastrophes Caused by Violating This Concept
            </h3>
            <span className="text-xs font-mono text-zinc-500">
              Bidirectional Cross-Link
            </span>
          </div>

          {relatedIncidents.length === 0 ? (
            <p className="text-xs font-mono text-zinc-500 italic">
              No mapped catastrophic incidents for this foundational theory yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedIncidents.map((inc) => (
                <Link
                  key={inc.id}
                  href={`/incidents/${inc.id}`}
                  className="p-4 rounded-xl bg-[#0f1218] hover:bg-[#141822] border border-[#1e2432] hover:border-red-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 font-bold">
                        <span>{inc.company_logo || '🔥'}</span>
                        <span>{inc.company}</span>
                        <span className="text-zinc-500 font-normal">({inc.year})</span>
                      </div>
                      <SeverityBadge severity={inc.severity} />
                    </div>
                    <h4 className="text-base font-bold text-zinc-100 group-hover:text-red-400 transition-colors leading-snug mb-1">
                      {inc.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {inc.trigger}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#1a1f2a] flex items-center justify-between text-xs font-mono text-red-400">
                    <span>Read Forensic Autopsy</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* External Link */}
        <div className="p-4 rounded-xl bg-[#0a0c10] border border-[#1a1f2b] flex items-center justify-between gap-3 text-xs font-mono">
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Access Original {resource.type.toUpperCase()}</span>
            </a>
          )}

          <Link href="/#library" className="text-zinc-500 hover:text-white transition-colors">
            ← Return to library
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
