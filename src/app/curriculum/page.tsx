'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { EngineeringTracks } from '@/components/curriculum/EngineeringTracks';
import { CommandPalette } from '@/components/common/CommandPalette';

export default function CurriculumPage() {
  const router = useRouter();
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#57ab5a]/20 selection:text-[#57ab5a]">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <EngineeringTracks />
      </main>

      <Footer />

      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
        onSelectIncident={(incident) => {
          setSearchPaletteOpen(false);
          router.push(`/incidents/${incident.id}`);
        }}
        onSelectResource={(resource) => {
          setSearchPaletteOpen(false);
          router.push(`/resources/${resource.id}`);
        }}
        onSelectVideo={(video) => {
          setSearchPaletteOpen(false);
          router.push(`/watch/${video.vid}`);
        }}
      />
    </div>
  );
}
