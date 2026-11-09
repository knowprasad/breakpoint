'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { HackerTubeVideo } from '@/types/hackertube';
import { searchAndFilter } from '@/lib/db';
import { Search, Flame, BookOpen, AlertOctagon, CornerDownLeft, X, Video, Star } from 'lucide-react';
import { SeverityBadge, ResourceTypeBadge } from './Badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIncident: (incident: DisasterIncident) => void;
  onSelectResource: (resource: LibraryResource) => void;
  onSelectVideo?: (video: HackerTubeVideo) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectIncident,
  onSelectResource,
  onSelectVideo
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [videoResults, setVideoResults] = useState<HackerTubeVideo[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/videos?q=${encodeURIComponent(query)}&limit=5`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setVideoResults(data.videos || []);
        }
      } catch {
        // ignore
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchResults = searchAndFilter({ query });
  const combinedItems: Array<
    | { type: 'incident'; item: DisasterIncident }
    | { type: 'resource'; item: LibraryResource }
    | { type: 'video'; item: HackerTubeVideo }
  > = [
    ...searchResults.incidents.slice(0, 4).map((item) => ({ type: 'incident' as const, item })),
    ...searchResults.resources.slice(0, 3).map((item) => ({ type: 'resource' as const, item })),
    ...videoResults.slice(0, 5).map((item) => ({ type: 'video' as const, item }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (combinedItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % (combinedItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = combinedItems[selectedIndex];
      if (current) {
        if (current.type === 'incident') onSelectIncident(current.item);
        else if (current.type === 'resource') onSelectResource(current.item);
        else if (current.type === 'video' && onSelectVideo) onSelectVideo(current.item);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Palette Container */}
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#0c0e14] border border-[#272e3c] shadow-2xl overflow-hidden z-10 font-mono animate-in fade-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1f2533] bg-[#12151d]">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search disasters, 6,454 HackerTube talks, books, and mechanisms..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] text-zinc-500 border border-zinc-700 px-1.5 py-0.5 rounded bg-zinc-800">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {combinedItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              Type to search 6,454 talks, famous post-mortems, and books.
            </div>
          ) : (
            combinedItems.map((entry, idx) => {
              const isSelected = idx === selectedIndex;
              if (entry.type === 'incident') {
                const inc = entry.item;
                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      onSelectIncident(inc);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-red-950/40 border border-red-500/40 text-white'
                        : 'hover:bg-zinc-900/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base select-none">{inc.company_logo || '🔥'}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200 truncate">
                            {inc.title}
                          </span>
                          <SeverityBadge severity={inc.severity} />
                        </div>
                        <span className="text-[11px] text-zinc-400 truncate block">
                          {inc.company} ({inc.year}) • {inc.service_affected}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-red-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              } else if (entry.type === 'resource') {
                const res = entry.item;
                return (
                  <div
                    key={res.id}
                    onClick={() => {
                      onSelectResource(res);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                        : 'hover:bg-zinc-900/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200 truncate">
                            {res.title}
                          </span>
                          <ResourceTypeBadge type={res.type} />
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            Lindy {res.lindy_score}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 truncate block">
                          by {res.creator} • {res.primary_topic}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              } else {
                const vid = entry.item;
                return (
                  <div
                    key={vid.vid}
                    onClick={() => {
                      if (onSelectVideo) onSelectVideo(vid);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-950/40 border border-amber-500/40 text-white'
                        : 'hover:bg-zinc-900/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Video className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200 truncate">
                            {vid.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-500/30 flex items-center gap-0.5 font-bold">
                            <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                            {vid.score.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 truncate block">
                          {vid.channel} • {vid.primary_topic}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              }
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2 border-t border-[#1b202a] bg-[#090b0e] flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            Navigate with <kbd className="text-zinc-400">↑</kbd> <kbd className="text-zinc-400">↓</kbd>
          </span>
          <span>
            Select with <kbd className="text-zinc-400">↵</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
