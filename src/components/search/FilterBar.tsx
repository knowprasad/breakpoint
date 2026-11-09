'use client';

import React from 'react';
import { FilterOptions } from '@/lib/db';
import { getAllCategories, getAllRootCauses } from '@/lib/db';
import { Search, SlidersHorizontal, X, Flame, BookOpen, Layers } from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  totalMatches: number;
}

export function FilterBar({ filters, onFilterChange, onReset, totalMatches }: FilterBarProps) {
  const categories = getAllCategories();
  const rootCauses = getAllRootCauses();

  const isFiltered = Boolean(
    filters.query ||
    (filters.pillar && filters.pillar !== 'all') ||
    (filters.category && filters.category !== 'all') ||
    (filters.rootCause && filters.rootCause !== 'all') ||
    (filters.severity && filters.severity !== 'all') ||
    (filters.sortBy && filters.sortBy !== 'relevance')
  );

  return (
    <div className="w-full space-y-4">
      {/* Top Pillar Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-lg bg-[#0e1116] border border-[#202530] text-xs font-mono">
          <button
            onClick={() => onFilterChange({ ...filters, pillar: 'all' })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all ${
              (filters.pillar || 'all') === 'all'
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Complete Canon</span>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, pillar: 'disasters' })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all ${
              filters.pillar === 'disasters'
                ? 'bg-red-950/70 border border-red-500/40 text-red-200 shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Disasters Only</span>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, pillar: 'library' })}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-all ${
              filters.pillar === 'library'
                ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Timeless Library Only</span>
          </button>
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span>
            <strong className="text-zinc-200">{totalMatches}</strong> items indexed
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Main Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 text-xs font-mono">
        {/* Search Bar */}
        <div className="lg:col-span-5 relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
            placeholder="Filter by keyword, error, company, mechanism..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0e1116] border border-[#202530] focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {filters.query && (
            <button
              onClick={() => onFilterChange({ ...filters, query: '' })}
              className="absolute right-2.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="lg:col-span-3">
          <select
            value={filters.category || 'all'}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full py-2 px-3 rounded-lg bg-[#0e1116] border border-[#202530] text-zinc-300 focus:outline-none focus:border-zinc-500 capitalize"
          >
            <option value="all">All Topics & Domains</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>

        {/* Root Cause Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={filters.rootCause || 'all'}
            onChange={(e) => onFilterChange({ ...filters, rootCause: e.target.value })}
            className="w-full py-2 px-3 rounded-lg bg-[#0e1116] border border-[#202530] text-zinc-300 focus:outline-none focus:border-zinc-500"
          >
            <option value="all">All Root Causes</option>
            {rootCauses.map((rc) => (
              <option key={rc.tag} value={rc.tag}>
                {rc.title} ({rc.count})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="lg:col-span-2">
          <select
            value={filters.sortBy || 'relevance'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as FilterOptions['sortBy']
              })
            }
            className="w-full py-2 px-3 rounded-lg bg-[#0e1116] border border-[#202530] text-zinc-300 focus:outline-none focus:border-zinc-500"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="year-desc">Sort: Year (Newest)</option>
            <option value="year-asc">Sort: Year (Oldest)</option>
            <option value="lindy-desc">Sort: Highest Lindy Score</option>
          </select>
        </div>
      </div>
    </div>
  );
}
