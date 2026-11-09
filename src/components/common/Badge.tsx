import React from 'react';
import { IncidentSeverity } from '@/types/incident';
import { ResourceType, ResourceLevel, ShelfLife } from '@/types/resource';

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  if (severity === 'P0' || severity === 'Critical P0') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#f47067]/15 text-[#f47067] border border-[#f47067]/40 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f47067]" />
        P0 CRITICAL
      </span>
    );
  }
  if (severity === 'P1' || severity === 'Major P1') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#c69026]/15 text-[#c69026] border border-[#c69026]/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c69026]" />
        P1 MAJOR
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#539bf5]/15 text-[#539bf5] border border-[#539bf5]/40">
      <span className="w-1.5 h-1.5 rounded-full bg-[#539bf5]" />
      P2 HIGH
    </span>
  );
}

export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const styles: Record<ResourceType, string> = {
    book: 'bg-[#57ab5a]/15 text-[#57ab5a] border-[#57ab5a]/40',
    talk: 'bg-[#539bf5]/15 text-[#539bf5] border-[#539bf5]/40',
    paper: 'bg-[#b083f0]/15 text-[#b083f0] border-[#b083f0]/40',
    course: 'bg-[#39c5cf]/15 text-[#39c5cf] border-[#39c5cf]/40'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${styles[type]}`}>
      {type}
    </span>
  );
}

export function LindyBadge({ score }: { score: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#57ab5a]/15 text-[#57ab5a] border border-[#57ab5a]/40 text-[11px] font-mono font-medium">
      <span className="text-[#57ab5a] font-bold">Lindy</span>
      <span className="font-semibold text-[#adbac7]">{score.toFixed(1)}</span>
    </div>
  );
}

export function CategoryPill({ category }: { category: string }) {
  const label = category.replace(/-/g, ' ');
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-[#768390] bg-[#1c2128] border border-[#373e47] capitalize">
      {label}
    </span>
  );
}

export function RootCausePill({ tag }: { tag: string }) {
  const label = tag.replace(/-/g, ' ');
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-[#c69026] bg-[#c69026]/15 border border-[#c69026]/30">
      #{label}
    </span>
  );
}
