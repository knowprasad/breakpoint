'use client';

import React, { useState } from 'react';
import { DisasterIncident } from '@/types/incident';
import { Check, ClipboardList } from 'lucide-react';

interface CopyPrChecklistButtonProps {
  incident: DisasterIncident;
  variant?: 'compact' | 'full';
  className?: string;
}

export function CopyPrChecklistButton({
  incident,
  variant = 'compact',
  className = ''
}: CopyPrChecklistButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const markdownChecklist = [
      `### 🛡️ PR Review Checklist: Guarding against ${incident.title}`,
      `> **Domain**: ${incident.category} | **Trigger**: ${incident.trigger}`,
      `> **Mechanism**: ${incident.mechanism_explanation}`,
      '',
      '#### Verification Items for Code Review:',
      ...(incident.checklist_rules || []).map((rule) => `- [ ] ${rule}`),
      '',
      '#### Hard Production Invariant:',
      `> ${incident.mitigation_rule}`,
      '',
      '---',
      `*Curated from breakpoint forensic autopsy (${incident.company}, ${incident.year})*`
    ].join('\n');

    try {
      await navigator.clipboard.writeText(markdownChecklist);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy PR checklist to clipboard', err);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleCopy}
        type="button"
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
          copied
            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400'
            : 'bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white'
        } ${className}`}
        title="Copy structured GitHub Markdown checklist for PR code reviews"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Checklist Copied!</span>
          </>
        ) : (
          <>
            <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copy PR Review Checklist</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition-all ${
        copied
          ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
          : 'bg-[#121620] hover:bg-[#181e2b] border border-[#232a3b] hover:border-emerald-500/50 text-zinc-300 hover:text-emerald-300'
      } ${className}`}
      title="Copy GitHub Markdown checklist for PR code reviews"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 text-white" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <ClipboardList className="w-3 h-3 text-emerald-400" />
          <span>PR Checklist</span>
        </>
      )}
    </button>
  );
}
