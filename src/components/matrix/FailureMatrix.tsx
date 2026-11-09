'use client';

import React, { useState } from 'react';
import { ROOT_CAUSE_MATRIX } from '@/data/matrix';
import { RootCauseMatrixItem } from '@/types/matrix';
import { DisasterIncident } from '@/types/incident';
import { LibraryResource } from '@/types/resource';
import { getIncidentById, getResourceById } from '@/lib/db';
import { CategoryPill } from '@/components/common/Badge';
import { ShieldAlert, AlertTriangle, BookOpen, Flame, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

interface FailureMatrixProps {
  onSelectIncident?: (incident: DisasterIncident) => void;
  onSelectResource?: (resource: LibraryResource) => void;
}

export function FailureMatrix({ onSelectIncident, onSelectResource }: FailureMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<RootCauseMatrixItem | null>(ROOT_CAUSE_MATRIX[0]);

  const filteredMatrix = selectedCategory === 'all'
    ? ROOT_CAUSE_MATRIX
    : ROOT_CAUSE_MATRIX.filter((item) => item.category === selectedCategory);

  const categories = Array.from(new Set(ROOT_CAUSE_MATRIX.map((m) => m.category)));

  return (
    <div className="space-y-6">
      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            selectedCategory === 'all'
              ? 'bg-zinc-800 text-white font-bold border-zinc-600'
              : 'bg-[#101319] border-[#1f242e] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All Failure Families ({ROOT_CAUSE_MATRIX.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-zinc-800 text-white font-bold border-zinc-600'
                : 'bg-[#101319] border-[#1f242e] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      {/* Grid: Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatrix.map((item) => {
          const isSelected = activeItem?.id === item.id;
          const incidents = item.incident_ids.map((id) => getIncidentById(id)).filter(Boolean) as DisasterIncident[];
          const resources = item.resource_ids.map((id) => getResourceById(id)).filter(Boolean) as LibraryResource[];

          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#131722] border-red-500/50 shadow-lg shadow-red-950/20'
                  : 'bg-[#0e1116] hover:bg-[#12161f] border-[#1e232e] hover:border-[#2b3342]'
              }`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <CategoryPill category={item.category} />
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      item.risk_level === 'Severe'
                        ? 'bg-red-950/80 text-red-400 border border-red-500/40'
                        : item.risk_level === 'Critical'
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-950/80 text-blue-400 border border-blue-500/40'
                    }`}
                  >
                    {item.risk_level} Risk
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed mb-3 line-clamp-3">
                  {item.summary}
                </p>

                {/* CS Foundation */}
                <div className="p-2.5 rounded bg-[#080a0e] border border-[#191e28] text-xs font-mono text-cyan-300/90 mb-3">
                  <span className="text-[10px] text-zinc-500 block uppercase mb-0.5">
                    CS Mechanism:
                  </span>
                  {item.cs_principle}
                </div>

                {/* Defensive Pattern */}
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200/90 mb-3">
                  <span className="text-[10px] text-emerald-400 block uppercase font-mono font-bold mb-0.5">
                    Mitigation Pattern:
                  </span>
                  {item.defensive_pattern}
                </div>
              </div>

              {/* Bottom Bidirectional Mapping */}
              <div className="pt-3 border-t border-[#1a1f28] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-red-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{incidents.length} Outages</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{resources.length} Studies</span>
                  </span>
                </div>

                <span className="text-zinc-500 hover:text-white flex items-center gap-1">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Deep Inspection Drawer / Card */}
      {activeItem && (
        <div className="p-6 rounded-2xl bg-[#0c0e14] border border-[#232938] space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b202c] pb-4">
            <div>
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider block">
                Detailed Matrix Exploration
              </span>
              <h2 className="text-xl font-bold text-white">{activeItem.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <CategoryPill category={activeItem.category} />
              <span className="px-2.5 py-1 rounded bg-red-950/50 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                {activeItem.risk_level} Risk Tier
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Typical Production Blast Radius
              </span>
              <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-200/90 text-xs font-mono leading-relaxed">
                {activeItem.typical_blast_radius}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Production Defense Architecture
              </span>
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-200/90 text-xs font-mono leading-relaxed">
                {activeItem.defensive_pattern}
              </div>
            </div>
          </div>

          {/* Linked Disasters and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-[#1b202c]">
            {/* Disasters Column */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Historical Outages Caused by This Mechanism</span>
              </span>
              <div className="space-y-1.5">
                {activeItem.incident_ids.map((id) => {
                  const inc = getIncidentById(id);
                  if (!inc) return null;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => onSelectIncident && onSelectIncident(inc)}
                      className="p-3 rounded-lg bg-[#11141c] hover:bg-[#161a25] border border-[#1e2330] hover:border-red-500/30 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span>{inc.company_logo || '🔥'}</span>
                        <span className="font-bold text-zinc-200">{inc.company} ({inc.year}):</span>
                        <span className="text-zinc-400 truncate max-w-xs">{inc.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0 ml-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources Column */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Foundational Literature Explaining Defense</span>
              </span>
              <div className="space-y-1.5">
                {activeItem.resource_ids.map((id) => {
                  const res = getResourceById(id);
                  if (!res) return null;
                  return (
                    <div
                      key={res.id}
                      onClick={() => onSelectResource && onSelectResource(res)}
                      className="p-3 rounded-lg bg-[#11141c] hover:bg-[#161a25] border border-[#1e2330] hover:border-emerald-500/30 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold uppercase font-mono text-[10px]">
                          [{res.type}]
                        </span>
                        <span className="font-bold text-zinc-200">{res.title}</span>
                        <span className="text-zinc-500 truncate max-w-xs">by {res.creator}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
