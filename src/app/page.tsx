'use client';

import React, { useState } from 'react';
import { Ticker } from '@/components/layout/Ticker';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IncidentCard } from '@/components/disasters/IncidentCard';
import { IncidentDetailModal } from '@/components/disasters/IncidentDetailModal';
import { ResourceCard } from '@/components/library/ResourceCard';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { FilterBar } from '@/components/search/FilterBar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { DigestSignup } from '@/components/digest/DigestSignup';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { searchAndFilter, FilterOptions, getRepositoryStats } from '@/lib/db';
import { Flame, BookOpen, Layers, ShieldAlert, ArrowRight, Zap, Sparkles, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
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
    <div className="min-h-screen flex flex-col bg-[#08090b] text-zinc-100 font-sans">
      {/* 1. Production Ticker */}
      <Ticker />

      {/* 2. Primary Navigation */}
      <Navbar
        onOpenSearch={() => setSearchPaletteOpen(true)}
      />

      {/* 3. Hero Section (Strictly constrained per design-taste-frontend: fits in viewport, subtext <= 20 words, max 4 elements) */}
      <section className="relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#181d26] overflow-hidden">
        {/* Subtle geometric ambient backdrop glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Eyebrow (Hero count = 1. Max 1 per 3 sections enforced) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>THE PRODUCTION DISASTER ENCYCLOPEDIA</span>
          </div>

          {/* Headline: Max 2 lines desktop */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl">
            Failure Imagination for <br className="hidden sm:inline" />
            Senior Systems Engineers.
          </h1>

          {/* Subtext: Exactly 19 words (under the strict 20-word limit!) */}
          <p className="text-base sm:text-lg text-zinc-400 font-sans leading-relaxed max-w-2xl">
            Forensic case studies of famous production outages, bidirectionally cross-linked with the canonical computer science literature that prevents them.
          </p>

          {/* CTAs: 1 primary + 1 secondary */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#disasters"
              className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-red-950 active:scale-[0.98] flex items-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Explore Outage Autopsies</span>
            </a>

            <a
              href="#library"
              className="px-5 py-2.5 rounded-lg bg-[#141822] hover:bg-[#1c2230] text-zinc-200 border border-[#272f3d] font-mono text-xs font-semibold transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Browse Timeless Canon</span>
            </a>

            <button
              onClick={() => setSearchPaletteOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-[#0e1117] hover:bg-[#141820] text-zinc-400 border border-[#1f2634] font-mono text-xs transition-colors flex items-center gap-2"
            >
              <span>Quick Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Telemetry Metric Stats Bar (Directly beneath hero, never cluttering hero) */}
      <section className="w-full bg-[#0a0c10] border-b border-[#181d26] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2.5 p-2 rounded bg-[#0d1015] border border-[#1b202a]">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <div>
                <span className="text-zinc-500 block text-[10px]">FORENSIC OUTAGES</span>
                <span className="text-zinc-200 font-bold">{stats.incidentCount} Case Studies</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded bg-[#0d1015] border border-[#1b202a]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <span className="text-zinc-500 block text-[10px]">TIMELESS CURRICULUM</span>
                <span className="text-zinc-200 font-bold">{stats.resourceCount} Books & Talks</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded bg-[#0d1015] border border-[#1b202a]">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <span className="text-zinc-500 block text-[10px]">KNOWLEDGE GRAPH</span>
                <span className="text-zinc-200 font-bold">100% Bidirectional</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded bg-[#0d1015] border border-[#1b202a]">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <div>
                <span className="text-zinc-500 block text-[10px]">AVERAGE LINDY SCORE</span>
                <span className="text-zinc-200 font-bold">{stats.averageLindyScore}.0 Resilience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Main Exploration Surface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Faceted Filter Toolbar */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
          totalMatches={searchResults.totalMatches}
        />

        {/* Pillar 1: Disaster Post-Mortems Section */}
        {searchResults.incidents.length > 0 && (
          <section id="disasters" className="space-y-4 scroll-mt-20">
            <div className="flex items-center justify-between border-b border-[#1b202c] pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Production Disaster Encyclopedia
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/60 text-red-400 border border-red-500/30">
                  {searchResults.incidents.length} Autopsies
                </span>
              </div>

              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Forensically verified post-mortems
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onSelect={setActiveIncident}
                />
              ))}
            </div>
          </section>
        )}

        {/* Pillar 2: Timeless Technical Library Section */}
        {searchResults.resources.length > 0 && (
          <section id="library" className="space-y-4 scroll-mt-20 pt-6">
            <div className="flex items-center justify-between border-b border-[#1b202c] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  The Timeless Technical Library
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  {searchResults.resources.length} Canonical Works
                </span>
              </div>

              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                Lindy-filtered books, papers & talks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.resources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onSelect={setActiveResource}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty Search Fallback */}
        {searchResults.totalMatches === 0 && (
          <div className="p-12 rounded-xl bg-[#0c0e13] border border-[#1f2533] text-center space-y-3 font-mono">
            <Terminal className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-zinc-300">
              No matching records found for "{filters.query}"
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try searching for a mechanism like "cache stampede", "split brain", "redos", or a company like "Shopify" or "GitLab".
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bi-Weekly Email Digest Box */}
        <section className="pt-8">
          <DigestSignup />
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Modals (Incident Detail, Resource Detail, Command Palette) */}
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

      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
        onSelectIncident={setActiveIncident}
        onSelectResource={setActiveResource}
      />
    </div>
  );
}
