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
              ? 'bg-[#2d333b] text-[#adbac7] font-bold border-[#444c56] shadow-sm'
              : 'bg-[#22272e] border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
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
                ? 'bg-[#2d333b] text-[#adbac7] font-bold border-[#444c56] shadow-sm'
                : 'bg-[#22272e] border-[#373e47] text-[#768390] hover:text-[#adbac7] hover:bg-[#282e37]'
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
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between shadow-sm ${
                isSelected
                  ? 'bg-[#2d333b] border-[#539bf5]/60 shadow-md ring-1 ring-[#539bf5]/30'
                  : 'bg-[#22272e] hover:bg-[#282e37] border-[#373e47] hover:border-[#444c56]'
              }`}
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <CategoryPill category={item.category} />
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      item.risk_level === 'Severe'
                        ? 'bg-[#f47067]/15 text-[#f47067] border-[#f47067]/30'
                        : item.risk_level === 'Critical'
                        ? 'bg-[#c69026]/15 text-[#c69026] border-[#c69026]/30'
                        : 'bg-[#539bf5]/15 text-[#539bf5] border-[#539bf5]/30'
                    }`}
                  >
                    {item.risk_level} Risk
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#cdd9e5] mb-2 leading-snug font-mono">
                  {item.title}
                </h3>

                <p className="text-xs text-[#768390] leading-relaxed mb-3 line-clamp-3 font-sans">
                  {item.summary}
                </p>

                {/* CS Foundation */}
                <div className="p-3 rounded-xl bg-[#1c2128] border border-[#373e47] text-xs font-mono text-[#539bf5] mb-3">
                  <span className="text-[10px] text-[#768390] block uppercase font-bold mb-0.5">
                    CS Mechanism:
                  </span>
                  {item.cs_principle}
                </div>

                {/* Defensive Pattern */}
                <div className="p-3 rounded-xl bg-[#1c2128] border border-[#57ab5a]/30 text-xs text-[#57ab5a] mb-3">
                  <span className="text-[10px] text-[#57ab5a] block uppercase font-mono font-bold mb-0.5">
                    Mitigation Pattern:
                  </span>
                  {item.defensive_pattern}
                </div>
              </div>

              {/* Bottom Bidirectional Mapping */}
              <div className="pt-3 border-t border-[#373e47] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#f47067]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{incidents.length} Outages</span>
                  </span>
                  <span className="flex items-center gap-1 text-[#57ab5a]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{resources.length} Studies</span>
                  </span>
                </div>

                <span className="text-[#768390] group-hover:text-[#adbac7] flex items-center gap-1">
                  Inspect <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Deep Inspection Drawer / Card */}
      {activeItem && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#22272e] border border-[#373e47] space-y-6 shadow-md animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#373e47] pb-4">
            <div>
              <span className="text-xs font-mono text-[#f47067] font-bold uppercase tracking-wider block">
                Detailed Matrix Breakdown
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#cdd9e5] font-mono">{activeItem.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <CategoryPill category={activeItem.category} />
              <span className="px-2.5 py-1 rounded bg-[#f47067]/15 text-[#f47067] border border-[#f47067]/30 text-xs font-mono font-bold">
                {activeItem.risk_level} Risk Tier
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#768390] uppercase tracking-wider block">
                Typical Production Blast Radius
              </span>
              <div className="p-4 rounded-xl bg-[#1c2128] border border-[#f47067]/30 text-[#adbac7] text-xs font-mono leading-relaxed">
                {activeItem.typical_blast_radius}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#768390] uppercase tracking-wider block">
                Production Defense Architecture
              </span>
              <div className="p-4 rounded-xl bg-[#1c2128] border border-[#57ab5a]/30 text-[#adbac7] text-xs font-mono leading-relaxed">
                {activeItem.defensive_pattern}
              </div>
            </div>
          </div>

          {/* Linked Disasters and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-[#373e47]">
            {/* Disasters Column */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#f47067] uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Historical Outages Caused by This Mechanism</span>
              </span>
              <div className="space-y-2">
                {activeItem.incident_ids.map((id) => {
                  const inc = getIncidentById(id);
                  if (!inc) return null;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => onSelectIncident && onSelectIncident(inc)}
                      className="p-3 rounded-xl bg-[#1c2128] hover:bg-[#282e37] border border-[#373e47] hover:border-[#f47067]/40 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{inc.company_logo || '🔥'}</span>
                        <span className="font-bold text-[#cdd9e5]">{inc.company} ({inc.year}):</span>
                        <span className="text-[#768390] truncate max-w-xs">{inc.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#f47067] shrink-0 ml-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resources Column */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-[#57ab5a] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Foundational Literature Explaining Defense</span>
              </span>
              <div className="space-y-2">
                {activeItem.resource_ids.map((id) => {
                  const res = getResourceById(id);
                  if (!res) return null;
                  return (
                    <div
                      key={res.id}
                      onClick={() => onSelectResource && onSelectResource(res)}
                      className="p-3 rounded-xl bg-[#1c2128] hover:bg-[#282e37] border border-[#373e47] hover:border-[#57ab5a]/40 cursor-pointer flex items-center justify-between text-xs transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#57ab5a] font-bold uppercase font-mono text-[10px]">
                          [{res.type}]
                        </span>
                        <span className="font-bold text-[#cdd9e5]">{res.title}</span>
                        <span className="text-[#768390] truncate max-w-xs">by {res.creator}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#57ab5a] shrink-0 ml-2" />
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
