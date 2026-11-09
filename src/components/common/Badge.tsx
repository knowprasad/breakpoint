import React from 'react';
import { IncidentSeverity } from '@/types/incident';
import { ResourceType, ResourceLevel, ShelfLife } from '@/types/resource';

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  if (severity === 'Critical P0') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-red-950/70 text-red-400 border border-red-500/40 shadow-sm shadow-red-950">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        P0 CRITICAL
      </span>
    );
  }
  if (severity === 'Major P1') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-amber-950/70 text-amber-400 border border-amber-500/40">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        P1 MAJOR
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-blue-950/70 text-blue-400 border border-blue-500/40">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
      P2 HIGH
    </span>
  );
}

export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const styles: Record<ResourceType, string> = {
    book: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    talk: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    paper: 'bg-violet-950/60 text-violet-300 border-violet-500/30',
    course: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${styles[type]}`}>
      {type}
    </span>
  );
}

export function LindyBadge({ score }: { score: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-medium">
      <span className="text-emerald-500 font-bold">Lindy</span>
      <span className="font-semibold text-emerald-300">{score.toFixed(1)}</span>
    </div>
  );
}

export function CategoryPill({ category }: { category: string }) {
  const label = category.replace(/-/g, ' ');
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 capitalize">
      {label}
    </span>
  );
}

export function RootCausePill({ tag }: { tag: string }) {
  const label = tag.replace(/-/g, ' ');
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-amber-300/90 bg-amber-950/40 border border-amber-600/30">
      #{label}
    </span>
  );
}
