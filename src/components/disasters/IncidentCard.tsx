'use client';

import React from 'react';
import { DisasterIncident } from '@/types/incident';
import { SeverityBadge, RootCausePill } from '@/components/common/Badge';
import { getRelatedResourcesForIncident } from '@/lib/db';
import { Clock, ShieldAlert, BookOpen, ArrowRight, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface IncidentCardProps {
  incident: DisasterIncident;
  onSelect?: (incident: DisasterIncident) => void;
}

export function IncidentCard({ incident, onSelect }: IncidentCardProps) {
  const relatedResources = getRelatedResourcesForIncident(incident.id);

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(incident);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0c0e14] hover:bg-[#111520] border border-[#1e2332] hover:border-red-500/50 transition-all duration-200 cursor-pointer shadow-md hover:shadow-2xl hover:shadow-red-950/30 overflow-hidden active:scale-[0.99]"
    >
      {/* Top Ambient Glow Line for P0 */}
      {incident.severity === 'Critical P0' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 opacity-80" />
      )}

      <div>
        {/* Top Header: Company & Severity */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-lg select-none">
              {incident.company_logo || '🔥'}
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-zinc-100 group-hover:text-red-400 transition-colors block">
                {incident.company}
              </span>
              <span className="text-zinc-500 font-mono text-[11px] block">
                Year {incident.year} • {incident.duration}
              </span>
            </div>
          </div>

          <SeverityBadge severity={incident.severity} />
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-300 transition-colors leading-snug mb-2.5">
          {incident.title}
        </h3>

        {/* Blast Radius Box */}
        <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 mb-3.5 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <span className="text-red-200/90 line-clamp-2 leading-relaxed">
            <strong className="text-red-300 font-mono">Blast Radius:</strong> {incident.impact}
          </span>
        </div>

        {/* Forensic 3-Step Chain */}
        <div className="space-y-2 text-xs font-mono mb-4 text-zinc-300">
          <div className="p-2 rounded bg-[#07080b] border border-[#161a24] space-y-1">
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
              Trigger Catalyst:
            </span>
            <p className="text-zinc-400 line-clamp-2 font-sans text-xs">
              {incident.trigger}
            </p>
          </div>

          <div className="p-2 rounded bg-[#07080b] border border-[#161a24] space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              Deep CS Mechanism:
            </span>
            <p className="text-zinc-400 line-clamp-2 font-sans text-xs">
              {incident.mechanism_explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Root Cause Tag & Prevention Linkage */}
      <div className="pt-3 border-t border-[#181d26] space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <RootCausePill tag={incident.root_cause_tag} />
          <span className="text-zinc-500 group-hover:text-red-400 flex items-center gap-1 transition-colors font-bold">
            Examine Autopsy <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Linked Canonical Studies */}
        {relatedResources.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#08090d] border border-[#191e2b] text-[11px] font-mono text-zinc-400">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-zinc-500 shrink-0">Antidote:</span>
            <span className="text-emerald-300 font-semibold truncate">
              {relatedResources.map((r) => r.title).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
