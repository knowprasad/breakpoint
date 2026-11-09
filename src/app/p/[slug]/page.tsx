import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOfficialPlaylists, getOfficialPlaylistBySlug } from '@/lib/hackertubePlaylists';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { VideoCard } from '@/components/hackertube/VideoCard';
import { ArrowLeft, Play, Clock, Sparkles, FolderPlus, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const playlists = getOfficialPlaylists();
  return playlists.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const playlist = getOfficialPlaylistBySlug(slug);
  if (!playlist) {
    return { title: 'Playlist Not Found - breakpoint' };
  }
  return {
    title: `${playlist.title} (${playlist.count} talks) | HackerTube Canon`,
    description: playlist.pitch,
    openGraph: {
      title: `${playlist.title} - HackerTube Playlist`,
      description: playlist.pitch
    }
  };
}

export default async function PlaylistDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playlist = getOfficialPlaylistBySlug(slug);

  if (!playlist) {
    notFound();
  }

  const hours = Math.floor(playlist.minutes / 60);
  const remainingMins = playlist.minutes % 60;
  const durationText = hours > 0 ? `${hours}h ${remainingMins}m` : `${playlist.minutes}m`;

  const videoIds = playlist.videos.map((v) => v.vid).slice(0, 50).join(',');
  const playAllUrl = `https://www.youtube.com/watch_videos?video_ids=${videoIds}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <Link
            href="/#playlists"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Playlists</span>
          </Link>

          <span className="text-zinc-600 hidden sm:inline">
            HackerTube Canon / Playlists / {playlist.slug}
          </span>
        </div>

        {/* Hero Header: 2x2 Mosaic + Pitch */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0e14] border border-[#1b202c] shadow-2xl flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Mosaic Thumbnail Grid (top 4 covers) */}
          <div className="w-full sm:w-72 md:w-80 shrink-0 aspect-video rounded-xl overflow-hidden bg-black grid grid-cols-2 gap-0.5 border border-[#222838] shadow-lg">
            {playlist.cover.slice(0, 4).map((vid, idx) => (
              <div key={idx} className="relative w-full h-full bg-zinc-900 overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${vid}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Info Column */}
          <div className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300 font-bold uppercase tracking-wider text-[10px]">
                  Official HackerTube Canon
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 font-semibold">{playlist.count} talks</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  <span>{durationText} total</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {playlist.title}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
              {playlist.pitch}
            </p>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
              <a
                href={playAllUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-md shadow-red-950/40"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play All on YouTube ({playlist.count} talks)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Talk Rows List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-[#181d26] pb-3">
            <span className="font-bold uppercase tracking-wider text-zinc-300">
              Curated Track Curriculum ({playlist.videos.length} Lectures)
            </span>
            <span className="text-zinc-500 hidden sm:inline">
              Ordered for optimal conceptual progression
            </span>
          </div>

          <div className="space-y-4">
            {playlist.videos.map((video, idx) => (
              <div
                key={video.vid}
                className="p-4 rounded-xl bg-[#0c0e14] border border-[#1b202c] hover:border-zinc-700 transition-all flex flex-col md:flex-row gap-4 items-start group"
              >
                {/* Index Number */}
                <div className="w-6 font-mono text-zinc-600 text-sm font-bold shrink-0 pt-1 hidden md:block">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>

                {/* 16:9 Thumbnail Frame */}
                <Link
                  href={`/watch/${video.vid}`}
                  className="relative w-full md:w-56 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-white/5"
                >
                  <img
                    src={video.thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent flex items-center justify-center transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </Link>

                {/* Metadata & Curator Note */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                      <span className="font-semibold text-zinc-300">{video.channel}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-amber-400 font-bold">★ {video.score.toFixed(1)}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="capitalize text-zinc-500">{video.content_type || 'talk'}</span>
                    </div>

                    <Link
                      href={`/watch/${video.vid}`}
                      className="text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug line-clamp-2 block"
                    >
                      {video.title}
                    </Link>
                  </div>

                  {/* Curator's Note */}
                  {video.note && (
                    <p className="text-xs text-zinc-300 bg-[#121622] border border-[#202738] p-2.5 rounded-lg leading-relaxed font-sans">
                      <strong className="text-amber-400 font-mono text-[11px] block mb-0.5">
                        Why this talk is in this track:
                      </strong>
                      {video.note}
                    </p>
                  )}

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {video.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
