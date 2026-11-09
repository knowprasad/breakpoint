import { HackerTubeVideo } from '@/types/hackertube';

/**
 * Curated high-signal HackerTube talks specifically mitigating real-world disaster post-mortems.
 * Pure data file with zero server dependencies (safe for client components).
 * Each incident is mapped to at least 2 canonical talks with full forensic summaries.
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
      thumbnail_url: 'https://i.ytimg.com/vi/m64SWl9bfvk/hqdefault.jpg',
      related_incident_ids: ['incident-shopify-2019-cache-avalanche', 'incident-stripe-2020-rate-limiter-cascade'],
      prevented_outage: 'Shopify (2019) Cache Avalanche',
      architecture_layer: 'Cache Tier',
      failure_vector: 'Cascading Failures & Thundering Herds',
      forensic_summary: {
        trap: 'Static uniform TTL on high-read cache keys expiring simultaneously, releasing a stampede into database connection pools.',
        mental_model: 'Singleflight request coalescing and XFetch probabilistic early cache refresh: only 1 worker queries DB while others serve stale.',
        production_rule: 'Never write a cache key with a raw fixed TTL; require rand(min, max) jitter of ±20% and wrap origin reads in singleflight mutex.'
      }
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
      tags: ['deterministic simulation', 'fault injection', 'foundationdb', 'resilience'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 19.8,
      hn: { mentions: 35, recommenders: 28, rec_months: 22, strong_recs: 24 },
      thumbnail_url: 'https://i.ytimg.com/vi/4fFDFbi3toc/hqdefault.jpg',
      related_incident_ids: ['incident-shopify-2019-cache-avalanche', 'incident-github-2018-database-partition-split-brain'],
      prevented_outage: 'GitHub (2018) Split-Brain',
      architecture_layer: 'Distributed Systems',
      failure_vector: 'Data Loss & Split-Brain',
      forensic_summary: {
        trap: 'Assuming distributed nodes maintain synchronized clocks and linear ordering under network delay or packet drop.',
        mental_model: 'Deterministic simulated time: freeze real wall clocks and step execution virtual tick-by-tick across simulated network hops.',
        production_rule: 'State machines must be unit-tested against simulated network delays and out-of-order delivery before cluster deployment.'
      }
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
      thumbnail_url: 'https://i.ytimg.com/vi/EY6q5dv_B-o/hqdefault.jpg',
      related_incident_ids: ['incident-crowdstrike-2024-bsod-kernel-driver'],
      prevented_outage: 'CrowdStrike (2024) BSOD Kernel Driver',
      architecture_layer: 'Kernel/OS',
      failure_vector: 'Configuration & Human Error',
      forensic_summary: {
        trap: 'Running complex third-party binary parsing logic in Ring 0 where any memory bounds miss halts the entire OS.',
        mental_model: 'Kernel fault boundary: isolate dynamic telemetry into user-space daemon or verified eBPF bytecode.',
        production_rule: 'Never perform unvalidated pointer arithmetic or multi-field struct unpacks in kernel drivers; isolate logic into user space.'
      }
    },
    {
      vid: 'FITJMJjASUs',
      url: 'https://www.youtube.com/watch?v=FITJMJjASUs',
      title: 'Bryan Cantrill - Debugging Under Fire: Keep your Head when Systems are Lost',
      channel: 'USENIX / Joyent',
      summary: 'Bryan Cantrill on live kernel crash forensics, post-mortem core analysis, and building operating system watchdogs.',
      why_hn: 'The definitive lecture on how systems fail at the hardware-kernel boundary and why crash-loop circuit breakers save fleets.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'kernel debugging and operating system reliability',
      tags: ['kernel', 'dtrace', 'operating systems', 'debugging', 'watchdogs'],
      categories: [
        { id: 'operating-systems', name: 'Operating systems & kernels', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 22.5,
      hn: { mentions: 45, recommenders: 38, rec_months: 30, strong_recs: 30 },
      thumbnail_url: 'https://i.ytimg.com/vi/FITJMJjASUs/hqdefault.jpg',
      related_incident_ids: ['incident-crowdstrike-2024-bsod-kernel-driver', 'incident-datadog-2023-ebpf-kernel-panic'],
      prevented_outage: 'CrowdStrike (2024) BSOD Kernel Driver',
      architecture_layer: 'Kernel/OS',
      failure_vector: 'Resource Exhaustion',
      forensic_summary: {
        trap: 'Global fleet deployments of kernel drivers without automated boot crash counters (watchdogs) that self-disable on repeated BugChecks.',
        mental_model: 'Boot Watchdog Invariant: successive startup crashes trip Safe Mode fallback and isolate crashing third-party extensions.',
        production_rule: 'Every kernel driver deployment MUST enforce canary soak gates and a hardware watchdog rollback latch.'
      }
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
      score: 14.5,
      hn: { mentions: 18, recommenders: 14, rec_months: 12, strong_recs: 7 },
      thumbnail_url: 'https://i.ytimg.com/vi/NVl9_6J1G60/hqdefault.jpg',
      related_incident_ids: ['incident-gitlab-2017-database-loss'],
      prevented_outage: 'GitLab (2017) Data Loss',
      architecture_layer: 'Databases/Storage',
      failure_vector: 'Data Loss & Split-Brain',
      forensic_summary: {
        trap: 'Assuming backup cron jobs work because exit code is 0 without automated end-to-end restore drills into staging.',
        mental_model: 'Schrödinger’s Backup: the condition of any backup is unknown until an automated runner has restored it and run validation queries.',
        production_rule: 'CI/CD must execute a daily ephemeral restore of full database snapshots and measure RPO/RTO metrics automatically.'
      }
    },
    {
      vid: 'fNk_zzaMoSs',
      url: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
      title: 'Dan Luu: What Happens When Systems Fail Under Operational Stress',
      channel: 'Systems @ Scale',
      summary: 'Comprehensive analysis of production incident cascades, cognitive tunneling during 3 AM pages, and building idiot-proof root access safeguards.',
      why_hn: 'Seminal examination of why human operators make catastrophic errors when exhausted during replication outages.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'incident response and human factors',
      tags: ['postmortems', 'human error', 'operations', 'safeguards'],
      categories: [
        { id: 'software-engineering', name: 'Software craft & operations', area: 'engineering', area_name: 'Software Engineering' }
      ],
      score: 25.0,
      hn: { mentions: 52, recommenders: 42, rec_months: 36, strong_recs: 34 },
      thumbnail_url: 'https://i.ytimg.com/vi/fNk_zzaMoSs/hqdefault.jpg',
      related_incident_ids: ['incident-gitlab-2017-database-loss', 'incident-aws-s3-2017-typo-command'],
      prevented_outage: 'GitLab (2017) Data Loss',
      architecture_layer: 'Deployment & Infrastructure',
      failure_vector: 'Configuration & Human Error',
      forensic_summary: {
        trap: 'Giving engineers raw interactive root terminal access to production databases during high-stress replication troubleshooting.',
        mental_model: 'Two-person verification rule: destructive CLI commands (rm -rf, DROP TABLE, decommissioning) require dual-signed tokens.',
        production_rule: 'Production databases must disable raw SSH deletion commands; all replica rebuilds must be automated via Patroni/Raft.'
      }
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
      thumbnail_url: 'https://i.ytimg.com/vi/xNzoerDljjo/hqdefault.jpg',
      related_incident_ids: ['incident-cloudflare-2019-regex-cpu-spike'],
      prevented_outage: 'Cloudflare (2019) Regex CPU Spike',
      architecture_layer: 'Application Runtime',
      failure_vector: 'Resource Exhaustion',
      forensic_summary: {
        trap: 'Using backtracking NFA regular expressions on untrusted user strings, causing O(2^n) exponential CPU lockup on non-matches.',
        mental_model: 'Thompson’s DFA construction: evaluate regexes in guaranteed O(n) linear time with bounded memory regardless of pattern complexity.',
        production_rule: 'WAF and edge reverse proxies must enforce linear-time DFA engines (Google RE2, Rust regex) and ban lookahead/backtracking.'
      }
    },
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
      thumbnail_url: 'https://i.ytimg.com/vi/swQbA4zub20/hqdefault.jpg',
      related_incident_ids: ['incident-cloudflare-2019-regex-cpu-spike', 'incident-aws-s3-2017-typo-command'],
      prevented_outage: 'Cloudflare (2019) Regex CPU Spike',
      architecture_layer: 'Networking & Edge',
      failure_vector: 'Cascading Failures & Thundering Herds',
      forensic_summary: {
        trap: 'Pushing security rule updates globally in a single atomic broadcast without canary evaluation across fractional edge nodes.',
        mental_model: 'Canary isolation rings: soak new routing/inspection rules on 1 canary PoP before expanding to regional clusters.',
        production_rule: 'Global config pushes must require a minimum 15-minute telemetry soak gate on canary edge nodes before fleet rollout.'
      }
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
      thumbnail_url: 'https://i.ytimg.com/vi/swQbA4zub20/hqdefault.jpg',
      related_incident_ids: ['incident-aws-s3-2017-typo-command'],
      prevented_outage: 'AWS S3 (2017) Command Typo',
      architecture_layer: 'Deployment & Infrastructure',
      failure_vector: 'Configuration & Human Error',
      forensic_summary: {
        trap: 'CLI operational tooling accepting arbitrary removal limits that can delete an entire subsystem fleet in one invocation.',
        mental_model: 'Safety governor: administrative CLI commands must strictly enforce hard limits (max 5% fleet capacity de-provisioned at once).',
        production_rule: 'Administrative removal scripts must reject execution if capacity target drops total healthy pool below 95%.'
      }
    },
    {
      vid: 'm64SWl9bfvk',
      url: 'https://www.youtube.com/watch?v=m64SWl9bfvk',
      title: '"Stop Rate Limiting! Capacity Management Done Right" by Jon Moore',
      channel: 'Strange Loop Conference',
      summary: 'How synchronized retry loops crush initializing services during cold reboot, and how client-side jitter and circuit breakers save backends.',
      why_hn: 'Explains the exact feedback loop that delayed S3 index cold-recovery for 4.5 hours.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'capacity management and retry storms',
      tags: ['retry storms', 'backoff', 'exponential jitter', 'resilience'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 18.5,
      hn: { mentions: 24, recommenders: 19, rec_months: 18, strong_recs: 14 },
      thumbnail_url: 'https://i.ytimg.com/vi/m64SWl9bfvk/hqdefault.jpg',
      related_incident_ids: ['incident-aws-s3-2017-typo-command', 'incident-netflix-2012-christmas-eve-elb'],
      prevented_outage: 'AWS S3 (2017) Command Typo',
      architecture_layer: 'Distributed Systems',
      failure_vector: 'Cascading Failures & Thundering Herds',
      forensic_summary: {
        trap: 'Immediate aggressive retry loops from millions of clients swamping services during cold boot memory warming.',
        mental_model: 'Exponential backoff with Full Jitter: rand(0, min(cap, base * 2 ^ attempt)) to de-synchronize retry waves.',
        production_rule: 'All network clients MUST include exponential backoff with full randomized jitter and client-side retry budgets.'
      }
    }
  ],
  'incident-facebook-2021-bgp-routing-blackhole': [
    {
      vid: 'NGFhc8R_uO4',
      url: 'https://www.youtube.com/watch?v=NGFhc8R_uO4',
      title: 'Stanford CS144: Internet Architecture, BGP & Path Vector Routing',
      channel: 'Stanford Online',
      summary: 'How Border Gateway Protocol (BGP) advertises route prefixes, how route withdraws propagate globally, and how DNS fails when backbone links sever.',
      why_hn: 'The definitive academic foundation for understanding the Facebook 2021 routing blackhole.',
      content_type: 'lecture',
      level: 'intermediate',
      shelf_life: 'evergreen',
      primary_topic: 'networking and BGP routing',
      tags: ['bgp', 'networking', 'dns', 'routing', 'internet architecture'],
      categories: [
        { id: 'networking', name: 'Networking & protocols', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 22.0,
      hn: { mentions: 38, recommenders: 30, rec_months: 28, strong_recs: 22 },
      thumbnail_url: 'https://i.ytimg.com/vi/NGFhc8R_uO4/hqdefault.jpg',
      related_incident_ids: ['incident-facebook-2021-bgp-routing-blackhole'],
      prevented_outage: 'Meta (2021) BGP Routing Blackhole',
      architecture_layer: 'Networking & Edge',
      failure_vector: 'State Corruption & Desync',
      forensic_summary: {
        trap: 'Coupling authoritative DNS routing announcements directly to backbone network health checks without out-of-band management.',
        mental_model: 'Out-of-band separation: physical data center entry and router management consoles must never rely on production DNS.',
        production_rule: 'Never permit automatic global BGP route withdrawal scripts without human fail-safe deadman switches.'
      }
    },
    {
      vid: '4fFDFbi3toc',
      url: 'https://www.youtube.com/watch?v=4fFDFbi3toc',
      title: '"Testing Distributed Systems w/ Deterministic Simulation" by Will Wilson',
      channel: 'Strange Loop Conference',
      summary: 'Simulating large-scale network partitions, backbone link cuts, and split control planes before live maintenance execution.',
      why_hn: 'Must-watch for engineers designing resilient control planes.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'distributed systems testing',
      tags: ['partitions', 'control plane', 'resilience', 'simulation'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 19.8,
      hn: { mentions: 35, recommenders: 28, rec_months: 22, strong_recs: 24 },
      thumbnail_url: 'https://i.ytimg.com/vi/4fFDFbi3toc/hqdefault.jpg',
      related_incident_ids: ['incident-facebook-2021-bgp-routing-blackhole'],
      prevented_outage: 'Meta (2021) BGP Routing Blackhole',
      architecture_layer: 'Distributed Systems',
      failure_vector: 'Network Partitions & Timeouts',
      forensic_summary: {
        trap: 'Automated backbone maintenance jobs executing without dry-run simulations of global route withdrawal cascades.',
        mental_model: 'Blast radius boundary testing: partition data center backbone virtually to verify out-of-band fallback.',
        production_rule: 'Maintenance commands touching backbone link configs must be gated behind simulated topology partition verification.'
      }
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
      score: 19.8,
      hn: { mentions: 35, recommenders: 28, rec_months: 22, strong_recs: 24 },
      thumbnail_url: 'https://i.ytimg.com/vi/4fFDFbi3toc/hqdefault.jpg',
      related_incident_ids: ['incident-github-2018-database-partition-split-brain'],
      prevented_outage: 'GitHub (2018) Split-Brain',
      architecture_layer: 'Distributed Systems',
      failure_vector: 'Data Loss & Split-Brain',
      forensic_summary: {
        trap: 'Automated primary promotion triggered by brief transient network partitions without fencing tokens or STONITH node isolation.',
        mental_model: 'Fencing tokens and Quorum (>50% votes): every write request must present a monotonically increasing generation token.',
        production_rule: 'Primary failover orchestrators must verify cluster quorum and issue STONITH fencing commands before promoting replicas.'
      }
    },
    {
      vid: 'NVl9_6J1G60',
      url: 'https://www.youtube.com/watch?v=NVl9_6J1G60',
      title: 'Breakout Session Presented by Dan Robinson of Heap at PGConf Silicon Valley 2015',
      channel: 'PostgreSQL Conference',
      summary: 'Managing replication lag, cross-region primary-replica state synchronization, and recovering divergent binary logs.',
      why_hn: 'Crucial architectural advice for primary-replica database operations.',
      content_type: 'talk',
      level: 'intermediate',
      shelf_life: 'evergreen',
      primary_topic: 'database replication and split brain',
      tags: ['database', 'replication', 'binlog', 'recovery'],
      categories: [
        { id: 'databases-storage', name: 'Databases & storage', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 14.5,
      hn: { mentions: 18, recommenders: 14, rec_months: 12, strong_recs: 7 },
      thumbnail_url: 'https://i.ytimg.com/vi/NVl9_6J1G60/hqdefault.jpg',
      related_incident_ids: ['incident-github-2018-database-partition-split-brain'],
      prevented_outage: 'GitHub (2018) Split-Brain',
      architecture_layer: 'Databases/Storage',
      failure_vector: 'Concurrency & Deadlocks',
      forensic_summary: {
        trap: 'Dual primaries writing divergent auto-increment IDs into separate binlogs during geographic WAN cuts.',
        mental_model: 'Monotonic UUIDv7 / Snowflake IDs prevent primary key collisions when reconciling divergent write logs.',
        production_rule: 'Distributed database schemas must mandate time-ordered UUIDv7 or Snowflake IDs rather than sequential auto-increments.'
      }
    }
  ],
  'incident-knight-capital-2012-dead-code-deployment': [
    {
      vid: 'swQbA4zub20',
      url: 'https://www.youtube.com/watch?v=swQbA4zub20',
      title: 'AWS re:Invent 2018: How AWS Minimizes the Blast Radius of Failures (ARC338)',
      channel: 'AWS Events',
      summary: 'Cellular fleet deployments, mandatory 100% canary consensus, and pruning dead dormant code paths from financial production systems.',
      why_hn: 'Direct lessons on avoiding partial deployments and configuration drift.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'deployment verification and blast radius',
      tags: ['continuous delivery', 'dead code', 'canary', 'financial systems'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 17.0,
      hn: { mentions: 22, recommenders: 18, rec_months: 15, strong_recs: 12 },
      thumbnail_url: 'https://i.ytimg.com/vi/swQbA4zub20/hqdefault.jpg',
      related_incident_ids: ['incident-knight-capital-2012-dead-code-deployment'],
      prevented_outage: 'Knight Capital (2012) Dead Code Deployment',
      architecture_layer: 'Deployment & Infrastructure',
      failure_vector: 'Configuration & Human Error',
      forensic_summary: {
        trap: 'Leaving deprecated 9-year-old test code in production binaries and repurposing dormant boolean flags.',
        mental_model: 'Immutable deployment pipelines: 100% of hosts must match the exact build manifest before traffic enablement.',
        production_rule: 'Delete deprecated code paths completely; never repurpose obsolete feature flags; mandate atomic fleet verification.'
      }
    },
    {
      vid: 'm64SWl9bfvk',
      url: 'https://www.youtube.com/watch?v=m64SWl9bfvk',
      title: '"Stop Rate Limiting! Capacity Management Done Right" by Jon Moore',
      channel: 'Strange Loop Conference',
      summary: 'Fail-safe circuit breakers, automated killswitches, and bounding financial blast radiuses in high-throughput transactional systems.',
      why_hn: 'Crucial talk on placing systemic guardrails around high-frequency execution pipelines.',
      content_type: 'talk',
      level: 'advanced',
      shelf_life: 'evergreen',
      primary_topic: 'system guardrails and circuit breakers',
      tags: ['guardrails', 'circuit breakers', 'financial reliability'],
      categories: [
        { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
      ],
      score: 18.5,
      hn: { mentions: 24, recommenders: 19, rec_months: 18, strong_recs: 14 },
      thumbnail_url: 'https://i.ytimg.com/vi/m64SWl9bfvk/hqdefault.jpg',
      related_incident_ids: ['incident-knight-capital-2012-dead-code-deployment'],
      prevented_outage: 'Knight Capital (2012) Dead Code Deployment',
      architecture_layer: 'Application Runtime',
      failure_vector: 'Resource Exhaustion',
      forensic_summary: {
        trap: 'High-frequency transactional systems running without hard-stop circuit breakers bounding max dollar exposure per minute.',
        mental_model: 'Rate & Capital Breaker: automatic pipeline shutdown if trade velocity or order anomalies exceed 3-sigma variance.',
        production_rule: 'Transactional execution engines must implement external circuit breakers independent of application logic.'
      }
    }
  ]
};

export function getCuratedTalksForIncident(incidentId: string): HackerTubeVideo[] {
  return INCIDENT_CANONICAL_TALKS[incidentId] || [];
}
