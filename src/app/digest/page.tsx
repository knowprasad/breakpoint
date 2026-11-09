'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Ticker } from '@/components/layout/Ticker';
import { Footer } from '@/components/layout/Footer';
import { DigestSignup } from '@/components/digest/DigestSignup';
import { CommandPalette } from '@/components/common/CommandPalette';
import { Mail, Zap, Brain, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';

export default function DigestPage() {
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090b] text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
      <Ticker />
      <Navbar onOpenSearch={() => setSearchPaletteOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 font-mono text-xs font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>THE BI-WEEKLY DIGEST ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Two Dispatches a Week. <br />
            Zero Marketing Fluff.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-mono leading-relaxed">
            Engineered for high-performing systems architects who want pure forensic post-mortems and timeless computer science foundations delivered straight to their inbox.
          </p>
        </div>

        {/* Schedule Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Wednesday Card */}
          <div className="p-6 rounded-2xl bg-[#0d1016] border border-[#222836] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-amber-400">
                <Zap className="w-4 h-4" />
                <span>Wednesday Morning ⚡</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-500/30">
                Systems & Disaster Track
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              The Production Disaster Autopsy
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              A deep forensic autopsy of a real catastrophic production failure. 
              We deconstruct the initial trigger, the deep architectural CS mechanism that allowed it to cascade, and the exact mitigation rule implemented to prevent recurrence.
            </p>

            <ul className="space-y-1.5 text-xs font-mono text-zinc-300 pt-2 border-t border-[#1b202c]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Architectural failure diagram</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Blast radius & timeline breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>PR review defensive checklist</span>
              </li>
            </ul>
          </div>

          {/* Sunday Card */}
          <div className="p-6 rounded-2xl bg-[#0d1016] border border-[#222836] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-emerald-400">
                <Brain className="w-4 h-4" />
                <span>Sunday Morning 🧠</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                Timeless Mindset Track
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              The 3-Minute Architectural Canon
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              A 3-minute distillation of an iconic talk or foundational book chapter from the top 1% of computer science literature. 
              Master the core mental model without needing 60 minutes of video or a 600-page textbook.
            </p>

            <ul className="space-y-1.5 text-xs font-mono text-zinc-300 pt-2 border-t border-[#1b202c]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>The 3-minute mental model thesis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Why senior practitioners re-read it</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
        onSelectIncident={() => {}}
        onSelectResource={() => {}}
      />
    </div>
  );
}
