'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Search, BookOpen, AlertOctagon, Grid, Terminal, Mail, Flame, FolderKanban } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenDigest?: () => void;
}

export function Navbar({ onOpenSearch, onOpenDigest }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080b]/95 backdrop-blur-md border-b border-[#1b202c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand: breakpoint */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/50 text-red-400 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-red-400 group-hover:bg-red-900/90 shadow-md shadow-red-950/60 font-mono font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-400/40 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-mono font-bold text-base tracking-tight text-white group-hover:text-red-400 transition-colors">
              <span>breakpoint</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-400 font-normal border border-zinc-700/60">
                v1.0
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline tracking-tight">
              Production Disaster Encyclopedia & Engineering Canon
            </span>
          </div>
        </Link>

        {/* Global Search Bar (Prominent in Navbar, like YouTube/HackerTube) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#0e1117] hover:bg-[#141822] text-zinc-400 hover:text-zinc-200 border border-[#202735] hover:border-zinc-600 text-xs font-mono transition-all"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Search 6,454 talks, outages & books...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#181d26] text-zinc-400 border border-[#273040]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg bg-[#0e1117] border border-[#202735] text-zinc-400 md:hidden hover:text-white"
            title="Search (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Disaster Autopsies Link */}
          <Link
            href="/#disasters"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-[#10131a] border border-transparent hover:border-[#222836] transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Disasters</span>
          </Link>

          {/* Library Link */}
          <Link
            href="/#library"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-[#10131a] border border-transparent hover:border-[#222836] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Library</span>
          </Link>

          {/* Matrix Link */}
          <Link
            href="/matrix"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/matrix'
                ? 'bg-blue-950/70 text-blue-300 border border-blue-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-[#10131a]'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-blue-400" />
            <span>Matrix</span>
          </Link>

          {/* Simulator Link */}
          <Link
            href="/simulator"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/simulator'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-[#10131a]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-red-400" />
            <span>Simulator</span>
          </Link>

          {/* Digest Signup */}
          <Link
            href="/digest"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-sm shadow-red-950"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Digest</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
