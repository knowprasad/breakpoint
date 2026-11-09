'use client';

import React, { useEffect } from 'react';
import {
  X,
  Keyboard,
  Compass,
  Play,
  Flame,
  Search,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: Array<{ label: string; width?: string } | string>;
  separator?: string;
  action: string;
  description: string;
}

interface ShortcutCategory {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  borderColor: string;
  badge: string;
  items: ShortcutItem[];
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories: ShortcutCategory[] = [
    {
      title: 'Navigation & Search',
      icon: Compass,
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      badge: 'Global',
      items: [
        {
          keys: ['⌘K', 'Ctrl+K'],
          separator: 'or',
          action: 'Universal Command Palette',
          description: 'Instant search across 6,454 talks, disaster autopsies, and canon books'
        },
        {
          keys: ['/'],
          action: 'Focus Search',
          description: 'Instantly jump cursor into global search input from anywhere'
        },
        {
          keys: ['Esc'],
          action: 'Close Modal / Clear Focus',
          description: 'Dismiss any open dialog, clear active search, or reset focus'
        },
        {
          keys: ['?'],
          action: 'Toggle Shortcuts Cheatsheet',
          description: 'Open or close this interactive keyboard shortcuts reference'
        }
      ]
    },
    {
      title: 'Watch & Media',
      icon: Play,
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      badge: 'HackerTube',
      items: [
        {
          keys: ['L'],
          action: 'Like Conference Talk',
          description: 'Bookmark current talk to your personal Upvoted Library'
        },
        {
          keys: ['W'],
          action: 'Toggle Watch Later',
          description: 'Save talk to your curated queue for offline or weekend study'
        },
        {
          keys: ['Space'],
          action: 'Play / Pause Video',
          description: 'Toggle playback on active video player or theater embed'
        }
      ]
    },
    {
      title: 'Disasters & SRE',
      icon: Flame,
      iconColor: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      badge: 'Forensics',
      items: [
        {
          keys: ['P'],
          action: 'Copy PR Review Checklist',
          description: 'Copy Markdown verification rules directly to clipboard for code reviews'
        }
      ]
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0c0e14] border border-[#222838] shadow-2xl text-zinc-200 overflow-hidden z-10 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Top Rainbow Accent Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 shrink-0" />

        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-[#1c2230] bg-[#0e1118] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#141924] border border-[#263147] text-emerald-400 flex items-center justify-center shadow-inner">
              <Keyboard className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="shortcuts-title" className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Keyboard Shortcuts
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-semibold">
                  v1.0
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Vim-inspired terminal accelerators for high-velocity system navigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-[#141824] border border-[#242e42] text-[11px] font-mono text-zinc-400 shadow-sm">
              Esc to close
            </kbd>
            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-[#141924] hover:bg-[#1a2233] border border-[#242e42] hover:border-zinc-500 transition-colors"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Categories */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-[#181e2b]">
          {categories.map((category, catIdx) => {
            const Icon = category.icon;
            return (
              <div key={category.title} className={catIdx === 0 ? 'space-y-3' : 'pt-6 space-y-3'}>
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    <Icon className={`w-4 h-4 ${category.iconColor}`} />
                    <span>{category.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121620] text-zinc-400 border border-[#202738]">
                    {category.badge}
                  </span>
                </div>

                {/* Shortcuts List */}
                <div className="grid grid-cols-1 gap-2.5">
                  {category.items.map((item) => (
                    <div
                      key={item.action}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0f121a] hover:bg-[#141824] border border-[#1b2230] hover:border-[#2b354d] transition-all"
                    >
                      <div className="space-y-0.5 flex-1 pr-2">
                        <div className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                          {item.action}
                        </div>
                        <div className="text-xs text-zinc-400 font-sans leading-relaxed">
                          {item.description}
                        </div>
                      </div>

                      {/* Keys Cluster */}
                      <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                        {item.keys.map((key, keyIdx) => {
                          const keyLabel = typeof key === 'string' ? key : key.label;
                          return (
                            <React.Fragment key={keyLabel}>
                              {keyIdx > 0 && item.separator && (
                                <span className="text-[10px] font-mono text-zinc-500 uppercase px-0.5">
                                  {item.separator}
                                </span>
                              )}
                              <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 text-xs font-mono font-bold text-zinc-100 bg-[#161c28] border border-[#2b3850] rounded-lg shadow-[0_2px_0_0_#1a2232] group-hover:border-zinc-400 group-hover:shadow-[0_2px_0_0_#2b3850] transition-all">
                                {keyLabel}
                              </kbd>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3.5 border-t border-[#1c2230] bg-[#090b10] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ProTip: Global shortcuts are auto-paused when typing in form inputs.</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#161c28] border border-[#242f44] text-[10px] text-zinc-300 font-bold">
              ?
            </kbd>
            <span>or</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#161c28] border border-[#242f44] text-[10px] text-zinc-300 font-bold">
              Esc
            </kbd>
            <span>to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
