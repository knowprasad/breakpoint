'use client';

import React, { useState, useMemo, useRef } from 'react';
import { LibraryResource, ResourceType, ResourceLevel } from '@/types/resource';
import { getAllResources } from '@/lib/db';
import { ResourceCard } from './ResourceCard';
import {
  Search,
  X,
  BookOpen,
  FileText,
  Video,
  Layers,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';

export interface LibraryExplorerProps {
  onSelectResource?: (resource: LibraryResource) => void;
  initialResources?: LibraryResource[];
  className?: string;
}

type FormatFilter = 'all' | 'book' | 'paper' | 'course-talk';
type LevelFilter = 'all' | 'Intro' | 'Intermediate' | 'Advanced';

export function LibraryExplorer({
  onSelectResource,
  initialResources,
  className = ''
}: LibraryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load all canonical resources
  const allResources = useMemo(() => {
    return initialResources && initialResources.length > 0
      ? initialResources
      : getAllResources();
  }, [initialResources]);

  // Compute format category counts
  const formatCounts = useMemo(() => {
    const books = allResources.filter((r) => r.type === 'book').length;
    const papers = allResources.filter((r) => r.type === 'paper').length;
    const coursesAndTalks = allResources.filter(
      (r) => r.type === 'course' || r.type === 'talk'
    ).length;

    return {
      all: allResources.length,
      book: books,
      paper: papers,
      courseTalk: coursesAndTalks
    };
  }, [allResources]);

  // Compute level counts
  const levelCounts = useMemo(() => {
    return {
      all: allResources.length,
      Intro: allResources.filter((r) => r.level === 'Intro').length,
      Intermediate: allResources.filter((r) => r.level === 'Intermediate').length,
      Advanced: allResources.filter((r) => r.level === 'Advanced').length
    };
  }, [allResources]);

  // Format pills specification
  const formatPills: Array<{
    id: FormatFilter;
    label: string;
    sublabel: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'all',
      label: 'All Works',
      sublabel: 'Full Canon',
      count: formatCounts.all,
      icon: Layers
    },
    {
      id: 'book',
      label: 'Textbooks',
      sublabel: 'Book',
      count: formatCounts.book,
      icon: BookOpen
    },
    {
      id: 'paper',
      label: 'Seminal Papers',
      sublabel: 'Paper',
      count: formatCounts.paper,
      icon: FileText
    },
    {
      id: 'course-talk',
      label: 'Iconic Courses & Talks',
      sublabel: 'Course / Talk',
      count: formatCounts.courseTalk,
      icon: Video
    }
  ];

  // Level options specification
  const levelOptions: Array<{
    id: LevelFilter;
    label: string;
    count: number;
  }> = [
    { id: 'all', label: 'All Levels', count: levelCounts.all },
    { id: 'Intro', label: 'Introductory', count: levelCounts.Intro },
    { id: 'Intermediate', label: 'Intermediate', count: levelCounts.Intermediate },
    { id: 'Advanced', label: 'Advanced', count: levelCounts.Advanced }
  ];

  // Filtered resources calculation
  const filteredResources = useMemo(() => {
    return allResources.filter((res) => {
      // 1. Format filter
      if (formatFilter === 'book' && res.type !== 'book') return false;
      if (formatFilter === 'paper' && res.type !== 'paper') return false;
      if (
        formatFilter === 'course-talk' &&
        res.type !== 'course' &&
        res.type !== 'talk'
      ) {
        return false;
      }

      // 2. Level filter
      if (levelFilter !== 'all' && res.level !== levelFilter) return false;

      // 3. Search query matching
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchTitle = res.title.toLowerCase().includes(q);
      const matchCreator = res.creator.toLowerCase().includes(q);
      const matchSummary = res.summary.toLowerCase().includes(q);
      const matchMentalModel = res.mental_model_3min?.toLowerCase().includes(q);
      const matchWhy = res.why_recommended?.toLowerCase().includes(q);
      const matchTags = res.tags?.some((t) => t.toLowerCase().includes(q));
      const matchYear = res.pull_quote?.year?.toLowerCase().includes(q);
      const matchQuoteText = res.pull_quote?.text?.toLowerCase().includes(q);
      const matchTopic = res.primary_topic?.toLowerCase().includes(q);

      return (
        matchTitle ||
        matchCreator ||
        matchSummary ||
        matchMentalModel ||
        matchWhy ||
        matchTags ||
        matchYear ||
        matchQuoteText ||
        matchTopic
      );
    });
  }, [allResources, formatFilter, levelFilter, searchQuery]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || formatFilter !== 'all' || levelFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setFormatFilter('all');
    setLevelFilter('all');
    searchInputRef.current?.focus();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search & Filter Control Center */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0e14] border border-[#1e2332] shadow-xl space-y-4">
        {/* Top: Instant Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4 text-emerald-400/80" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbooks and papers by title, author, description, tags, or year (e.g. DDIA, Kleppmann, 1974, consensus)..."
            className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-[#07090d] border border-[#222838] focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/40 text-sm font-mono text-zinc-200 placeholder-zinc-500 outline-none transition-all shadow-inner"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                type="button"
                className="p-1 rounded-md text-zinc-400 hover:text-white bg-[#141822] hover:bg-[#1b2230] border border-[#252f44] transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#121622] border border-[#222b3e] text-[10px] font-mono text-zinc-500">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Middle: Format Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-400 uppercase tracking-wider text-[11px] font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Format Filter</span>
            </span>
            <span className="text-zinc-500 text-[11px]">
              {filteredResources.length} matching of {allResources.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            {formatPills.map((pill) => {
              const Icon = pill.icon;
              const isActive = formatFilter === pill.id;

              return (
                <button
                  key={pill.id}
                  onClick={() => setFormatFilter(pill.id)}
                  type="button"
                  className={`flex items-center justify-between sm:justify-start gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
                    isActive
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-[#0f121a] hover:bg-[#151924] border-[#1f2535] hover:border-[#2f3950] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                    <span className="font-semibold">{pill.label}</span>
                    <span className="text-[10px] text-zinc-500 hidden md:inline">
                      ({pill.sublabel})
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                      isActive
                        ? 'bg-emerald-900/60 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#161a25] border-[#222a3a] text-zinc-400'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Level Selector & Reset */}
        <div className="pt-3 border-t border-[#181d2a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-zinc-400 uppercase tracking-wider text-[11px] font-bold shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Level:</span>
            </span>

            {/* Desktop Level Pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {levelOptions.map((opt) => {
                const isActive = levelFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setLevelFilter(opt.id)}
                    type="button"
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200 shadow-sm ring-1 ring-cyan-500/30 font-bold'
                        : 'bg-[#11141c] hover:bg-[#181d28] border-[#202737] text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span>{opt.label}</span>{' '}
                    <span className="text-[10px] text-zinc-500">({opt.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Level Dropdown */}
            <div className="sm:hidden w-full">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#11141c] border border-[#202737] text-xs font-mono text-zinc-200 outline-none"
              >
                {levelOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label} ({opt.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Clear Action */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white transition-all text-xs font-mono self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Filtered Resources */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onSelect={onSelectResource}
            />
          ))}
        </div>
      ) : (
        /* Clean Empty State */
        <div className="p-12 text-center rounded-2xl bg-[#0c0e14] border border-[#1e2332] shadow-xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#141822] border border-[#242e42] text-zinc-500 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-emerald-500/70" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">
              No Canonical Resources Match
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              No seminal textbooks, papers, or courses matched your active search query and filter criteria.
            </p>
          </div>

          {/* Filter summary tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono">
            {searchQuery && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                Query: <span className="text-emerald-400 font-bold">&ldquo;{searchQuery}&rdquo;</span>
              </span>
            )}
            {formatFilter !== 'all' && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                Format: <span className="text-cyan-400 font-bold">{formatFilter}</span>
              </span>
            )}
            {levelFilter !== 'all' && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
                Level: <span className="text-amber-400 font-bold">{levelFilter}</span>
              </span>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={resetFilters}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-emerald-950/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
