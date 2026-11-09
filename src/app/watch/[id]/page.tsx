import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVideoByVid, getHackerTubeRepository } from '@/lib/hackertube';
import { getSimilarVideos } from '@/lib/recommendations';
import { getIncidentById } from '@/lib/db';
import { DisasterIncident } from '@/types/incident';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { WatchClientActions } from '@/components/hackertube/WatchClientActions';
import { VideoNotesScratchpad } from '@/components/hackertube/VideoNotesScratchpad';
import { SeverityBadge } from '@/components/common/Badge';
import {
  ArrowLeft,
  Star,
  Flame,
  MessageSquare,
  Compass,
  Play,
  ArrowRight
} from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const videos = getHackerTubeRepository();
  // Prerender the top 60 highest-signal talks
  return videos.slice(0, 60).map((v) => ({ id: v.vid }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoByVid(id);
  if (!video) {
    return { title: 'Talk Not Found - HackerTube' };
  }
  return {
    title: `${video.title} | HackerTube by breakpoint`,
    description: video.summary,
    openGraph: {
      title: `${video.title} | HackerTube`,
      description: video.summary,
      images: [video.thumbnail_url]
    }
  };
}

export default async function WatchPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = getVideoByVid(id);

  if (!video) {
    notFound();
  }

  // Calculate similar talks at sub-millisecond speed using the recommendation engine
  const similarVideos = getSimilarVideos(video.vid, 6);

  // Retrieve linked disaster autopsies
  const linkedIncidents = (video.related_incident_ids || [])
    .map((incId) => getIncidentById(incId))
    .filter(Boolean) as DisasterIncident[];

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Talks</span>
          </Link>

          <span className="text-zinc-600 hidden sm:inline">
            HackerTube Canon / {video.primary_topic || 'Systems'}
          </span>
        </div>

        {/* Video Player Surface */}
        <section className="space-y-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#1e2430] shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.vid}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                {video.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-zinc-400">
                <span className="font-semibold text-zinc-200">{video.channel}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>HN Score: {video.score.toFixed(1)}</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="capitalize">{video.content_type || 'talk'}</span>
                <span className="text-zinc-600">•</span>
                <span className="capitalize text-zinc-400 px-2 py-0.5 rounded bg-[#121620] border border-[#222838]">
                  {video.level}
                </span>
                {video.shelf_life === 'evergreen' && (
                  <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                    Evergreen
                  </span>
                )}
              </div>
            </div>

            {/* Client Interactive Buttons (Like, Watch Later, Playlist, Share) */}
            <WatchClientActions video={video} />
          </div>
        </section>

        {/* Video Intelligence & Metadata Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[#181d26]">
          {/* Left 2 Columns: Summary & HN Commentary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Why Hacker News Loves This Talk */}
            {video.quote && (
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#121622] to-[#0d1017] border border-[#252d40] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Why Hacker News Loves This Talk</span>
                  </span>
                  {video.quote.hn_comment_id && (
                    <a
                      href={`https://news.ycombinator.com/item?id=${video.quote.hn_comment_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
                    >
                      View HN Thread ↗
                    </a>
                  )}
                </div>

                <p className="text-sm italic text-zinc-200 leading-relaxed font-serif">
                  &ldquo;{video.quote.text}&rdquo;
                </p>

                <div className="text-[11px] font-mono text-zinc-500">
                  <span>Mentions on HN: {video.hn.mentions}</span>
                  <span className="mx-2">•</span>
                  <span>Recommended across {video.hn.rec_months} distinct months</span>
                </div>
              </div>
            )}

            {/* Curator Summary */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#0c0e14] border border-[#1b202c] space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Talk Summary & Thesis
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {video.summary}
              </p>
            </div>

            {/* Engineering Notes & Takeaways Scratchpad */}
            <VideoNotesScratchpad video={video} />

            {/* Categories & Tags */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Categorization & Core Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {video.categories.map((c) => (
                  <span
                    key={c.id}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#121620] border border-[#1f2533] text-zinc-300"
                  >
                    {c.area_name} ➔ {c.name}
                  </span>
                ))}
                {video.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bidirectional Linking: Production Outages This Talk Solves */}
            {linkedIncidents.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#181d26]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-400" />
                    <span>Real Production Disasters Mitigated by This Concept</span>
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500">
                    Bidirectional Knowledge Graph
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {linkedIncidents.map((inc) => (
                    <Link
                      key={inc.id}
                      href={`/incidents/${inc.id}`}
                      className="p-3.5 rounded-xl bg-[#0e1117] hover:bg-[#141822] border border-[#1b202c] hover:border-red-500/40 transition-all group flex flex-col justify-between"
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
                        <h4 className="text-sm font-bold text-zinc-200 group-hover:text-red-400 transition-colors leading-snug mb-1">
                          {inc.title}
                        </h4>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {inc.trigger}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-[#181d26] flex items-center justify-between text-[11px] font-mono text-red-400">
                        <span>Examine Forensic Autopsy</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Similar Talks Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Similar High-Signal Talks</span>
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                0.3ms algorithm
              </span>
            </div>

            <div className="space-y-3">
              {similarVideos.map((sim) => (
                <Link
                  key={sim.vid}
                  href={`/watch/${sim.vid}`}
                  className="p-2.5 rounded-xl bg-[#0c0e14] hover:bg-[#131722] border border-[#1a1f2c] hover:border-cyan-500/50 transition-all group flex gap-3"
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                    <img
                      src={sim.thumbnail_url}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                        <span className="truncate max-w-[100px] text-zinc-300">
                          {sim.channel}
                        </span>
                        <span className="text-amber-400 font-bold">★ {sim.score.toFixed(1)}</span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight">
                        {sim.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 mt-1 capitalize">
                      {sim.content_type || 'talk'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
