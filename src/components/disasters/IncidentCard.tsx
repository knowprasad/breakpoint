'use client';

import React from 'react';
import Link from 'next/link';
import { DisasterIncident } from '@/types/incident';
import { SeverityBadge, RootCausePill } from '@/components/common/Badge';
import { getRelatedResourcesForIncident } from '@/lib/db';
import { Clock, ShieldAlert, BookOpen, ArrowRight, Zap } from 'lucide-react';

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
      className="group relative flex flex-col justify-between p-5 rounded-lg bg-[#0e1116] hover:bg-[#13171f] border border-[#1f242e] hover:border-red-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-red-950/20 active:scale-[0.99]"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none" role="img" aria-label={incident.company}>
              {incident.company_logo || '🔥'}
            </span>
            <span className="font-mono text-sm font-semibold text-zinc-200 group-hover:text-red-400 transition-colors">
              {incident.company}
            </span>
            <span className="text-zinc-500 font-mono text-xs">({incident.year})</span>
          </div>
          <SeverityBadge severity={incident.severity} />
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors leading-snug mb-2">
          {incident.title}
        </h3>

        {/* Service & Duration */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 mb-3">
          <span className="text-zinc-500">Service:</span>
          <span className="text-zinc-300 font-medium">{incident.service_affected}</span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Clock className="w-3 h-3 text-zinc-500" />
            {incident.duration}
          </span>
        </div>

        {/* The Trigger Excerpt */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
          <span className="text-red-400 font-semibold font-mono">Trigger: </span>
          {incident.trigger}
        </p>
      </div>

      {/* Bottom Footer: Root Cause Tag & Bidirectional Linked Resources */}
      <div className="pt-3 border-t border-[#1a1f28] flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <RootCausePill tag={incident.root_cause_tag} />
          <span className="text-xs font-mono text-zinc-500 group-hover:text-red-400 flex items-center gap-1 transition-colors">
            Autopsy <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        {/* Bidirectional Linking preview */}
        {relatedResources.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-[#08090b] px-2.5 py-1.5 rounded border border-[#1a1f28]">
            <BookOpen className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-zinc-500 shrink-0">Prevention:</span>
            <span className="text-zinc-300 truncate">
              {relatedResources.map((r) => r.title).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
