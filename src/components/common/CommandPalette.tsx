'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { getAllIncidents, getAllResources, searchAndFilter } from '@/lib/db';
import { Search, Flame, BookOpen, AlertOctagon, CornerDownLeft, X } from 'lucide-react';
import { SeverityBadge, ResourceTypeBadge } from './Badge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIncident: (incident: DisasterIncident) => void;
  onSelectResource: (resource: LibraryResource) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectIncident,
  onSelectResource
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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
  > = [
    ...searchResults.incidents.slice(0, 6).map((item) => ({ type: 'incident' as const, item })),
    ...searchResults.resources.slice(0, 6).map((item) => ({ type: 'resource' as const, item }))
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
        else onSelectResource(current.item);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div
        className="relative w-full max-w-2xl rounded-xl bg-[#0d0f14] border border-[#272e3c] shadow-2xl overflow-hidden z-10 font-mono animate-in fade-in zoom-in-95 duration-100"
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
            placeholder="Search disasters, talks, books, and root causes (e.g. cache stampede, crowdstrike, ddia)..."
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
              No matching production outages or canonical literature found.
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
              } else {
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
