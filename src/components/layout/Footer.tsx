'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, BookOpen, ExternalLink, Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#060709] border-t border-[#1a1e27] text-zinc-400 text-xs font-mono py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm tracking-tight">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>breakpoint</span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-md">
              Most software engineering education only teaches the happy path on localhost. 
              Senior competence is judged by failure imagination: knowing the exact boundary 
              conditions, race conditions, and retry storms that bring down billion-dollar architectures.
            </p>
            <div className="pt-2 flex items-center gap-2 text-zinc-500 text-[11px]">
              <span>Curated from 20 years of post-mortems and Hacker News engineering discourse.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px]">The Platform</h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <Link href="/#disasters" className="hover:text-zinc-200 transition-colors">
                  Disaster Encyclopedia
                </Link>
              </li>
              <li>
                <Link href="/#library" className="hover:text-zinc-200 transition-colors">
                  Timeless Technical Library
                </Link>
              </li>
              <li>
                <Link href="/matrix" className="hover:text-zinc-200 transition-colors">
                  Root-Cause Concept Matrix
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-zinc-200 transition-colors">
                  Failure Simulator (Practice)
                </Link>
              </li>
              <li>
                <Link href="/digest" className="hover:text-zinc-200 transition-colors">
                  Bi-Weekly Email Digest
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Principles */}
          <div className="space-y-2.5">
            <h4 className="text-zinc-200 font-semibold uppercase tracking-wider text-[11px]">Curation Laws</h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>The Lindy Filter: books & talks that survive 10+ years.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <span>Bidirectional Linkage: every disaster maps to a mitigation rule.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">•</span>
                <span>3-Minute Mental Models: actionable insight without fluff.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#161a22] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            breakpoint © 2026 — Dedicated to production engineers who carry the pager.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400">Blameless Post-Mortem Culture</span>
            <span>•</span>
            <span className="hover:text-zinc-400">Lindy Filtered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
