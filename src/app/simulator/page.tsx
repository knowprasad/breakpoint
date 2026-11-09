'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { FailureSimulator } from '@/components/simulator/FailureSimulator';
import { CommandPalette } from '@/components/common/CommandPalette';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { LibraryResource } from '@/types/resource';
import { Terminal, ShieldCheck, Flame } from 'lucide-react';

export default function SimulatorPage() {
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-[#1b202c] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>INTERACTIVE ON-CALL DRILL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            System Design Failure Simulator
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl font-mono leading-relaxed">
            Test your operational instincts against real-world production crises. 
            Evaluate incoming telemetry, select your diagnosis, and discover whether you avert disaster or trigger a global cascade.
          </p>
        </div>

        {/* Simulator Game */}
        <FailureSimulator onSelectResource={setActiveResource} />
      </main>

      <Footer />

      <ResourceDetailModal
        resource={activeResource}
        onClose={() => setActiveResource(null)}
      />

      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
        onSelectIncident={() => {}}
        onSelectResource={setActiveResource}
      />
    </div>
  );
}
