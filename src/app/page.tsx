'use client';

import React, { useState, useEffect } from 'react';
import { Ticker } from '@/components/layout/Ticker';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IncidentCard } from '@/components/disasters/IncidentCard';
import { IncidentDetailModal } from '@/components/disasters/IncidentDetailModal';
import { ResourceCard } from '@/components/library/ResourceCard';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { HackerTubeExplorer } from '@/components/hackertube/HackerTubeExplorer';
import { CommandPalette } from '@/components/common/CommandPalette';
import { DigestSignup } from '@/components/digest/DigestSignup';
import { FailureMatrix } from '@/components/matrix/FailureMatrix';
import { FailureSimulator } from '@/components/simulator/FailureSimulator';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { getAllIncidents, getAllResources } from '@/lib/db';
import { Flame, BookOpen, Video, Grid, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hackertube' | 'disasters' | 'books' | 'matrix' | 'simulator'>('hackertube');

  const [activeIncident, setActiveIncident] = useState<DisasterIncident | null>(null);
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  const incidents = getAllIncidents();
  const resources = getAllResources();

  // Sync active tab with URL hash for instant external linking (#disasters, #library, etc.)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'disasters') setActiveTab('disasters');
      else if (hash === 'library' || hash === 'books') setActiveTab('books');
      else if (hash === 'matrix') setActiveTab('matrix');
      else if (hash === 'simulator') setActiveTab('simulator');
      else if (hash === 'hackertube' || hash === 'talks') setActiveTab('hackertube');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchTab = (tab: 'hackertube' | 'disasters' | 'books' | 'matrix' | 'simulator') => {
    setActiveTab(tab);
    const hash = tab === 'books' ? 'library' : tab;
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${hash}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-white font-sans">
      {/* 1. Production Incident Ticker */}
      <Ticker />

      {/* 2. Top Header Navigation (Authentic HackerTube brand & search) */}
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      {/* 3. Sticky Pillar Switcher (Zero Hero Marketing Fluff - Direct into Content) */}
      <section className="sticky top-14 sm:top-16 z-30 w-full bg-[#07080b]/95 backdrop-blur-md border-b border-[#181d26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-mono no-scrollbar">
            <button
              onClick={() => switchTab('hackertube')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'hackertube'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-950/50'
                  : 'bg-[#0f1218] border border-[#1e2430] text-zinc-400 hover:text-white hover:bg-[#151922]'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>HackerTube Talks (6,454)</span>
            </button>

            <button
              onClick={() => switchTab('disasters')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'disasters'
                  ? 'bg-red-950 text-red-200 border border-red-500/50 shadow-sm shadow-red-950/40'
                  : 'bg-[#0f1218] border border-[#1e2430] text-zinc-400 hover:text-white hover:bg-[#151922]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Disaster Autopsies (15)</span>
            </button>

            <button
              onClick={() => switchTab('books')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'books'
                  ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/50 shadow-sm shadow-emerald-950/40'
                  : 'bg-[#0f1218] border border-[#1e2430] text-zinc-400 hover:text-white hover:bg-[#151922]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Timeless Library (18)</span>
            </button>

            <button
              onClick={() => switchTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'matrix'
                  ? 'bg-blue-950 text-blue-200 border border-blue-500/50 shadow-sm shadow-blue-950/40'
                  : 'bg-[#0f1218] border border-[#1e2430] text-zinc-400 hover:text-white hover:bg-[#151922]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-blue-400" />
              <span>Failure Matrix (10)</span>
            </button>

            <button
              onClick={() => switchTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap font-bold ${
                activeTab === 'simulator'
                  ? 'bg-zinc-800 text-white border border-zinc-600'
                  : 'bg-[#0f1218] border border-[#1e2430] text-zinc-400 hover:text-white hover:bg-[#151922]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span>Simulator</span>
            </button>

            <div className="ml-auto hidden md:flex items-center gap-3 text-[11px] text-zinc-500">
              <span>Lindy-curated from 20 years of Hacker News</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Direct Content Surface */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-8">
        {/* Tab 1: HackerTube Explorer (Active by Default) */}
        {activeTab === 'hackertube' && (
          <HackerTubeExplorer onSelectIncident={setActiveIncident} />
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
                  Forensic autopsies of famous outages: trigger ➔ deep CS mechanism ➔ defensive engineering formula.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-xs font-bold">
                15 Verified Autopsies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onSelect={setActiveIncident}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Timeless Library */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>The Timeless Technical Library</span>
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
                  Foundational textbooks and seminal papers filtered for 10+ year persistence over temporary hype.
                </p>
              </div>

              <span className="px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                Lindy-Filtered
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((resource) => (
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
                Computer science failure mechanisms correlated with real outages, typical blast radiuses, and defensive patterns.
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
        <section className="pt-4">
          <DigestSignup />
        </section>
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Modals */}
      <IncidentDetailModal
        incident={activeIncident}
        onClose={() => setActiveIncident(null)}
        onSelectResource={(res) => {
          setActiveIncident(null);
          setActiveResource(res);
        }}
        onSelectVideo={(vid) => {
          setActiveIncident(null);
          router.push(`/watch/${vid.vid}`);
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
        onSelectVideo={(vid) => {
          setSearchPaletteOpen(false);
          router.push(`/watch/${vid.vid}`);
        }}
      />
    </div>
  );
}
