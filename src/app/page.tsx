'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Ticker } from '@/components/layout/Ticker';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IncidentCard } from '@/components/disasters/IncidentCard';
import { ResourceCard } from '@/components/library/ResourceCard';
import { LibraryExplorer } from '@/components/library/LibraryExplorer';
import { HackerTubeExplorer } from '@/components/hackertube/HackerTubeExplorer';
import { CANONICAL_24_SYSTEMS_TALKS } from '@/data/canonicalTalks24';
import { CommandPalette } from '@/components/common/CommandPalette';
import { DigestSignup } from '@/components/digest/DigestSignup';
import { FailureMatrix } from '@/components/matrix/FailureMatrix';
import { FailureSimulator } from '@/components/simulator/FailureSimulator';
import { EngineeringTracks } from '@/components/curriculum/EngineeringTracks';
import { getAllIncidents, getAllResources } from '@/lib/db';
import { Flame, BookOpen, Video, Grid, Terminal, Search, X, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DISASTER_STACKS = [
  { id: 'all', label: 'All Stacks' },
  { id: 'databases-storage', label: 'Databases & Storage' },
  { id: 'operating-systems-kernel', label: 'Kernel & OS' },
  { id: 'distributed-systems', label: 'Consensus & Raft' },
  { id: 'traffic-loadbalancing', label: 'Traffic & Caching' },
  { id: 'networking-bgp', label: 'BGP & Networking' },
  { id: 'deployment-ci-cd', label: 'CI/CD & Fleet' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hackertube' | 'disasters' | 'books' | 'matrix' | 'simulator' | 'curriculum'>('hackertube');
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  // Faceted Technology Stack & Search Filters for Disaster Encyclopedia
  const [disasterSearch, setDisasterSearch] = useState('');
  const [disasterStack, setDisasterStack] = useState<string>('all');

  const incidents = getAllIncidents();
  const resources = getAllResources();

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesCategory =
        disasterStack === 'all' || incident.category === disasterStack;
      if (!matchesCategory) return false;

      if (!disasterSearch.trim()) return true;
      const q = disasterSearch.toLowerCase();
      return (
        incident.title.toLowerCase().includes(q) ||
        incident.company.toLowerCase().includes(q) ||
        incident.service_affected.toLowerCase().includes(q) ||
        incident.trigger.toLowerCase().includes(q) ||
        incident.mechanism_explanation.toLowerCase().includes(q) ||
        incident.root_cause_tag.toLowerCase().includes(q)
      );
    });
  }, [incidents, disasterStack, disasterSearch]);

  // Sync active tab with URL hash for instant external linking (#disasters, #library, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'disasters') setActiveTab('disasters');
      else if (hash === 'library' || hash === 'books') setActiveTab('books');
      else if (hash === 'matrix') setActiveTab('matrix');
      else if (hash === 'simulator') setActiveTab('simulator');
      else if (hash === 'curriculum' || hash === 'tracks') setActiveTab('curriculum');
      else if (hash === 'hackertube' || hash === 'talks') setActiveTab('hackertube');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchTab = (tab: 'hackertube' | 'disasters' | 'books' | 'matrix' | 'simulator' | 'curriculum') => {
    setActiveTab(tab);
    const hash = tab === 'books' ? 'library' : tab;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${hash}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans">
      {/* 1. Production Incident Ticker */}
      <Ticker />

      {/* 2. Top Header Navigation (Authentic HackerTube brand & search) */}
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      {/* 3. Sticky Pillar Switcher (Zero Hero Marketing Fluff - Direct into Content) */}
      <section className="sticky top-14 sm:top-16 z-30 w-full bg-[#1c2128]/95 backdrop-blur-md border-b border-[#373e47]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-mono no-scrollbar">
            <button
              onClick={() => switchTab('hackertube')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'hackertube'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#444c56] shadow-sm'
                  : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#539bf5]" />
              <span>Conference Canon (6,454)</span>
            </button>

            <button
              onClick={() => switchTab('disasters')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'disasters'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#f47067]/40 shadow-sm'
                  : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#f47067]" />
              <span>Disaster Autopsies (15)</span>
            </button>

            <button
              onClick={() => switchTab('books')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'books'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#57ab5a]/40 shadow-sm'
                  : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#57ab5a]" />
              <span>Timeless Library (31)</span>
            </button>

            <button
              onClick={() => switchTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'matrix'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#539bf5]/40 shadow-sm'
                  : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#539bf5]" />
              <span>Failure Matrix (10)</span>
            </button>

            <button
              onClick={() => switchTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'simulator'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#444c56]'
                  : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#f47067]" />
              <span>Simulator</span>
            </button>

            <button
              onClick={() => switchTab('curriculum')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'curriculum'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#57ab5a]/40 shadow-sm'
                  : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#57ab5a]" />
              <span>Canon Tracks (4)</span>
            </button>

            <div className="ml-auto hidden md:flex items-center gap-3 text-[11px] text-[#768390]">
              <span>Lindy-curated from 20 years of Hacker News</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Direct Content Surface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-8">
        {/* Tab 1: HackerTube Explorer (Active by Default) */}
        {activeTab === 'hackertube' && (
          <HackerTubeExplorer
            initialVideos={CANONICAL_24_SYSTEMS_TALKS}
            onSelectIncident={(inc) => router.push(`/incidents/${inc.id}`)}
          />
        )}

        {/* Tab 2: Disaster Post-Mortems */}
        {activeTab === 'disasters' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#adbac7] tracking-tight flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#f47067]" />
                  <span>The Production Disaster Encyclopedia</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#768390] font-mono mt-1">
                  Forensic autopsies of famous outages: trigger ➔ deep CS mechanism ➔ defensive engineering formula.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-[#22272e] border border-[#373e47] text-[#adbac7] font-mono text-xs font-semibold">
                {filteredIncidents.length} of {incidents.length} Autopsies
              </span>
            </div>

            {/* Faceted Technology Stack Filter + Search */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#768390] pointer-events-none" />
                <input
                  type="text"
                  value={disasterSearch}
                  onChange={(e) => setDisasterSearch(e.target.value)}
                  placeholder="Filter 34 real-world incident autopsies (CrowdStrike, Steam, Discord)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#22272e] border border-[#373e47] focus:border-[#539bf5] text-base sm:text-sm text-[#adbac7] placeholder:text-[#768390] focus:outline-none font-mono shadow-inner transition-colors"
                />
                {disasterSearch ? (
                  <button
                    onClick={() => setDisasterSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-[#768390] hover:text-[#adbac7] hover:bg-[#2d333b] transition-colors cursor-pointer"
                    title="Clear filter"
                    aria-label="Clear filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
                    <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#1c2128] text-[#768390] border border-[#373e47] font-mono">
                      /
                    </kbd>
                  </div>
                )}
              </div>

              {/* Stack Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono no-scrollbar">
                {DISASTER_STACKS.map((stack) => {
                  const count =
                    stack.id === 'all'
                      ? incidents.length
                      : incidents.filter((i) => i.category === stack.id).length;
                  return (
                    <button
                      key={stack.id}
                      onClick={() => setDisasterStack(stack.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        disasterStack === stack.id
                          ? 'bg-[#2d333b] border border-[#444c56] text-[#adbac7] font-semibold shadow-sm'
                          : 'bg-[#22272e] border border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
                      }`}
                    >
                      <span>{stack.label}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1c2128] text-[#768390]">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Incident Cards Grid */}
            {filteredIncidents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredIncidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    onSelect={(inc) => router.push(`/incidents/${inc.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#22272e] border border-[#373e47] space-y-3 font-mono">
                <p className="text-[#768390] text-sm">No disaster autopsies match your current filter.</p>
                <button
                  onClick={() => {
                    setDisasterSearch('');
                    setDisasterStack('all');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#f47067]/15 border border-[#f47067]/40 text-[#f47067] text-xs font-bold hover:bg-[#f47067]/25 transition-colors"
                >
                  Reset Stack Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Timeless Library */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#373e47] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#cdd9e5] tracking-tight flex items-center gap-2 font-mono">
                  <BookOpen className="w-5 h-5 text-[#57ab5a]" />
                  <span>The Timeless Technical Library</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#768390] font-mono mt-1">
                  Foundational textbooks and seminal papers filtered for 10+ year persistence over temporary hype.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-[#22272e] border border-[#57ab5a]/30 text-[#57ab5a] font-mono text-xs font-bold">
                Lindy-Filtered
              </span>
            </div>

            <LibraryExplorer onSelectResource={(res) => router.push(`/resources/${res.id}`)} />
          </div>
        )}

        {/* Tab 4: Root Cause Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#373e47] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#cdd9e5] tracking-tight flex items-center gap-2 font-mono">
                <Grid className="w-5 h-5 text-[#539bf5]" />
                <span>The Root-Cause Concept Matrix</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#768390] font-mono">
                Computer science failure mechanisms correlated with real outages, typical blast radiuses, and defensive patterns.
              </p>
            </div>

            <FailureMatrix
              onSelectIncident={(inc) => router.push(`/incidents/${inc.id}`)}
              onSelectResource={(res) => router.push(`/resources/${res.id}`)}
            />
          </div>
        )}

        {/* Tab 5: Failure Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#373e47] pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#cdd9e5] tracking-tight flex items-center gap-2 font-mono">
                <Terminal className="w-5 h-5 text-[#f47067]" />
                <span>System Design Failure Simulator</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#768390] font-mono">
                Test your operational failure imagination against real production alerts.
              </p>
            </div>

            <FailureSimulator onSelectResource={(res) => router.push(`/resources/${res.id}`)} />
          </div>
        )}

        {/* Tab 6: Guided Engineering Canon Tracks */}
        {activeTab === 'curriculum' && (
          <EngineeringTracks />
        )}

        {/* Bi-Weekly Email Digest Box */}
        <section className="pt-4">
          <DigestSignup />
        </section>
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Universal Command Palette */}
      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
        onSelectIncident={(inc) => {
          setSearchPaletteOpen(false);
          router.push(`/incidents/${inc.id}`);
        }}
        onSelectResource={(res) => {
          setSearchPaletteOpen(false);
          router.push(`/resources/${res.id}`);
        }}
        onSelectVideo={(vid) => {
          setSearchPaletteOpen(false);
          router.push(`/watch/${vid.vid}`);
        }}
      />
    </div>
  );
}
