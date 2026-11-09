export type SyllabusItemType = 'talk' | 'autopsy' | 'reading';

export interface SyllabusItem {
  id: string;
  type: SyllabusItemType;
  title: string;
  author: string;
  description: string;
  targetId: string;
  targetUrl: string;
  estimatedTime: string;
  badgeLabel?: string;
  tags?: string[];
}

export interface EngineeringTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  difficulty: 'Staff+' | 'Advanced' | 'Foundational';
  estimatedHours: string;
  category: string;
  items: SyllabusItem[];
}

export const CANONICAL_TRACKS: EngineeringTrack[] = [
  {
    id: 'track-distributed-systems',
    title: 'Staff+ Distributed Systems & Fault Tolerance',
    subtitle: 'Master consensus, deterministic simulation, and resilient partitioning.',
    description:
      'A battle-tested curriculum designed for Staff and Principal backend engineers. Covers deterministic simulation testing of distributed databases, algebraic CRDT conflict resolution, queueing-theory-backed concurrency controls, and real-world split-brain network partition postmortems.',
    badge: 'Staff+ Canon',
    difficulty: 'Staff+',
    estimatedHours: '8–12 hours',
    category: 'distributed-systems',
    items: [
      {
        id: 'item-dist-sim-wilson',
        type: 'talk',
        title: 'Testing Distributed Systems w/ Deterministic Simulation',
        author: 'Will Wilson',
        description:
          'How FoundationDB pioneered deterministic simulation testing: mocking time, threads, network packet delay, and disk faults to uncover edge-case transactional race conditions with reproducible seeds.',
        targetId: '4fFDFbi3toc',
        targetUrl: '/watch/4fFDFbi3toc',
        estimatedTime: '45 min',
        badgeLabel: 'Strange Loop',
        tags: ['deterministic-simulation', 'fault-injection', 'foundationdb']
      },
      {
        id: 'item-dist-crdt-kleppmann',
        type: 'talk',
        title: 'Conflict Resolution for Eventual Consistency',
        author: 'Martin Kleppmann',
        description:
          'Deep dive into Conflict-free Replicated Data Types (CRDTs), state-based vs operation-based replication, semilattices, and mathematical convergence for concurrent offline-first state.',
        targetId: 'yCcWpzY8dIA',
        targetUrl: '/watch/yCcWpzY8dIA',
        estimatedTime: '42 min',
        badgeLabel: 'GOTO Conf',
        tags: ['crdt', 'eventual-consistency', 'consensus']
      },
      {
        id: 'item-dist-capacity-moore',
        type: 'talk',
        title: 'Stop Rate Limiting! Capacity Management Done Right',
        author: 'Jon Moore',
        description:
          'Why traditional token-bucket request rate limits backfire under degraded service health, and how Little’s Law and concurrency-limiting admission control protect throughput.',
        targetId: 'm64SWl9bfvk',
        targetUrl: '/watch/m64SWl9bfvk',
        estimatedTime: '38 min',
        badgeLabel: 'Strange Loop',
        tags: ['capacity-management', 'queueing-theory', 'concurrency-limits']
      },
      {
        id: 'item-dist-shopify-cache',
        type: 'autopsy',
        title: 'Shopify 2019 Cache Stampede',
        author: 'Shopify Engineering',
        description:
          'A rolling restart of cache pods triggered a thundering herd where hundreds of simultaneous misses saturated core MySQL databases, collapsing the checkout platform.',
        targetId: 'incident-shopify-2019-cache-avalanche',
        targetUrl: '/incidents/incident-shopify-2019-cache-avalanche',
        estimatedTime: '20 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['cache-stampede', 'thundering-herd', 'shopify']
      },
      {
        id: 'item-dist-github-splitbrain',
        type: 'autopsy',
        title: 'GitHub 2018 Network Partition Split-Brain',
        author: 'GitHub Engineering',
        description:
          'A brief 43-second optical transoceanic link partition caused automatic database failover across regions, writing divergent records in two master databases simultaneously.',
        targetId: 'incident-github-2018-database-partition-split-brain',
        targetUrl: '/incidents/incident-github-2018-database-partition-split-brain',
        estimatedTime: '25 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['split-brain', 'network-partition', 'github']
      },
      {
        id: 'item-dist-dynamo-paper',
        type: 'reading',
        title: "Amazon Dynamo Paper",
        author: 'DeCandia, Hastorun, Jampani et al. (Amazon)',
        description:
          'The foundational 2007 paper introducing consistent hashing rings, sloppy quorums, hinted handoffs, vector clocks, and background Merkle tree anti-entropy.',
        targetId: 'paper-dynamo-amazon',
        targetUrl: '/resources/paper-dynamo-amazon',
        estimatedTime: '60 min study',
        badgeLabel: 'ACM SOSP 2007',
        tags: ['dynamo', 'eventual-consistency', 'consistent-hashing']
      },
      {
        id: 'item-dist-chandy-lamport',
        type: 'reading',
        title: 'Chandy-Lamport Distributed Snapshots',
        author: 'K. Mani Chandy & Leslie Lamport (ACM TOCS)',
        description:
          'The seminal 1985 marker-passing algorithm to capture globally consistent distributed system state without freezing processing nodes or channels.',
        targetId: 'paper-chandy-lamport',
        targetUrl: '/resources/paper-chandy-lamport',
        estimatedTime: '45 min study',
        badgeLabel: 'ACM Classic',
        tags: ['chandy-lamport', 'distributed-snapshots', 'formal-methods']
      }
    ]
  },
  {
    id: 'track-os-kernel-systems',
    title: 'Linux Kernel, Operating Systems & Low-Level Reliability',
    subtitle: 'Kernel memory boundaries, driver crashes, and high-performance concurrency.',
    description:
      'From the Bell Labs birth of Unix to modern ring 0 sensor driver panics. Master virtual memory page tables, context switch costs, kernel crash recovery, and low-level performance analysis with eBPF flame graphs.',
    badge: 'Low-Level Core',
    difficulty: 'Advanced',
    estimatedHours: '10–14 hours',
    category: 'operating-systems-kernel',
    items: [
      {
        id: 'item-os-ken-thompson',
        type: 'talk',
        title: 'Ken Thompson & Brian Kernighan VCF East Interview',
        author: 'Ken Thompson & Brian Kernighan',
        description:
          'Historical engineering insights directly from Unix co-creator Ken Thompson: Bell Labs hiring, writing the kernel in three weeks, pipes, and minimal system design.',
        targetId: 'EY6q5dv_B-o',
        targetUrl: '/watch/EY6q5dv_B-o',
        estimatedTime: '52 min',
        badgeLabel: 'VCF East',
        tags: ['unix', 'ken-thompson', 'bell-labs']
      },
      {
        id: 'item-os-cantrill-illumos',
        type: 'talk',
        title: 'LISA11: Fork Yeah! The Rise and Development of illumos',
        author: 'Bryan Cantrill',
        description:
          'Kernel engineering in anger: dynamic tracing with DTrace, ZFS storage safety, kernel fault isolation, and why production observability must be zero-overhead.',
        targetId: '-zRN7XLCRhc',
        targetUrl: '/watch/-zRN7XLCRhc',
        estimatedTime: '47 min',
        badgeLabel: 'LISA / USENIX',
        tags: ['dtrace', 'illumos', 'kernel-debugging']
      },
      {
        id: 'item-os-rice-systemd',
        type: 'talk',
        title: 'The Tragedy of systemd',
        author: 'Benno Rice',
        description:
          'A balanced, deep dive into init systems, process supervision, Linux cgroups, socket activation, and the trade-offs of centralized system daemons.',
        targetId: 'o_AIw9bGogo',
        targetUrl: '/watch/o_AIw9bGogo',
        estimatedTime: '44 min',
        badgeLabel: 'linux.conf.au',
        tags: ['systemd', 'init', 'linux-internals']
      },
      {
        id: 'item-os-crowdstrike-crash',
        type: 'autopsy',
        title: 'CrowdStrike 2024 Channel File 291 Kernel Crash',
        author: 'CrowdStrike Security Architecture',
        description:
          'An out-of-bounds pointer read in a ring 0 kernel sensor driver triggered BugCheck 0x50, causing 8.5 million Windows machines worldwide to enter a blue-screen boot loop.',
        targetId: 'incident-crowdstrike-2024-bsod-kernel-driver',
        targetUrl: '/incidents/incident-crowdstrike-2024-bsod-kernel-driver',
        estimatedTime: '25 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['kernel-driver', 'bsod', 'memory-safety']
      },
      {
        id: 'item-os-cloudflare-redos',
        type: 'autopsy',
        title: 'Cloudflare 2019 ReDoS CPU Spike',
        author: 'Cloudflare Engineering',
        description:
          'Catastrophic regular expression backtracking in an NGINX Lua WAF rule caused 100% CPU lockup across edge proxy worker threads, dropping global traffic.',
        targetId: 'incident-cloudflare-2019-regex-cpu-spike',
        targetUrl: '/incidents/incident-cloudflare-2019-regex-cpu-spike',
        estimatedTime: '20 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['redos', 'cpu-spike', 'cloudflare']
      },
      {
        id: 'item-os-book-ostep',
        type: 'reading',
        title: 'Operating Systems: Three Easy Pieces',
        author: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
        description:
          'The gold-standard reference on virtualization (processes, virtual memory, paging), concurrency (locks, condition variables), and persistence (file systems, journaling).',
        targetId: 'book-ostep',
        targetUrl: '/resources/book-ostep',
        estimatedTime: '90 min study',
        badgeLabel: 'Canon Book',
        tags: ['ostep', 'virtual-memory', 'locks']
      },
      {
        id: 'item-os-book-systems-perf',
        type: 'reading',
        title: 'Systems Performance by Brendan Gregg',
        author: 'Brendan Gregg',
        description:
          'Enterprise performance analysis: USE method, off-CPU profiling, eBPF flame graphs, hardware counters, and Linux kernel diagnostics.',
        targetId: 'book-systems-performance',
        targetUrl: '/resources/book-systems-performance',
        estimatedTime: '90 min study',
        badgeLabel: 'Canon Book',
        tags: ['performance', 'ebpf', 'flamegraphs']
      }
    ]
  },
  {
    id: 'track-databases-storage',
    title: 'High-Throughput Databases & Storage Engine Internals',
    subtitle: 'LSM trees, write amplification, replication lag, and recovery mechanics.',
    description:
      'Demystify the mechanics behind high-scale datastores. Learn how B-Trees, LSM-Trees, and Write-Ahead Logs handle IOPS constraints, how tombstone buildup cripples wide-column stores, and how to recover from backup catastrophes.',
    badge: 'Storage Internals',
    difficulty: 'Advanced',
    estimatedHours: '10–14 hours',
    category: 'databases-storage',
    items: [
      {
        id: 'item-db-kleppmann-insideout',
        type: 'talk',
        title: 'Turning the database inside out with Apache Samza',
        author: 'Martin Kleppmann',
        description:
          'Why the relational database is an unbundled composition of transaction logs, indexes, and materialized views, and how event-stream architectures decouple state from time.',
        targetId: 'fU9hR3kiOK0',
        targetUrl: '/watch/fU9hR3kiOK0',
        estimatedTime: '55 min',
        badgeLabel: 'Strange Loop',
        tags: ['stream-processing', 'event-sourcing', 'samza']
      },
      {
        id: 'item-db-robinson-postgres',
        type: 'talk',
        title: 'Managing Multi-Terabyte PostgreSQL',
        author: 'Dan Robinson',
        description:
          'Heap’s hard-won lessons managing 50+ TB Postgres clusters: table bloat, autovacuum freeze tuning, partial indexing, and handling heavy analytical event streams.',
        targetId: 'NVl9_6J1G60',
        targetUrl: '/watch/NVl9_6J1G60',
        estimatedTime: '40 min',
        badgeLabel: 'PGConf SV',
        tags: ['postgresql', 'vacuum', 'database-scaling']
      },
      {
        id: 'item-db-juric-parsing',
        type: 'talk',
        title: 'Parsing from First Principles',
        author: 'Saša Jurić',
        description:
          'Constructing safe, deterministic, zero-allocation parser combinators from scratch without backtracking regex engines to prevent memory leaks and stack overflows.',
        targetId: 'xNzoerDljjo',
        targetUrl: '/watch/xNzoerDljjo',
        estimatedTime: '50 min',
        badgeLabel: 'WebCamp Zagreb',
        tags: ['parsing', 'first-principles', 'ast']
      },
      {
        id: 'item-db-gitlab-loss',
        type: 'autopsy',
        title: 'GitLab 2017 Database Loss & Backup Failure',
        author: 'GitLab Infrastructure Team',
        description:
          'A late-night engineer mistakenly deleted 300GB of production primary database data while five distinct backup and replication mechanisms failed simultaneously.',
        targetId: 'incident-gitlab-2017-database-loss',
        targetUrl: '/incidents/incident-gitlab-2017-database-loss',
        estimatedTime: '25 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['backup-failure', 'gitlab', 'human-error']
      },
      {
        id: 'item-db-discord-tombstones',
        type: 'autopsy',
        title: 'Discord 2022 Cassandra Tombstone Meltdown',
        author: 'Discord Engineering',
        description:
          'Unindexed partition scans across trillions of messages caused extreme JVM garbage collection pauses, tombstone buildup, and an unrecoverable flapping spiral.',
        targetId: 'incident-discord-2022-cassandra-tombstones',
        targetUrl: '/incidents/incident-discord-2022-cassandra-tombstones',
        estimatedTime: '20 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['cassandra', 'tombstones', 'gc-pauses']
      },
      {
        id: 'item-db-book-ddia',
        type: 'reading',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        description:
          'The indispensable bible of data engineering: B-Trees vs LSM-Trees, write amplification, linearizability, two-phase commits, and distributed consensus.',
        targetId: 'book-ddia',
        targetUrl: '/resources/book-ddia',
        estimatedTime: '120 min study',
        badgeLabel: 'Canon Book',
        tags: ['ddia', 'storage-engines', 'consensus']
      },
      {
        id: 'item-db-book-internals',
        type: 'reading',
        title: 'Database Internals by Alex Petrov',
        author: 'Alex Petrov',
        description:
          'A deep, source-code level examination of modern storage engines: SSTable compaction strategies, Write-Ahead Logs (WAL), buffer management, and Raft consensus.',
        targetId: 'book-database-internals',
        targetUrl: '/resources/book-database-internals',
        estimatedTime: '90 min study',
        badgeLabel: 'Canon Book',
        tags: ['storage-internals', 'lsm-trees', 'b-trees']
      }
    ]
  },
  {
    id: 'track-sre-incident-command',
    title: 'Site Reliability Engineering & Incident Command',
    subtitle: 'Blast radius containment, telemetry soak gates, and automated circuit breakers.',
    description:
      'Incident management, systemic resilience, and cognitive safety. Learn how high-leverage engineering teams mitigate typo cascades, build automated circuit breakers, and run honest, blameless postmortems.',
    badge: 'Reliability & SRE',
    difficulty: 'Staff+',
    estimatedHours: '8–12 hours',
    category: 'cloud-devops-sre',
    items: [
      {
        id: 'item-sre-hickey-hammock',
        type: 'talk',
        title: 'Hammock Driven Development',
        author: 'Rich Hickey',
        description:
          'Rich Hickey’s legendary meditation on problem identification, deep cognitive focus, isolating state, and avoiding the panic-driven rush to production.',
        targetId: 'f84n5oFoZBc',
        targetUrl: '/watch/f84n5oFoZBc',
        estimatedTime: '40 min',
        badgeLabel: 'Clojure Conj',
        tags: ['system-design', 'cognition', 'rich-hickey']
      },
      {
        id: 'item-sre-luu-postmortems',
        type: 'talk',
        title: 'Postmortems',
        author: 'Dan Luu',
        description:
          'An empirical dissection of real distributed systems postmortems: the cognitive biases that blind incident investigators and what separates superficial fixes from root systemic resilience.',
        targetId: '3w1iQZJkX6k',
        targetUrl: '/watch/3w1iQZJkX6k',
        estimatedTime: '35 min',
        badgeLabel: 'SREcon',
        tags: ['postmortems', 'root-cause', 'empirical-sre']
      },
      {
        id: 'item-sre-aws-typo',
        type: 'autopsy',
        title: 'AWS S3 2017 Command Typo Outage',
        author: 'AWS Operational Team',
        description:
          'A simple typo in an S3 maintenance CLI command inadvertently removed more servers than planned, forcing an uncoordinated cold restart of core index and placement subsystems.',
        targetId: 'incident-aws-s3-2017-typo-command',
        targetUrl: '/incidents/incident-aws-s3-2017-typo-command',
        estimatedTime: '20 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['typo', 'aws-s3', 'cold-restart']
      },
      {
        id: 'item-sre-stripe-limiter',
        type: 'autopsy',
        title: 'Stripe 2020 Rate Limiter Cascade',
        author: 'Stripe Infrastructure',
        description:
          'A protective Redis rate-limiting service suffered an internal partition, triggering an explosive retry cascade from clients that saturated API ingress nodes.',
        targetId: 'incident-stripe-2020-rate-limiter-cascade',
        targetUrl: '/incidents/incident-stripe-2020-rate-limiter-cascade',
        estimatedTime: '20 min read',
        badgeLabel: 'Postmortem Autopsy',
        tags: ['rate-limiting', 'cascading-failure', 'stripe']
      },
      {
        id: 'item-sre-book-google',
        type: 'reading',
        title: 'Site Reliability Engineering (Google)',
        author: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Murphy',
        description:
          'The definitive guide to running planet-scale production infrastructure: Error Budgets, Service Level Objectives (SLOs), blameless postmortems, and eliminating toil.',
        targetId: 'book-google-sre',
        targetUrl: '/resources/book-google-sre',
        estimatedTime: '90 min study',
        badgeLabel: 'Canon Book',
        tags: ['google-sre', 'slo', 'error-budgets']
      },
      {
        id: 'item-sre-book-release-it',
        type: 'reading',
        title: 'Release It! Design and Deploy Production-Ready Software',
        author: 'Michael T. Nygard',
        description:
          'The definitive field manual for defensive systems architecture: Circuit Breakers, Bulkheads, Steady State operations, and handling cascading failure modes.',
        targetId: 'book-release-it-nygard',
        targetUrl: '/resources/book-release-it-nygard',
        estimatedTime: '80 min study',
        badgeLabel: 'Pragmatic Bookshelf',
        tags: ['circuit-breakers', 'bulkheads', 'resilience']
      }
    ]
  }
];

