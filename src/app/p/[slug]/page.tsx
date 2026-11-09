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
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#f47067]/20 selection:text-[#f47067]">
      <Ticker />
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-[#768390]">
          <Link
            href="/#playlists"
            className="inline-flex items-center gap-1.5 hover:text-[#adbac7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Playlists</span>
          </Link>

          <span className="text-[#768390] hidden sm:inline">
            HackerTube Canon / Playlists / {playlist.slug}
          </span>
        </div>

        {/* Hero Header: 2x2 Mosaic + Pitch */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#22272e] border border-[#373e47] shadow-md flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Mosaic Thumbnail Grid (top 4 covers) */}
          <div className="w-full sm:w-72 md:w-80 shrink-0 aspect-video rounded-xl overflow-hidden bg-[#1c2128] grid grid-cols-2 gap-0.5 border border-[#373e47] shadow-sm">
            {playlist.cover.slice(0, 4).map((vid, idx) => (
              <div key={idx} className="relative w-full h-full bg-[#1c2128] overflow-hidden">
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
                <span className="px-2 py-0.5 rounded bg-[#1c2128] border border-[#373e47] text-[#adbac7] font-semibold uppercase tracking-wider text-[10px]">
                  Official HackerTube Canon
                </span>
                <span className="text-[#768390]">•</span>
                <span className="text-[#adbac7] font-semibold">{playlist.count} talks</span>
                <span className="text-[#768390]">•</span>
                <span className="text-[#768390] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#768390]" />
                  <span>{durationText} total</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#adbac7]">
                {playlist.title}
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#768390] leading-relaxed max-w-3xl">
              {playlist.pitch}
            </p>

            {/* Actions Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
              <a
                href={playAllUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d333b] hover:bg-[#373e47] border border-[#444c56] text-[#adbac7] hover:text-white font-semibold transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-current ml-0.5 text-[#f47067]" />
                <span>Play All on YouTube ({playlist.count} talks)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Talk Rows List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#768390] border-b border-[#373e47]/60 pb-3">
            <span className="font-semibold uppercase tracking-wider text-[#adbac7]">
              Curated Track Curriculum ({playlist.videos.length} Lectures)
            </span>
            <span className="text-[#768390] hidden sm:inline">
              Ordered for optimal conceptual progression
            </span>
          </div>

          <div className="space-y-4">
            {playlist.videos.map((video, idx) => (
              <div
                key={video.vid}
                className="p-4 rounded-xl bg-[#22272e] border border-[#373e47] hover:border-[#444c56] transition-all flex flex-col md:flex-row gap-4 items-start group shadow-sm"
              >
                {/* Index Number */}
                <div className="w-6 font-mono text-[#768390] text-sm font-bold shrink-0 pt-1 hidden md:block">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>

                {/* 16:9 Thumbnail Frame */}
                <Link
                  href={`/watch/${video.vid}`}
                  className="relative w-full md:w-56 aspect-video rounded-lg overflow-hidden bg-[#1c2128] shrink-0 border border-[#373e47]"
                >
                  <img
                    src={video.thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent flex items-center justify-center transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#f47067] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                  </div>
                </Link>

                {/* Metadata & Curator Note */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#768390] mb-1">
                      <span className="font-semibold text-[#adbac7]">{video.channel}</span>
                      <span className="text-[#768390]">•</span>
                      <span className="text-[#c69026] font-bold">★ {video.score.toFixed(1)}</span>
                      <span className="text-[#768390]">•</span>
                      <span className="capitalize text-[#768390]">{video.content_type || 'talk'}</span>
                    </div>

                    <Link
                      href={`/watch/${video.vid}`}
                      className="text-base font-bold text-[#adbac7] group-hover:text-white transition-colors leading-snug line-clamp-2 block"
                    >
                      {video.title}
                    </Link>
                  </div>

                  {/* Curator's Note */}
                  {video.note && (
                    <p className="text-xs text-[#adbac7] bg-[#1c2128] border border-[#373e47] p-2.5 rounded-lg leading-relaxed font-sans">
                      <strong className="text-[#c69026] font-mono text-[11px] block mb-0.5">
                        Why this talk is in this track:
                      </strong>
                      {video.note}
                    </p>
                  )}

                  <p className="text-xs text-[#768390] line-clamp-2 leading-relaxed">
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
