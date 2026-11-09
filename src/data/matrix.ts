import { RootCauseMatrixItem } from '@/types/matrix';

export const ROOT_CAUSE_MATRIX: RootCauseMatrixItem[] = [
  {
    id: 'rc-thundering-herd',
    tag: 'thundering-herd',
    title: 'Thundering Herd & Cache Stampede',
    category: 'databases-storage',
    cs_principle: 'Cache Eviction, Lock Coalescing, and Ingress Concurrency',
    summary: 'Occurs when multiple concurrent clients experience a simultaneous cache miss on an expensive query and hammer the primary datastore concurrently, exhausting connection pools and causing cascading timeouts.',
    incident_ids: ['incident-shopify-2019-cache-avalanche'],
    resource_ids: ['book-ddia', 'talk-redis-internals', 'paper-cache-stampede-vldb'],
    risk_level: 'Critical',
    typical_blast_radius: '100% database CPU exhaustion, connection pool starvation, platform-wide 504 Gateway Timeouts.',
    defensive_pattern: 'Randomized TTL Jitter (±15-20%), Singleflight request coalescing, and Probabilistic Early Expiration (XFetch algorithm).'
  },
  {
    id: 'rc-split-brain',
    tag: 'split-brain',
    title: 'Split-Brain & Consensus Partitions',
    category: 'distributed-systems',
    cs_principle: 'CAP Theorem, Quorum Consensus (Raft/Paxos), and Network Partitions',
    summary: 'Occurs when a distributed cluster partitions into isolated sub-groups that both believe they are authoritative, promoting dual leaders and accepting divergent, unresolvable concurrent writes.',
    incident_ids: [
      'incident-github-2018-database-partition-split-brain',
      'incident-discord-2022-cassandra-gc-pause-split-brain'
    ],
    resource_ids: ['paper-raft-consensus', 'book-ddia', 'talk-martin-kleppmann-crdt'],
    risk_level: 'Severe',
    typical_blast_radius: 'Silent data corruption, auto-increment primary key collisions, and manual multi-day binary log reconstruction.',
    defensive_pattern: 'Strict Quorum consensus (>50% votes), node fencing (STONITH), odd-numbered cluster nodes (3, 5, 7), and UUIDv7/Snowflake primary keys.'
  },
  {
    id: 'rc-redos',
    tag: 'redos-catastrophic-backtracking',
    title: 'ReDoS: Regular Expression Catastrophic Backtracking',
    category: 'traffic-loadbalancing',
    cs_principle: 'Automata Theory, NFAs vs DFAs, and Algorithmic Complexity',
    summary: 'Occurs when nested or unanchored regular expression patterns are evaluated by non-deterministic finite automaton (NFA) matchers against non-matching strings, causing exponential time complexity O(2^n).',
    incident_ids: ['incident-cloudflare-2019-regex-cpu-spike'],
    resource_ids: ['talk-regex-linear-time-cox', 'book-intro-to-automata'],
    risk_level: 'Critical',
    typical_blast_radius: 'Instant 100% CPU lockup on every core across edge reverse proxies, dropping all incoming HTTP traffic with 502s.',
    defensive_pattern: 'Mandate linear-time DFA regex engines (Google RE2, Rust regex) with guaranteed O(n) bounds; AST linting in CI for nested quantifiers.'
  },
  {
    id: 'rc-kernel-memory',
    tag: 'null-pointer-dereference-c-kernel',
    title: 'Kernel Ring 0 Bounds & Null Pointer Panics',
    category: 'operating-systems-kernel',
    cs_principle: 'Virtual Memory, Kernel Mode vs User Mode, and Page Faults',
    summary: 'Occurs when low-level driver or kernel module code attempts to dereference an unmapped address or access an array beyond allocated bounds in Ring 0, causing BugCheck or kernel panic.',
    incident_ids: [
      'incident-crowdstrike-2024-bsod-kernel-driver',
      'incident-datadog-2023-ebpf-kernel-panic'
    ],
    resource_ids: ['book-ostep', 'talk-bryan-cantrill-debugging', 'book-systems-performance'],
    risk_level: 'Severe',
    typical_blast_radius: 'Instant unrecoverable BSOD / kernel crash loop requiring physical console access with BitLocker keys to remediate.',
    defensive_pattern: 'Isolate telemetry in user-space or eBPF sandboxes; enforce compile-time bounds checks; staged canary deployment rings (Ring 0 -> Canary -> 1% -> 100%).'
  },
  {
    id: 'rc-retry-storms',
    tag: 'cascading-retry-storm',
    title: 'Cascading Retry Storms & Harmonic Resonance',
    category: 'distributed-systems',
    cs_principle: 'Queueing Theory, Backoff Algorithms, and Load Amplification',
    summary: 'Occurs when failing clients retry simultaneously with synchronized intervals or without jitter, creating constructive interference waves of amplified traffic that strangle recovering services.',
    incident_ids: [
      'incident-aws-s3-2017-typo-command',
      'incident-netflix-2012-christmas-eve-elb'
    ],
    resource_ids: ['talk-exponential-backoff-jitter', 'book-google-sre'],
    risk_level: 'High',
    typical_blast_radius: 'Prolongs a 5-minute outage into a 5-hour crisis by choking initializing databases during cold restart.',
    defensive_pattern: 'Exponential backoff with Full Jitter: rand(0, min(cap, base * 2 ^ attempt)); strict client retry budgets; circuit breakers.'
  },
  {
    id: 'rc-bgp-dns',
    tag: 'dns-bgp-withdrawal',
    title: 'BGP Route Flapping & DNSSEC Cryptographic Expiry',
    category: 'networking-bgp',
    cs_principle: 'Path-Vector Routing, Anycast, and Cryptographic Zone Signing',
    summary: 'Occurs when routing protocols (BGP) withdraw IP prefix advertisements due to internal telemetry links, or recursive DNS resolvers reject expired cryptographic zone signatures (RRSIG).',
    incident_ids: [
      'incident-facebook-2021-bgp-routing-blackhole',
      'incident-slack-2021-dnssec-expiration'
    ],
    resource_ids: ['course-cs144-networking', 'book-tcp-ip-illustrated'],
    risk_level: 'Critical',
    typical_blast_radius: 'Complete evaporation of domain from the global internet; company VPNs and physical door locks fail.',
    defensive_pattern: 'Out-of-band management network isolation; 30-day lookahead alerts on DNSSEC expiration; sanity filters preventing automated route withdrawals.'
  },
  {
    id: 'rc-dead-code',
    tag: 'dead-code-deployment',
    title: 'Dead Code Execution & Partial Fleets',
    category: 'deployment-ci-cd',
    cs_principle: 'Continuous Delivery, Atomic Deployments, and Accidental Complexity',
    summary: 'Occurs when legacy, deprecated code paths remain dormant in production binaries and are accidentally awakened by repurposed configuration flags or mismatched server versions.',
    incident_ids: ['incident-knight-capital-2012-dead-code-deployment'],
    resource_ids: ['book-continuous-delivery-humble', 'talk-simple-made-easy'],
    risk_level: 'Severe',
    typical_blast_radius: 'Instant multi-million dollar catastrophic financial loss, erratic trade loops, and immediate corporate insolvency.',
    defensive_pattern: 'Ruthlessly delete deprecated code; enforce immutable, atomic automated deployments to 100% of fleet; autonomous financial dead-man circuit breakers.'
  },
  {
    id: 'rc-connection-exhaustion',
    tag: 'connection-pool-exhaustion',
    title: 'Connection Pool & Worker Thread Starvation',
    category: 'databases-storage',
    cs_principle: 'Bulkheads, Fail-Open Semantics, and Sockets/File Descriptors',
    summary: 'Occurs when auxiliary services (rate limiters, logging, auth) slow down, causing incoming web workers to block synchronously until all thread pools and socket descriptors are consumed.',
    incident_ids: ['incident-stripe-2020-rate-limiter-cascade'],
    resource_ids: ['talk-circuit-breakers-fowler', 'book-ddia'],
    risk_level: 'High',
    typical_blast_radius: 'Core payment processing or user checkouts return 503 Bad Gateway because non-critical rate-limiter is slow.',
    defensive_pattern: 'Auxiliary services must fail open with tight timeouts (<20ms); Bulkhead isolation between critical and auxiliary threads.'
  },
  {
    id: 'rc-backup-unverified',
    tag: 'human-operational-and-backup-verification',
    title: 'Unexercised Backups & Irreversible Operational Commands',
    category: 'databases-storage',
    cs_principle: 'Disaster Recovery RTO/RPO, Defense in Depth, and Destructive Gates',
    summary: 'Occurs when organizations assume backups are running because cron scripts exit 0, only to discover during an outage that restore scripts have been silently broken for months.',
    incident_ids: [
      'incident-gitlab-2017-database-loss',
      'incident-atlassian-2022-bad-script-tenant-deletion'
    ],
    resource_ids: ['book-google-sre', 'talk-dan-luu-postmortems'],
    risk_level: 'Critical',
    typical_blast_radius: 'Irreversible deletion of customer database rows and files; multi-week manual point-in-time snapshot recovery.',
    defensive_pattern: 'Automated daily test-restores into ephemeral staging environments; multi-person authorization for production drop/rm operations; soft-deletes with 30-day tombstones.'
  },
  {
    id: 'rc-clock-skew',
    tag: 'clock-skew-leap-second',
    title: 'Distributed Clock Skew & Leap Time Drift',
    category: 'distributed-systems',
    cs_principle: 'Lamport Timestamps, TrueTime, NTP Drift, and Relativity',
    summary: 'Occurs when distributed servers rely on physical wall clocks that drift by seconds, causing time-based security assertions (JWT nbf/iat) or replication log ordering to fail.',
    incident_ids: ['incident-zoom-2020-leap-second-jwt-clock-skew'],
    resource_ids: ['paper-lamport-clocks-1978', 'book-ddia'],
    risk_level: 'High',
    typical_blast_radius: 'Widespread authentication failures ("Token Not Yet Valid"), causal inconsistency in databases, and lock timeouts.',
    defensive_pattern: 'Never compare distributed timestamps strictly; configure JWT and assertions with 60-120s clock skew leeway; synchronize with AWS Time Sync or Google TrueTime.'
  }
];
