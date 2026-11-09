import { HackerTubeVideo } from '@/types/hackertube';

/**
 * Curated high-signal HackerTube talks specifically mitigating real-world disaster post-mortems.
 * Pure data file with zero server dependencies (safe for client components).
 */
export const INCIDENT_CANONICAL_TALKS: Record<string, HackerTubeVideo[]> = {
  'incident-shopify-2019-cache-avalanche': [
    {
      vid: 'm64SWl9bfvk',
      url: 'https://www.youtube.com/watch?v=m64SWl9bfvk',
      title: '"Stop Rate Limiting! Capacity Management Done Right" by Jon Moore',
      channel: 'Strange Loop Conference',
      summary: 'Why naive caching and rate limiting causes cascading load, and how adaptive concurrency limits prevent service stampedes.',
      why_hn: 'Seminal Strange Loop talk on feedback loops and avoiding thundering herd disasters during traffic spikes.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'capacity management and caching',
      tags: ['caching', 'rate limiting', 'concurrency', 'thundering herd', 'systems'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 18.5,
      hn: { mentions: 24, recommenders: 19, rec_months: 18, strong_recs: 14 },
      thumbnail_url: 'https://i.ytimg.com/vi/m64SWl9bfvk/hqdefault.jpg'
    },
    {
      vid: '4fFDFbi3toc',
      url: 'https://www.youtube.com/watch?v=4fFDFbi3toc',
      title: '"Testing Distributed Systems w/ Deterministic Simulation" by Will Wilson',
      channel: 'Strange Loop Conference',
      summary: 'How FoundationDB simulated years of cluster partitions and cache invalidation races in hours using synthetic event-loop clocks.',
      why_hn: 'Considered by many the best distributed systems talk ever recorded.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'distributed systems testing',
      tags: ['deterministic simulation', 'fault injection', 'foundationdb'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 13.5,
      hn: { mentions: 20, recommenders: 12, rec_months: 11, strong_recs: 5 },
      thumbnail_url: 'https://i.ytimg.com/vi/4fFDFbi3toc/hqdefault.jpg'
    }
  ],
  'incident-crowdstrike-2024-bsod-kernel-driver': [
    {
      vid: 'EY6q5dv_B-o',
      url: 'https://www.youtube.com/watch?v=EY6q5dv_B-o',
      title: 'VCF East: Ken Thompson interviewed by Brian Kernighan',
      channel: 'Vintage Computer Federation',
      summary: 'Unix co-creator Ken Thompson on system crashes, trust boundaries, and kernel safety.',
      why_hn: 'First-hand masterclass on minimal operating system complexity and driver fault isolation.',
      content_type: 'talk',
      level: 'intermediate',
      shelf_life: 'evergreen',
      primary_topic: 'operating systems and kernel design',
      tags: ['kernel', 'operating systems', 'unix', 'reliability'],
      categories: [
        { id: 'operating-systems', name: 'Operating systems & kernels', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 19.5,
      hn: { mentions: 32, recommenders: 28, rec_months: 24, strong_recs: 21 },
      thumbnail_url: 'https://i.ytimg.com/vi/EY6q5dv_B-o/hqdefault.jpg'
    }
  ],
  'incident-cloudflare-2019-regex-cpu-spike': [
    {
      vid: 'xNzoerDljjo',
      url: 'https://www.youtube.com/watch?v=xNzoerDljjo',
      title: 'Saša Jurić - Parsing from first principles - WebCamp Zagreb 2019',
      channel: 'WebCamp Zagreb',
      summary: 'Deep dive into deterministic finite automata (DFA) versus backtracking NFA engines and why non-linear regex catastrophic backtracking takes down production CPUs.',
      why_hn: 'Clear and visual explanation of parser boundaries and regular expression complexity.',
      content_type: 'talk',
      level: 'intermediate',
      shelf_life: 'evergreen',
      primary_topic: 'regular expressions and automata',
      tags: ['regex', 'automata', 'parsing', 'cpu performance'],
      categories: [
        { id: 'computational-theory', name: 'Computability & complexity theory', area: 'math-theory', area_name: 'Mathematics & Theoretical CS' }
      ],
      score: 14.0,
      hn: { mentions: 16, recommenders: 14, rec_months: 12, strong_recs: 8 },
      thumbnail_url: 'https://i.ytimg.com/vi/xNzoerDljjo/hqdefault.jpg'
    }
  ],
  'incident-aws-s3-2017-typo-command': [
    {
      vid: 'swQbA4zub20',
      url: 'https://www.youtube.com/watch?v=swQbA4zub20',
      title: 'AWS re:Invent 2018: How AWS Minimizes the Blast Radius of Failures (ARC338)',
      channel: 'AWS Events',
      summary: 'Cellular architectures, regional isolation, and preventing single control-plane command typos from cascading across global fleets.',
      why_hn: 'Direct lessons learned from the S3 2017 outage shared by senior AWS infrastructure architects.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'fault isolation in distributed systems',
      tags: ['blast radius', 'cell architecture', 'aws', 'high availability'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 17.0,
      hn: { mentions: 22, recommenders: 18, rec_months: 15, strong_recs: 12 },
      thumbnail_url: 'https://i.ytimg.com/vi/swQbA4zub20/hqdefault.jpg'
    }
  ],
  'incident-stripe-2020-rate-limiter-cascade': [
    {
      vid: 'm64SWl9bfvk',
      url: 'https://www.youtube.com/watch?v=m64SWl9bfvk',
      title: '"Stop Rate Limiting! Capacity Management Done Right" by Jon Moore',
      channel: 'Strange Loop Conference',
      summary: 'How strict rate limiting creates positive feedback loops that bring down the very redis clusters meant to protect the backend.',
      why_hn: 'Critical reading for anyone writing API gateway rate limiting middleware.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'rate limiting and capacity management',
      tags: ['rate limiting', 'redis', 'systems', 'cascading failure'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 18.5,
      hn: { mentions: 24, recommenders: 19, rec_months: 18, strong_recs: 14 },
      thumbnail_url: 'https://i.ytimg.com/vi/m64SWl9bfvk/hqdefault.jpg'
    }
  ],
  'incident-github-2018-database-partition-split-brain': [
    {
      vid: '4fFDFbi3toc',
      url: 'https://www.youtube.com/watch?v=4fFDFbi3toc',
      title: '"Testing Distributed Systems w/ Deterministic Simulation" by Will Wilson',
      channel: 'Strange Loop Conference',
      summary: 'Why network partitions cause subtle split-brain inconsistencies across primary-replica databases, and how automated cluster testing finds partition bugs.',
      why_hn: 'Must-watch for engineers managing stateful database topologies.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'distributed systems testing',
      tags: ['consensus', 'split brain', 'network partitions', 'replication'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 13.5,
      hn: { mentions: 20, recommenders: 12, rec_months: 11, strong_recs: 5 },
      thumbnail_url: 'https://i.ytimg.com/vi/4fFDFbi3toc/hqdefault.jpg'
    }
  ],
  'incident-gitlab-2017-database-loss': [
    {
      vid: 'NVl9_6J1G60',
      url: 'https://www.youtube.com/watch?v=NVl9_6J1G60',
      title: 'Breakout Session Presented by Dan Robinson of Heap at PGConf Silicon Valley 2015',
      channel: 'PostgreSQL Conference',
      summary: 'Managing multi-terabyte PostgreSQL databases in production, backup recovery testing, and preventing accidental primary deletion.',
      why_hn: 'Practical insights into Postgres replication lags and operational safety nets.',
      content_type: 'talk',
      level: 'intermediate',
      shelf_life: 'evergreen',
      primary_topic: 'postgresql operations and reliability',
      tags: ['postgres', 'replication', 'backup verification', 'database'],
      categories: [
        { id: 'databases-storage', name: 'Databases & storage', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 12.0,
      hn: { mentions: 15, recommenders: 11, rec_months: 9, strong_recs: 4 },
      thumbnail_url: 'https://i.ytimg.com/vi/NVl9_6J1G60/hqdefault.jpg'
    }
  ]
};

export function getCuratedTalksForIncident(incidentId: string): HackerTubeVideo[] {
  return INCIDENT_CANONICAL_TALKS[incidentId] || [];
}
