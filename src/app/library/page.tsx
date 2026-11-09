'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { LibraryExplorer } from '@/components/library/LibraryExplorer';
import { ResourceDetailModal } from '@/components/library/ResourceDetailModal';
import { CommandPalette } from '@/components/common/CommandPalette';
import { LibraryResource } from '@/types/resource';
import { BookOpen } from 'lucide-react';

export default function LibraryPage() {
  const [activeResource, setActiveResource] = useState<LibraryResource | null>(null);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#57ab5a]/30 selection:text-[#57ab5a]">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-[#373e47]/70 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#57ab5a]/15 border border-[#57ab5a]/40 text-[#57ab5a] font-mono text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>LINDY-FILTERED CANONICAL ARCHIVE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#cdd9e5] font-mono">
            Timeless Engineering Library
          </h1>

          <p className="text-sm sm:text-base text-[#768390] max-w-2xl font-mono leading-relaxed">
            The permanent reading shelf for systems architects. Books, foundational research papers, 
            and course syllabi that will outlive contemporary framework churn.
          </p>
        </div>

        {/* Library Explorer Component */}
        <LibraryExplorer onSelectResource={setActiveResource} />
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
