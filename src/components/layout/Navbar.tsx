'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Search, BookOpen, AlertOctagon, Grid, Terminal, Mail, Flame, FolderKanban, Award } from 'lucide-react';
import { KeyboardShortcutsModal } from '@/components/common/KeyboardShortcutsModal';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenDigest?: () => void;
}

export function Navbar({ onOpenSearch, onOpenDigest }: NavbarProps) {
  const pathname = usePathname();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global listener for '?' / 'Shift + /' and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable);

      if (isInput) return;

      // Handle '?' or Shift + '/' to toggle shortcuts modal
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Handle '/' without modifiers to focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        if (onOpenSearch) {
          onOpenSearch();
        } else {
          window.dispatchEvent(new CustomEvent('breakpoint-open-search'));
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      window.dispatchEvent(new CustomEvent('breakpoint-open-search'));
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#1c2128]/95 backdrop-blur-md border-b border-[#373e47]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Brand: breakpoint */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#22272e] border border-[#373e47] text-[#adbac7] flex items-center justify-center transition-all group-hover:border-[#444c56] shadow-sm font-mono font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-[#f47067]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 font-mono font-bold text-base tracking-tight text-[#adbac7] group-hover:text-white transition-colors">
                <span>breakpoint</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#22272e] text-[#768390] font-normal border border-[#373e47]">
                  v1.0
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#768390] hidden sm:inline tracking-tight">
                Production Disaster Encyclopedia & Engineering Canon
              </span>
            </div>
          </Link>

          {/* Global Search Bar - Responsive on all screen sizes */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4 min-w-0">
            <button
              onClick={handleSearchClick}
              className="w-full flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#22272e] hover:bg-[#282e37] text-[#768390] hover:text-[#adbac7] border border-[#373e47] hover:border-[#444c56] text-xs font-mono transition-all cursor-pointer shadow-sm group"
              title="Quick Search (Press / or ⌘K)"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-[#768390] group-hover:text-[#539bf5] transition-colors shrink-0" />
                <span className="truncate sm:hidden text-[11px]">Search 6.4k talks...</span>
                <span className="truncate hidden sm:inline">Search 6,454 talks, outages & books...</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 shrink-0 ml-2">
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#1c2128] text-[#768390] border border-[#373e47]">
                  /
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#1c2128] text-[#768390] border border-[#373e47]">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-mono shrink-0">

            {/* Disaster Autopsies Link */}
            <Link
              href="/#disasters"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#768390] hover:text-[#adbac7] hover:bg-[#22272e] border border-transparent transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-[#f47067]" />
              <span>Disasters</span>
            </Link>

            {/* Library Link */}
            <Link
              href="/#library"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#768390] hover:text-[#adbac7] hover:bg-[#22272e] border border-transparent transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#57ab5a]" />
              <span>Library</span>
            </Link>

            {/* Tracks / Curriculum Link */}
            <Link
              href="/curriculum"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/curriculum'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#444c56]'
                  : 'text-[#768390] hover:text-[#adbac7] hover:bg-[#22272e]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#57ab5a]" />
              <span>Tracks</span>
            </Link>

            {/* Matrix Link */}
            <Link
              href="/matrix"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/matrix'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#444c56]'
                  : 'text-[#768390] hover:text-[#adbac7] hover:bg-[#22272e]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#539bf5]" />
              <span>Matrix</span>
            </Link>

            {/* Simulator Link */}
            <Link
              href="/simulator"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/simulator'
                  ? 'bg-[#2d333b] text-[#adbac7] border border-[#444c56]'
                  : 'text-[#768390] hover:text-[#adbac7] hover:bg-[#22272e]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#f47067]" />
              <span>Simulator</span>
            </Link>

            {/* Keyboard Shortcuts Trigger Button [ ? ] */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              type="button"
              title="Keyboard Shortcuts (? or Shift+/)"
              className="flex items-center gap-0.5 px-2 py-1.5 rounded-lg bg-[#22272e] hover:bg-[#282e37] text-[#768390] hover:text-[#adbac7] border border-[#373e47] hover:border-[#444c56] transition-all text-xs font-mono group shadow-sm active:scale-95"
              aria-label="Keyboard Shortcuts"
            >
              <span className="text-[10px] text-[#768390] font-bold select-none">[</span>
              <kbd className="text-[#adbac7] font-bold group-hover:text-white transition-colors select-none">?</kbd>
              <span className="text-[10px] text-[#768390] font-bold select-none">]</span>
            </button>

            {/* Digest Signup */}
            <Link
              href="/digest"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d333b] hover:bg-[#373e47] text-[#adbac7] hover:text-white border border-[#444c56] font-semibold transition-all shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-[#f47067]" />
              <span className="hidden xs:inline">Digest</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Universal Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </>
  );
}
