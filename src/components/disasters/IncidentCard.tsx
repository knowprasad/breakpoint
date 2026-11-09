'use client';

import React from 'react';
import { DisasterIncident } from '@/types/incident';
import { SeverityBadge, RootCausePill } from '@/components/common/Badge';
import { getRelatedResourcesForIncident } from '@/lib/db';
import { CopyPrChecklistButton } from '@/components/disasters/CopyPrChecklistButton';
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
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#22272e] hover:bg-[#282e37] border border-[#373e47] hover:border-[#444c56] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md overflow-hidden active:scale-[0.99]"
    >
      {/* Top Ambient Line for P0 */}
      {incident.severity === 'Critical P0' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f47067] via-[#c69026] to-[#539bf5] opacity-80" />
      )}

      <div>
        {/* Top Header: Company & Severity */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1c2128] border border-[#373e47] flex items-center justify-center text-lg select-none">
              {incident.company_logo || '🔥'}
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#adbac7] group-hover:text-white transition-colors block">
                {incident.company}
              </span>
              <span className="text-[#768390] font-mono text-[11px] block">
                Year {incident.year} • {incident.duration}
              </span>
            </div>
          </div>

          <SeverityBadge severity={incident.severity} />
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#adbac7] group-hover:text-white transition-colors leading-snug mb-2.5">
          {incident.title}
        </h3>

        {/* Blast Radius Box */}
        <div className="p-2.5 rounded-lg bg-[#f47067]/10 border border-[#f47067]/30 mb-3.5 flex items-start gap-2 text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-[#f47067] shrink-0 mt-0.5" />
          <span className="text-[#adbac7] line-clamp-2 leading-relaxed">
            <strong className="text-[#f47067] font-mono">Blast Radius:</strong> {incident.impact}
          </span>
        </div>

        {/* Forensic 3-Step Chain */}
        <div className="space-y-2 text-xs font-mono mb-4 text-[#adbac7]">
          <div className="p-2.5 rounded bg-[#1c2128] border border-[#373e47]/60 space-y-1">
            <span className="text-[10px] text-[#f47067] font-bold uppercase tracking-wider block">
              Trigger Catalyst:
            </span>
            <p className="text-[#768390] line-clamp-2 font-sans text-xs">
              {incident.trigger}
            </p>
          </div>

          <div className="p-2.5 rounded bg-[#1c2128] border border-[#373e47]/60 space-y-1">
            <span className="text-[10px] text-[#539bf5] font-bold uppercase tracking-wider block">
              Deep CS Mechanism:
            </span>
            <p className="text-[#768390] line-clamp-2 font-sans text-xs">
              {incident.mechanism_explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Root Cause Tag, PR Checklist & Autopsy Link */}
      <div className="pt-3 border-t border-[#373e47]/60 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <RootCausePill tag={incident.root_cause_tag} />
          <div className="flex items-center gap-2">
            <CopyPrChecklistButton incident={incident} variant="compact" />
            <span className="text-[#768390] group-hover:text-[#f47067] flex items-center gap-1 transition-colors font-semibold shrink-0">
              Autopsy <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Linked Canonical Studies */}
        {relatedResources.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1c2128] border border-[#373e47]/60 text-[11px] font-mono text-[#768390]">
            <BookOpen className="w-3.5 h-3.5 text-[#57ab5a] shrink-0" />
            <span className="text-[#768390] shrink-0">Antidote:</span>
            <span className="text-[#57ab5a] font-semibold truncate">
              {relatedResources.map((r) => r.title).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
