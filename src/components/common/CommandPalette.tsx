'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { HackerTubeVideo } from '@/types/hackertube';
import { searchAndFilter } from '@/lib/db';
import { getClientVideoCatalog, searchClientVideos } from '@/lib/clientCatalog';
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
        const catalog = await getClientVideoCatalog();
        if (!cancelled) {
          const res = searchClientVideos(catalog, { query, limit: 5 });
          setVideoResults(res.videos);
        }
      } catch {
        // ignore
      }
    }, 100);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2.5 sm:p-4 pt-3 sm:pt-16">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Palette Container */}
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-[#22272e] border border-[#373e47] shadow-2xl overflow-hidden z-10 font-mono animate-in fade-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-[#373e47] bg-[#1c2128]">
          <Search className="w-4 h-4 text-[#768390] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search 6,454 talks, outages & books..."
            className="w-full bg-transparent text-base sm:text-sm text-[#adbac7] placeholder:text-[#768390] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#768390] hover:text-[#adbac7] p-1 rounded-md hover:bg-[#2d333b]"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="sm:hidden text-[#768390] hover:text-[#adbac7] p-1 rounded-md hover:bg-[#2d333b]"
            title="Close"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
          <kbd className="hidden sm:inline-block text-[10px] text-[#768390] border border-[#373e47] px-1.5 py-0.5 rounded bg-[#22272e]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[55vh] sm:max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {combinedItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#768390]">
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
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#2d333b] border border-[#f47067]/50 text-white'
                        : 'hover:bg-[#282e37] text-[#adbac7]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base select-none shrink-0">{inc.company_logo || '🔥'}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-xs font-bold text-[#adbac7] truncate">
                            {inc.title}
                          </span>
                          <SeverityBadge severity={inc.severity} />
                        </div>
                        <span className="text-[11px] text-[#768390] truncate block">
                          {inc.company} ({inc.year}) • {inc.service_affected}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#f47067] shrink-0 ml-2" />
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
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#2d333b] border border-[#57ab5a]/50 text-white'
                        : 'hover:bg-[#282e37] text-[#adbac7]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 text-[#57ab5a] shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-xs font-bold text-[#adbac7] truncate">
                            {res.title}
                          </span>
                          <ResourceTypeBadge type={res.type} />
                          <span className="text-[10px] text-[#57ab5a] font-semibold">
                            Lindy {res.lindy_score}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#768390] truncate block">
                          by {res.creator} • {res.primary_topic}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#57ab5a] shrink-0 ml-2" />
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
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#2d333b] border border-[#539bf5]/50 text-white'
                        : 'hover:bg-[#282e37] text-[#adbac7]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Video className="w-4 h-4 text-[#539bf5] shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-xs font-bold text-[#adbac7] truncate">
                            {vid.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c2128] text-[#c69026] border border-[#373e47] flex items-center gap-0.5 font-bold">
                            <Star className="w-2.5 h-2.5 fill-current text-[#c69026]" />
                            {vid.score.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#768390] truncate block">
                          {vid.channel} • {vid.primary_topic}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#539bf5] shrink-0 ml-2" />
                    )}
                  </div>
                );
              }
            })
          )}
        </div>

        {/* Footer Hint Bar */}
        <div className="px-4 py-2 border-t border-[#373e47] bg-[#1c2128] flex items-center justify-between text-[11px] text-[#768390]">
          <span className="hidden sm:inline">
            Navigate with <kbd className="text-[#adbac7]">↑</kbd> <kbd className="text-[#adbac7]">↓</kbd>
          </span>
          <span className="sm:hidden">
            Tap any result to open
          </span>
          <span className="hidden sm:inline">
            Select with <kbd className="text-[#adbac7]">↵</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
