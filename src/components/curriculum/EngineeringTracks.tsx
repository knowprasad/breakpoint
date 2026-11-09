'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  CANONICAL_TRACKS,
  EngineeringTrack,
  SyllabusItem,
  generateTrackMarkdown
} from '@/data/syllabi';
import {
  CheckCircle2,
  Circle,
  Copy,
  Check,
  RotateCcw,
  Video,
  Flame,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  Clock,
  Terminal,
  ExternalLink,
  Filter
} from 'lucide-react';

const STORAGE_KEY = 'breakpoint_curriculum_progress_v1';

// Custom event to synchronize changes within the same tab instantly
const PROGRESS_EVENT = 'breakpoint_curriculum_progress_change';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(PROGRESS_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(PROGRESS_EVENT, callback);
  };
}

function getSnapshot(): string {
  if (typeof window === 'undefined') return '{}';
  try {
    return localStorage.getItem(STORAGE_KEY) || '{}';
  } catch {
    return '{}';
  }
}

function getServerSnapshot(): string {
  return '{}';
}

function updateStoredProgress(next: Record<string, boolean>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch (err) {
    console.error('Failed to update curriculum progress in localStorage:', err);
  }
}

interface EngineeringTracksProps {
  initialTrackId?: string;
  onNavigateItem?: (item: SyllabusItem) => void;
}

