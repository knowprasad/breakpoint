'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { FailureSimulator } from '@/components/simulator/FailureSimulator';
import { CommandPalette } from '@/components/common/CommandPalette';
import { Terminal } from 'lucide-react';

export default function SimulatorPage() {
  const router = useRouter();
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#f47067]/20 selection:text-[#f47067]">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-[#373e47] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22272e] border border-[#f47067]/40 text-[#f47067] font-mono text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            <span>INTERACTIVE ON-CALL DRILL</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#cdd9e5] font-mono">
            System Design Failure Simulator
          </h1>

          <p className="text-sm sm:text-base text-[#768390] max-w-2xl font-mono leading-relaxed">
            Test your operational instincts against real-world production crises. 
            Evaluate incoming telemetry, select your diagnosis, and discover whether you avert disaster or trigger a global cascade.
          </p>
        </div>

        {/* Simulator Game with Direct Navigation */}
        <FailureSimulator onSelectResource={(res) => router.push(`/resources/${res.id}`)} />
      </main>

      <Footer />

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
