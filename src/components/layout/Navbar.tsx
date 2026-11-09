'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Search, BookOpen, AlertOctagon, Grid, Cpu, Mail, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenDigest?: () => void;
}

export function Navbar({ onOpenSearch, onOpenDigest }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090b]/90 backdrop-blur-md border-b border-[#1f242d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:border-red-400 transition-colors shadow-sm shadow-red-950">
            <AlertOctagon className="w-4 h-4 text-red-400" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-mono font-bold text-base tracking-tight text-zinc-100 group-hover:text-red-400 transition-colors">
              <span>breakpoint</span>
              <span className="w-1.5 h-3.5 bg-red-500 inline-block animate-pulse" />
            </div>
            <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline tracking-tight">
              production disaster encyclopedia
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
          <Link
            href="/#disasters"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/' ? 'text-zinc-100 hover:bg-zinc-800/60' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
            }`}
          >
            Disasters
          </Link>
          <Link
            href="/#library"
            className="px-3 py-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors"
          >
            Library
          </Link>
          <Link
            href="/matrix"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/matrix' ? 'text-zinc-100 bg-zinc-800/80 border border-zinc-700' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
            }`}
          >
            Matrix
          </Link>
          <Link
            href="/simulator"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/simulator' ? 'text-zinc-100 bg-zinc-800/80 border border-zinc-700' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
            }`}
          >
            Simulator
          </Link>
          <Link
            href="/digest"
            className={`px-3 py-1.5 rounded transition-colors ${
              pathname === '/digest' ? 'text-zinc-100 bg-zinc-800/80 border border-zinc-700' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
            }`}
          >
            Digest
          </Link>
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#11141a] hover:bg-[#181d26] text-zinc-400 hover:text-zinc-200 border border-[#222731] hover:border-[#384252] text-xs font-mono transition-all active:scale-[0.98]"
            title="Search incidents and canonical resources (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Search canon...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-[#1b2028] text-zinc-400 border border-[#2e3745]">
              ⌘K
            </kbd>
          </button>

          {/* Digest Action Button */}
          <Link
            href="/digest"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-medium transition-all active:scale-[0.98] shadow-sm shadow-red-950 whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Get Digest</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
