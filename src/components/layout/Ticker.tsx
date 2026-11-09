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
  { company: 'Knight Capital', year: 2012, text: 'Undeployed 8th server runs 2003 Power Peg code, losing $460M in 45 minutes of market opening', severity: 'P0', id: 'incident-knight-capital-2012-dead-code-deployment' },
  { company: 'Valve Steam', year: 2015, text: 'Varnish caching bug leaks 34,000 user profiles and purchase history on Christmas morning', severity: 'P0', id: 'incident-valve-steam-2015-caching-profile-leak' },
  { company: 'Discord', year: 2023, text: 'Trillions of messages migrated from Cassandra to ScyllaDB & Rust, dropping P99 latency to 15ms', severity: 'P1', id: 'incident-discord-2023-cassandra-to-scylladb-rust' },
  { company: 'Ariane 5', year: 1996, text: '64-bit float to 16-bit integer overflow self-destructs $500M rocket 37s into flight', severity: 'P0', id: 'incident-ariane5-1996-float-to-int-overflow' },
  { company: 'Cloudflare', year: 2017, text: 'Cloudbleed parser buffer overrun leaks decrypted HTTPS cookies and passwords into web search cache', severity: 'P0', id: 'incident-cloudflare-2017-cloudbleed-buffer-overrun' }
];

export function Ticker() {
  return (
    <div className="w-full bg-[#1c2128] border-b border-[#373e47]/60 text-xs font-mono py-1.5 overflow-hidden select-none">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-[#22272e] text-[#adbac7] font-semibold tracking-wider uppercase border-r border-[#373e47] z-10 shrink-0 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f47067] inline-block" />
          <span>PRODUCTION WIRE</span>
        </div>

        <div className="overflow-hidden relative w-full">
          <div className="animate-ticker flex items-center gap-8 whitespace-nowrap pl-4">
            {/* Render twice for continuous infinite scroll */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <Link
                key={idx}
                href={`/incidents/${item.id}`}
                className="inline-flex items-center gap-2 text-[#768390] hover:text-[#adbac7] transition-colors group cursor-pointer"
              >
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#22272e] text-[#f47067] border border-[#373e47]">
                  {item.severity}
                </span>
                <span className="font-semibold text-[#adbac7] group-hover:text-white transition-colors">
                  {item.company} ({item.year}):
                </span>
                <span className="text-[#768390] group-hover:text-[#adbac7]">
                  {item.text}
                </span>
                <span className="text-[#444c56] font-normal ml-3">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