export function EngineeringTracks({ initialTrackId }: EngineeringTracksProps) {
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    initialTrackId || CANONICAL_TRACKS[0].id
  );
  const [copiedTrack, setCopiedTrack] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [itemFilter, setItemFilter] = useState<'all' | 'talk' | 'autopsy' | 'reading' | 'pending'>('all');

  // SSR-safe external store subscription to localStorage
  const rawProgress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const progress: Record<string, boolean> = useMemo(() => {
    try {
      return JSON.parse(rawProgress);
    } catch {
      return {};
    }
  }, [rawProgress]);

  const currentTrack = useMemo(() => {
    return CANONICAL_TRACKS.find((t) => t.id === selectedTrackId) || CANONICAL_TRACKS[0];
  }, [selectedTrackId]);

  // Overall Global Progress
  const totalGlobalItems = useMemo(() => {
    return CANONICAL_TRACKS.reduce((sum, t) => sum + t.items.length, 0);
  }, []);

  const totalGlobalCompleted = useMemo(() => {
    return CANONICAL_TRACKS.reduce(
      (sum, t) => sum + t.items.filter((item) => progress[item.id]).length,
      0
    );
  }, [progress]);

  const globalPercentage = Math.round((totalGlobalCompleted / totalGlobalItems) * 100);

  // Active Track Progress
  const trackCompletedCount = useMemo(() => {
    return currentTrack.items.filter((item) => progress[item.id]).length;
  }, [currentTrack, progress]);

  const trackTotalCount = currentTrack.items.length;
  const trackPercentage = Math.round((trackCompletedCount / trackTotalCount) * 100);

  // Filtered items
  const filteredItems = useMemo(() => {
    return currentTrack.items.filter((item) => {
      if (itemFilter === 'all') return true;
      if (itemFilter === 'pending') return !progress[item.id];
      return item.type === itemFilter;
    });
  }, [currentTrack, itemFilter, progress]);

  const handleToggleItem = (itemId: string) => {
    const next = { ...progress, [itemId]: !progress[itemId] };
    updateStoredProgress(next);
  };

  const handleCopySyllabus = async () => {
    const md = generateTrackMarkdown(currentTrack, progress);
    try {
      await navigator.clipboard.writeText(md);
      setCopiedTrack(true);
      setTimeout(() => setCopiedTrack(false), 2200);
    } catch (err) {
      console.error('Failed to copy syllabus to clipboard:', err);
    }
  };

  const handleResetTrack = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      setTimeout(() => setConfirmingReset(false), 4000);
      return;
    }

    const next = { ...progress };
    for (const item of currentTrack.items) {
      delete next[item.id];
    }
    updateStoredProgress(next);
    setConfirmingReset(false);
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#111622] via-[#0c0e14] to-[#08090d] border border-[#222a3d] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>GUIDED ENGINEERING CANON TRACKS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Staff+ Engineering Syllabi
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Curated, battle-tested learning paths designed for backend, infrastructure, and reliability engineers.
              Complete canonical conference talks, disaster postmortems, and seminal systems papers with persistent progress tracking.
            </p>
          </div>

          {/* Global Progress Card */}
          <div className="shrink-0 bg-[#07090e]/80 border border-[#1e2535] rounded-xl p-4 sm:p-5 sm:min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Overall Mastery</span>
              </span>
              <span className="text-white font-bold">{globalPercentage}%</span>
            </div>

            <div className="w-full bg-[#141924] rounded-full h-2.5 overflow-hidden border border-[#232c3f]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, globalPercentage))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>{totalGlobalCompleted} of {totalGlobalItems} items completed</span>
              <span className="text-emerald-400 font-semibold">{4 - CANONICAL_TRACKS.filter(t => t.items.every(i => progress[i.id])).length} tracks remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Track Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CANONICAL_TRACKS.map((track) => {
          const isSelected = track.id === selectedTrackId;
          const completedInTrack = track.items.filter((i) => progress[i.id]).length;
          const trackPct = Math.round((completedInTrack / track.items.length) * 100);
          const isFinished = completedInTrack === track.items.length;

          return (
            <button
              key={track.id}
              onClick={() => {
                setSelectedTrackId(track.id);
                setConfirmingReset(false);
              }}
              className={`group text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-[#111522] border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-[#0a0d14] border-[#1c2230] hover:bg-[#0f131d] hover:border-zinc-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />
              )}

              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    isSelected
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {track.badge}
                </span>

                {isFinished ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-400">
                    {completedInTrack}/{track.items.length}
                  </span>
                )}
              </div>

              <h3
                className={`font-mono text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                  isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-zinc-100'
                }`}
              >
                {track.title}
              </h3>

              <div className="mt-3 w-full bg-[#151a26] rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFinished ? 'bg-emerald-400' : isSelected ? 'bg-emerald-500' : 'bg-zinc-600'
                  }`}
                  style={{ width: `${trackPct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Active Track Details & Progress Card */}
      <div className="rounded-2xl bg-[#0c0f17] border border-[#1e2535] p-6 sm:p-7 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-[#1b212f]">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                {currentTrack.badge}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                Level: {currentTrack.difficulty}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{currentTrack.estimatedHours}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              {currentTrack.title}
            </h2>

            <p className="text-sm font-mono text-emerald-400/90 font-medium">
              &gt; {currentTrack.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
              {currentTrack.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 lg:w-56">
            <button
              onClick={handleCopySyllabus}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                copiedTrack
                  ? 'bg-emerald-950 text-emerald-200 border-emerald-500 shadow-md shadow-emerald-950/40'
                  : 'bg-[#131824] hover:bg-[#1a2130] text-zinc-200 hover:text-white border-[#273248]'
              }`}
            >
              {copiedTrack ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" />
                  <span>Syllabus Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>📋 Copy Track Syllabus</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetTrack}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all border ${
                confirmingReset
                  ? 'bg-red-950/90 text-red-200 border-red-500 font-bold animate-pulse'
                  : 'bg-[#0f121a] hover:bg-[#151922] text-zinc-400 hover:text-zinc-200 border-[#1f2635]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{confirmingReset ? 'Confirm Reset Track?' : 'Reset Track Progress'}</span>
            </button>
          </div>
        </div>

        {/* Track Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-300 flex items-center gap-2 font-medium">
              <span>Track Progress:</span>
              <span className="text-white font-bold">
                {trackCompletedCount} / {trackTotalCount} items completed ({trackPercentage}%)
              </span>
            </span>
            <span className="text-zinc-500">
              {trackTotalCount - trackCompletedCount === 0
                ? '🎉 Complete'
                : `${trackTotalCount - trackCompletedCount} remaining`}
            </span>
          </div>

          <div className="w-full bg-[#131722] rounded-full h-3 overflow-hidden border border-[#202738] p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${Math.min(100, Math.max(0, trackPercentage))}%` }}
            />
          </div>

          {trackPercentage === 100 && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Canon Mastered!</strong> You have completed all foundational talks, autopsies, and literature in this track.
              </span>
            </div>
          )}
        </div>

        {/* 4. Filter Toolbar */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2">
          <div className="flex items-center gap-1.5 text-xs font-mono overflow-x-auto no-scrollbar">
            <span className="text-zinc-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>
            {(
              [
                { id: 'all', label: `All (${currentTrack.items.length})` },
                {
                  id: 'talk',
                  label: `Talks (${currentTrack.items.filter((i) => i.type === 'talk').length})`
                },
                {
                  id: 'autopsy',
                  label: `Autopsies (${currentTrack.items.filter((i) => i.type === 'autopsy').length})`
                },
                {
                  id: 'reading',
                  label: `Readings (${currentTrack.items.filter((i) => i.type === 'reading').length})`
                },
                {
                  id: 'pending',
                  label: `Pending (${currentTrack.items.filter((i) => !progress[i.id]).length})`
                }
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setItemFilter(f.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  itemFilter === f.id
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'bg-[#10131b] text-zinc-400 hover:text-zinc-200 border border-[#1e2433]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            Click checkbox to toggle completion
          </div>
        </div>

        {/* 5. Syllabus Items List */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => {
            const isCompleted = Boolean(progress[item.id]);

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[#080b11] border-emerald-950/70 opacity-90'
                    : 'bg-[#0e121a] hover:bg-[#121622] border-[#1d2332] hover:border-zinc-700'
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Interactive Checkbox */}
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    aria-label={`Mark "${item.title}" as ${isCompleted ? 'incomplete' : 'completed'}`}
                    className={`shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-950 hover:bg-emerald-400'
                        : 'bg-[#161b26] border border-[#2b354a] hover:border-emerald-500/60 text-transparent hover:text-zinc-500'
                    }`}
                  >
                    <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-500 font-bold">
                        #{index + 1}
                      </span>

                      {/* Type Badge */}
                      {item.type === 'talk' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          <Video className="w-3 h-3 text-cyan-400" />
                          <span>TALK</span>
                        </span>
                      )}
                      {item.type === 'autopsy' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-500/30">
                          <Flame className="w-3 h-3 text-red-400" />
                          <span>AUTOPSY</span>
                        </span>
                      )}
                      {item.type === 'reading' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>READING</span>
                        </span>
                      )}

                      {item.badgeLabel && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {item.badgeLabel}
                        </span>
                      )}

                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3" />
                        <span>{item.estimatedTime}</span>
                      </span>
                    </div>

                    {/* Title with link */}
                    <Link
                      href={item.targetUrl}
                      className={`block font-mono text-sm sm:text-base font-bold transition-colors hover:text-emerald-400 ${
                        isCompleted ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-100'
                      }`}
                    >
                      {item.title}
                    </Link>

                    {/* Author attribution */}
                    <div className="text-xs font-mono text-zinc-400">
                      by <span className="text-zinc-300 font-semibold">{item.author}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed pr-2">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131722] text-zinc-500 border border-[#1e2536]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Direct Navigation Link */}
                <div className="shrink-0 flex items-center justify-end sm:self-center pt-2 sm:pt-0">
                  <Link
                    href={item.targetUrl}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border ${
                      isCompleted
                        ? 'bg-[#10141d] text-zinc-400 hover:text-zinc-200 border-[#202738] hover:border-zinc-700'
                        : item.type === 'talk'
                        ? 'bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white border-cyan-500/40 shadow-sm'
                        : item.type === 'autopsy'
                        ? 'bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border-red-500/40 shadow-sm'
                        : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border-emerald-500/40 shadow-sm'
                    }`}
                  >
                    <span>
                      {item.type === 'talk'
                        ? 'Watch Talk'
                        : item.type === 'autopsy'
                        ? 'Read Autopsy'
                        : 'Study Resource'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center rounded-xl bg-[#0a0d14] border border-[#1b212e] text-zinc-500 font-mono text-xs">
              No items match the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
