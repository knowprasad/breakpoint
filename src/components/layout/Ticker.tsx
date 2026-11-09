'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, Flame, ShieldAlert, Cpu } from 'lucide-react';

const TICKER_ITEMS = [
  { company: 'CrowdStrike', year: 2024, text: 'Channel File 291 out-of-bounds read BSODs 8.5M Windows hosts', severity: 'P0', id: 'incident-crowdstrike-2024-bsod-kernel-driver' },
  { company: 'GitLab', year: 2017, text: 'Replication lag and rm -rf db wipes 300GB primary; 5 backup crons silently broken', severity: 'P0', id: 'incident-gitlab-2017-database-loss' },
  { company: 'Shopify', year: 2019, text: 'Midnight cache avalanche: 500k session keys expire at 00:00:00, saturating MySQL at 100% CPU', severity: 'P0', id: 'incident-shopify-2019-cache-avalanche' },
  { company: 'Cloudflare', year: 2019, text: 'Unanchored regex backtracking in WAF pegs global edge CPU at 100%, dropping 82% of web traffic', severity: 'P0', id: 'incident-cloudflare-2019-regex-cpu-spike' },
  { company: 'AWS S3', year: 2017, text: 'CLI argument typo removes S3 index subsystem; aggressive retry storms delay cold recovery 4.5h', severity: 'P0', id: 'incident-aws-s3-2017-typo-command' },
  { company: 'Meta', year: 2021, text: 'Backbone audit command severs internal links; DNS withdraws BGP routes globally', severity: 'P0', id: 'incident-facebook-2021-bgp-routing-blackhole' },
  { company: 'GitHub', year: 2018, text: '43s optical fiber partition promotes dual MySQL primaries, causing 24h split-brain binlog surgery', severity: 'P1', id: 'incident-github-2018-database-partition-split-brain' },
  { company: 'Knight Capital', year: 2012, text: 'Undeployed 8th server runs 2003 Power Peg code, losing $460M in 45 minutes of market opening', severity: 'P0', id: 'incident-knight-capital-2012-dead-code-deployment' }
];

export function Ticker() {
  return (
    <div className="w-full bg-[#0d0f13] border-b border-red-500/20 text-xs font-mono py-1.5 overflow-hidden select-none">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-3 bg-red-950/80 text-red-400 font-bold tracking-wider uppercase border-r border-red-500/30 z-10 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
          <span>PRODUCTION WIRE</span>
        </div>

        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker flex items-center gap-8 whitespace-nowrap pl-4">
            {/* Render twice for continuous infinite scroll */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <Link
                key={idx}
                href={`/incidents/${item.id}`}
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors group cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-950/60 text-red-400 border border-red-500/30">
                  {item.severity}
                </span>
                <span className="font-semibold text-zinc-300 group-hover:text-red-400 transition-colors">
                  {item.company} ({item.year}):
                </span>
                <span className="text-zinc-400 group-hover:text-zinc-200">
                  {item.text}
                </span>
                <span className="text-zinc-600 font-normal ml-3">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
