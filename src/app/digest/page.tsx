'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { DigestSignup } from '@/components/digest/DigestSignup';
import { CommandPalette } from '@/components/common/CommandPalette';
import { Mail, Zap, Brain, CheckCircle2 } from 'lucide-react';

export default function DigestPage() {
  const router = useRouter();
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#1c2128] text-[#adbac7] font-sans selection:bg-[#f47067]/20 selection:text-[#f47067]">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22272e] border border-[#f47067]/40 text-[#f47067] font-mono text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>THE BI-WEEKLY DIGEST ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#cdd9e5] font-mono">
            Two Dispatches a Week. <br />
            Zero Marketing Fluff.
          </h1>

          <p className="text-sm sm:text-base text-[#768390] font-mono leading-relaxed">
            Engineered for high-performing systems architects and junior engineers who want pure forensic post-mortems and timeless computer science foundations delivered straight to their inbox.
          </p>
        </div>

        {/* Schedule Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Wednesday Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#22272e] border border-[#373e47] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#c69026]">
                <Zap className="w-4 h-4" />
                <span>Wednesday Morning ⚡</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#c69026]/15 text-[#c69026] border border-[#c69026]/30 font-bold">
                Systems & Disaster Track
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#cdd9e5] font-mono">
              The Production Disaster Autopsy
            </h3>

            <p className="text-xs sm:text-sm text-[#768390] leading-relaxed font-sans">
              A deep forensic autopsy of a real catastrophic production failure. 
              We deconstruct the initial trigger, the deep architectural CS mechanism that allowed it to cascade, and the exact mitigation rule implemented to prevent recurrence.
            </p>

            <ul className="space-y-2 text-xs font-mono text-[#adbac7] pt-3 border-t border-[#373e47]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c69026]" />
                <span>Architectural failure diagram</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c69026]" />
                <span>Blast radius & timeline breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c69026]" />
                <span>PR review defensive checklist</span>
              </li>
            </ul>
          </div>

          {/* Sunday Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#22272e] border border-[#373e47] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#57ab5a]">
                <Brain className="w-4 h-4" />
                <span>Sunday Morning 🧠</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#57ab5a]/15 text-[#57ab5a] border border-[#57ab5a]/30 font-bold">
                Timeless Mindset Track
              </span>
            </div>

            <h3 className="text-lg font-bold text-[#cdd9e5] font-mono">
              The 3-Minute Architectural Canon
            </h3>

            <p className="text-xs sm:text-sm text-[#768390] leading-relaxed font-sans">
              A 3-minute distillation of an iconic talk or foundational book chapter from the top 1% of computer science literature. 
              Master the core mental model without needing 60 minutes of video or a 600-page textbook.
            </p>

            <ul className="space-y-2 text-xs font-mono text-[#adbac7] pt-3 border-t border-[#373e47]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#57ab5a]" />
                <span>The 3-minute mental model thesis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#57ab5a]" />
                <span>Why senior practitioners re-read it</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#57ab5a]" />
                <span>Real production disasters linked to it</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Signup Box */}
        <div className="max-w-3xl mx-auto">
          <DigestSignup />
        </div>
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
