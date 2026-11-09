'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { FailureMatrix } from '@/components/matrix/FailureMatrix';
import { CommandPalette } from '@/components/common/CommandPalette';
import { IncidentDetailModal } from '@/components/disasters/IncidentDetailModal';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { Grid, ShieldAlert, Cpu } from 'lucide-react';

export default function MatrixPage() {
  const [activeIncident, setActiveIncident] = useState<DisasterIncident | null>(null);
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-[#1b202c] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold">
            <Grid className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL FAILURE TAXONOMY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            The Root-Cause Concept Matrix
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-mono leading-relaxed">
            Every disaster in high-scale production is rooted in a fundamental computer science concept. 
            Explore failure mechanisms, blast radiuses, defensive formulas, and their real-world casualties.
          </p>
        </div>

        {/* Matrix Component */}
        <FailureMatrix
          onSelectIncident={setActiveIncident}
          onSelectResource={setActiveResource}
        />
      </main>

      <Footer />

      {/* Modals */}
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