export function getAllTracks(): EngineeringTrack[] {
  return CANONICAL_TRACKS;
}

export function getTrackById(id: string): EngineeringTrack | undefined {
  return CANONICAL_TRACKS.find((track) => track.id === id);
}

/**
 * Exports a track syllabus as a formatted Markdown checklist
 */
export function generateTrackMarkdown(
  track: EngineeringTrack,
  completedMap: Record<string, boolean>
): string {
  const completedCount = track.items.filter((item) => completedMap[item.id]).length;
  const pct = Math.round((completedCount / track.items.length) * 100);

  const lines = [
    `# ${track.title}`,
    `> ${track.subtitle}`,
    '',
    `**Difficulty:** ${track.difficulty} | **Est. Time:** ${track.estimatedHours}`,
    `**Progress:** ${completedCount}/${track.items.length} items completed (${pct}%)`,
    '',
    '## Syllabus',
    ''
  ];

  for (const item of track.items) {
    const isDone = Boolean(completedMap[item.id]);
    const check = isDone ? '[x]' : '[ ]';
    const typeLabel = item.type.toUpperCase();
    lines.push(
      `- ${check} **[${typeLabel}]** [${item.title}](https://breakpoint.dev${item.targetUrl}) - *${item.author}* (${item.estimatedTime})`
    );
    lines.push(`  - ${item.description}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('*Curated by [breakpoint](https://breakpoint.dev) - Production Disaster Encyclopedia & Engineering Canon*');

  return lines.join('\n');
}
