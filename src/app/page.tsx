'use client';

import React, { useState } from 'react';
import { Ticker } from '@/components/layout/Ticker';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IncidentCard } from '@/components/disasters/IncidentCard';
import { IncidentDetailModal } from '@/components/disasters/IncidentDetailModal';
import { ResourceCard } from '@/components/library/ResourceCard';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { HackerTubeExplorer } from '@/components/hackertube/HackerTubeExplorer';
import { FilterBar } from '@/components/search/FilterBar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { DigestSignup } from '@/components/digest/DigestSignup';
import { FailureMatrix } from '@/components/matrix/FailureMatrix';
import { FailureSimulator } from '@/components/simulator/FailureSimulator';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { HackerTubeVideo } from '@/types/hackertube';
import { VideoTheaterModal } from '@/components/hackertube/VideoTheaterModal';
import { searchAndFilter, FilterOptions, getRepositoryStats } from '@/lib/db';
import { Flame, BookOpen, Layers, ShieldAlert, ArrowRight, Video, Grid, Terminal, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'hackertube' | 'disasters' | 'books' | 'matrix' | 'simulator'>('hackertube');
  const [filters, setFilters] = useState<FilterOptions>({
    query: '',
    pillar: 'all',
    category: 'all',
    rootCause: 'all',
    severity: 'all',
    sortBy: 'relevance'
  });

  const [activeIncident, setActiveIncident] = useState<DisasterIncident | null>(null);
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [activeVideo, setActiveVideo] = useState<HackerTubeVideo | null>(null);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  const stats = getRepositoryStats();
  const searchResults = searchAndFilter(filters);

  const resetFilters = () => {
    setFilters({
      query: '',
      pillar: 'all',
      category: 'all',
      rootCause: 'all',
      severity: 'all',
      sortBy: 'relevance'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-white font-sans">
      {/* 1. Production Ticker */}
      <Ticker />

      {/* 2. Primary Navigation */}
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      {/* 3. Hero Section with Technical Backdrop */}
      <section className="relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#181d26] overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#151922_1px,transparent_1px),linear-gradient(to_bottom,#151922_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-red-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>THE PRODUCTION DISASTER ENCYCLOPEDIA & HACKERTUBE CANON</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl">
            Failure Imagination for <br className="hidden sm:inline" />
            Senior Systems Engineers.
          </h1>

          {/* Subtext (18 words) */}
          <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-2xl">
            Forensic post-mortems of history's most instructive outages, cross-linked with 6,454 canonical talks and foundational books.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
            <div className="px-3 py-1 rounded-lg bg-[#0e1117] border border-[#1e2430] text-red-400 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>15 Forensic Autopsies</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#0e1117] border border-[#1e2430] text-amber-300 font-semibold flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-amber-400" />
              <span>6,454 HackerTube Talks</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#0e1117] border border-[#1e2430] text-emerald-400 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>30 Canonical Books</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#0e1117] border border-[#1e2430] text-blue-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>100% Bidirectional Graph</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tab Navigation Strip */}
      <section className="sticky top-16 z-30 w-full bg-[#08090b]/95 backdrop-blur-md border-b border-[#181d26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-mono no-scrollbar">
            <button
              onClick={() => setActiveTab('hackertube')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                activeTab === 'hackertube'
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/30'
                  : 'text-zinc-400 hover:text-white hover:bg-[#12151d]'
              }`}
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>HackerTube Talks (6,454)</span>
            </button>

            <button
              onClick={() => setActiveTab('disasters')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                activeTab === 'disasters'
                  ? 'bg-red-950/70 text-red-300 border border-red-500/50 shadow-md shadow-red-950/30'
                  : 'text-zinc-400 hover:text-white hover:bg-[#12151d]'
              }`}
            >
              <Flame className="w-4 h-4 text-red-500" />
              <span>Disaster Encyclopedia</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                activeTab === 'books'
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/30'
                  : 'text-zinc-400 hover:text-white hover:bg-[#12151d]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Timeless Books & Papers</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                activeTab === 'matrix'
                  ? 'bg-blue-950/70 text-blue-300 border border-blue-500/50 shadow-md shadow-blue-950/30'
                  : 'text-zinc-400 hover:text-white hover:bg-[#12151d]'
              }`}
            >
              <Grid className="w-4 h-4 text-blue-400" />
              <span>Root-Cause Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold ${
                activeTab === 'simulator'
                  ? 'bg-zinc-800 text-white border border-zinc-600 shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-[#12151d]'
              }`}
            >
              <Terminal className="w-4 h-4 text-red-400" />
              <span>Failure Simulator</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. Main Content Surface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Tab 1: HackerTube Explorer */}
        {activeTab === 'hackertube' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-400" />
                <span>The HackerTube Engineering Canon</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                The top 1% of conference talks repeatedly recommended across 20 years of Hacker News. Watch directly with YouTube embed player and explore linked real-world disasters.
              </p>
            </div>

            <HackerTubeExplorer onSelectIncident={setActiveIncident} />
          </div>
        )}

        {/* Tab 2: Disaster Post-Mortems */}
        {activeTab === 'disasters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>The Production Disaster Encyclopedia</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                  Forensic post-mortems of famous outages: what broke, the deep CS mechanism, and the defensive formula.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-xs font-bold">
                15 Verified Post-Mortems
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onSelect={setActiveIncident}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Timeless Books & Papers */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>The Timeless Technical Library</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                  Foundational textbooks and seminal papers filtered for 10+ year persistence over hype.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                Lindy-Filtered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onSelect={setActiveResource}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Root Cause Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#1b202c] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Grid className="w-5 h-5 text-blue-400" />
                <span>The Root-Cause Concept Matrix</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                Computer science failure mechanisms correlated with real outages, typical blast radiuses, and defensive engineering patterns.
              </p>
            </div>

            <FailureMatrix
              onSelectIncident={setActiveIncident}
              onSelectResource={setActiveResource}
            />
          </div>
        )}

        {/* Tab 5: Failure Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#1b202c] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Terminal className="w-5 h-5 text-red-400" />
                <span>System Design Failure Simulator</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono">
                Test your operational failure imagination against real production alerts.
              </p>
            </div>

            <FailureSimulator onSelectResource={setActiveResource} />
          </div>
        )}

        {/* Bi-Weekly Email Digest Box */}
        <section className="pt-6">
          <DigestSignup />
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Modals */}
      <IncidentDetailModal
        incident={activeIncident}
        onClose={() => setActiveIncident(null)}
        onSelectResource={(res) => {
          setActiveIncident(null);
          setActiveResource(res);
        }}
      />

      <ResourceDetailModal
        resource={activeResource}
        onClose={() => setActiveResource(null)}
        onSelectIncident={(inc) => {
          setActiveResource(null);
          setActiveIncident(inc);
        }}
      />

      <VideoTheaterModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
        onSelectIncident={(inc) => {
          setActiveVideo(null);
          setActiveIncident(inc);
        }}
      />

      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
        onSelectIncident={setActiveIncident}
        onSelectResource={setActiveResource}
        onSelectVideo={setActiveVideo}
      />
    </div>
  );
}
