'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { FailureMatrix } from '@/components/matrix/FailureMatrix';
import { CommandPalette } from '@/components/common/CommandPalette';
import { Grid } from 'lucide-react';

export default function MatrixPage() {
  const router = useRouter();
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#539bf5]/20 selection:text-[#539bf5]">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-[#373e47] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22272e] border border-[#539bf5]/40 text-[#539bf5] font-mono text-xs font-semibold">
            <Grid className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL FAILURE TAXONOMY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#cdd9e5] font-mono">
            The Root-Cause Concept Matrix
          </h1>

          <p className="text-sm sm:text-base text-[#768390] max-w-2xl font-mono leading-relaxed">
            Every disaster in high-scale production is rooted in a fundamental computer science concept. 
            Explore failure mechanisms, blast radiuses, defensive formulas, and their real-world casualties.
          </p>
        </div>

        {/* Matrix Component with Direct Navigation (Zero Modals) */}
        <FailureMatrix
          onSelectIncident={(inc) => router.push(`/incidents/${inc.id}`)}
          onSelectResource={(res) => router.push(`/resources/${res.id}`)}
        />
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
