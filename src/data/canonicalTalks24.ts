import { HackerTubeVideo } from '@/types/hackertube';

export const CANONICAL_24_SYSTEMS_TALKS: HackerTubeVideo[] = [
  {
    vid: 'm64SWl9bfvk',
    url: 'https://www.youtube.com/watch?v=m64SWl9bfvk',
    title: '"Stop Rate Limiting! Capacity Management Done Right" by Jon Moore',
    channel: 'Strange Loop Conference',
    summary: 'Why naive rate limiting and static caching causes cascading load, and how adaptive concurrency limits prevent service stampedes and thundering herds.',
    why_hn: 'Seminal Strange Loop talk on feedback loops and avoiding thundering herd disasters during traffic spikes.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'capacity management and caching',
    tags: ['caching', 'rate limiting', 'concurrency', 'thundering herd', 'systems'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 24.5,
    hn: { mentions: 34, recommenders: 28, rec_months: 24, strong_recs: 22 },
    thumbnail_url: 'https://i.ytimg.com/vi/m64SWl9bfvk/hqdefault.jpg',
    related_incident_ids: ['incident-shopify-2019-cache-avalanche', 'incident-stripe-2020-rate-limiter-cascade'],
    prevented_outage: 'Shopify (2019) Cache Avalanche',
    architecture_layer: 'Cache Tier',
    failure_vector: 'Cascading Failures & Thundering Herds',
    forensic_summary: {
      trap: 'Uniform TTL expiration on millions of cache keys causing synchronized misses that instantly exhaust database connection pools.',
      mental_model: 'Singleflight request coalescing + XFetch probabilistic early cache refresh: only 1 worker refreshes the database while peers serve stale.',
      production_rule: 'Never set a static cache TTL; mandate ±20% randomized jitter and wrap all expensive origin queries in singleflight mutexes.'
    }
  },
  {
    vid: '4fFDFbi3toc',
    url: 'https://www.youtube.com/watch?v=4fFDFbi3toc',
    title: '"Testing Distributed Systems w/ Deterministic Simulation" by Will Wilson',
    channel: 'Strange Loop Conference',
    summary: 'How FoundationDB simulated years of cluster partitions, disk corruptions, and split-brain races in hours using synthetic event-loop clocks.',
    why_hn: 'Widely considered the single most practical distributed systems talk ever recorded.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'distributed systems testing and consensus',
    tags: ['deterministic simulation', 'fault injection', 'foundationdb', 'consensus'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 25.0,
    hn: { mentions: 48, recommenders: 39, rec_months: 32, strong_recs: 30 },
    thumbnail_url: 'https://i.ytimg.com/vi/4fFDFbi3toc/hqdefault.jpg',
    related_incident_ids: ['incident-github-2018-database-partition-split-brain'],
    prevented_outage: 'GitHub (2018) Split-Brain',
    architecture_layer: 'Distributed Systems',
    failure_vector: 'Data Loss & Split-Brain',
    forensic_summary: {
      trap: 'Relying on wall-clock time and real-world network tests that miss microsecond race windows during transient WAN partitions.',
      mental_model: 'Deterministic virtual clock: control all async timers and synthetic packet drops in a single-threaded deterministic simulator.',
      production_rule: 'Distributed consensus algorithms must pass 10,000 simulated partition scenarios with synthetic time before production deployment.'
    }
  },
  {
    vid: 'EY6q5dv_B-o',
    url: 'https://www.youtube.com/watch?v=EY6q5dv_B-o',
    title: 'VCF East: Ken Thompson interviewed by Brian Kernighan',
    channel: 'Vintage Computer Federation',
    summary: 'Unix co-creator Ken Thompson on minimal operating system complexity, driver trust boundaries, and kernel safety invariants.',
    why_hn: 'First-hand masterclass on minimal operating system complexity and driver fault isolation.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'operating systems and kernel architecture',
    tags: ['kernel', 'operating systems', 'unix', 'reliability'],
    categories: [
      { id: 'operating-systems', name: 'Operating systems & kernels', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 23.5,
    hn: { mentions: 32, recommenders: 28, rec_months: 24, strong_recs: 21 },
    thumbnail_url: 'https://i.ytimg.com/vi/EY6q5dv_B-o/hqdefault.jpg',
    related_incident_ids: ['incident-crowdstrike-2024-bsod-kernel-driver'],
    prevented_outage: 'CrowdStrike (2024) BSOD Kernel Driver',
    architecture_layer: 'Kernel/OS',
    failure_vector: 'Configuration & Human Error',
    forensic_summary: {
      trap: 'Executing complex, frequently updated binary parsers inside Ring 0 kernel space where any unmapped pointer halt-loops the OS.',
      mental_model: 'Ring 0 Minimality: keep kernel drivers stateless; move all configuration parsers and telemetry logic into user space or eBPF.',
      production_rule: 'Never parse dynamic content templates directly in kernel drivers; isolate binary evaluators to sandboxed user daemons.'
    }
  },
  {
    vid: 'FITJMJjASUs',
    url: 'https://www.youtube.com/watch?v=FITJMJjASUs',
    title: 'Bryan Cantrill - Debugging Under Fire: Keep your Head when Systems are Lost',
    channel: 'USENIX / Joyent',
    summary: 'Live kernel crash forensics, post-mortem core analysis, memory corruption patterns, and building operating system watchdogs.',
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
      trap: 'Unmonitored boot loops where an initial driver crash prevents recovery payloads from ever reaching the host.',
      mental_model: 'Hardware Boot Watchdog: successive startup crashes trip a Safe Mode latch to bypass non-essential third-party drivers.',
      production_rule: 'Operating system extension deployments must require local watchdog circuit breakers that disable new drivers after 2 BugChecks.'
    }
  },
  {
    vid: 'NVl9_6J1G60',
    url: 'https://www.youtube.com/watch?v=NVl9_6J1G60',
    title: 'Dan Robinson (Heap): Multi-Terabyte PostgreSQL Operations & Backup Verifications',
    channel: 'PostgreSQL Conference',
    summary: 'Managing multi-terabyte PostgreSQL databases in production, replication lag mitigation, and automated backup restore verification.',
    why_hn: 'Deep, practical insights into Postgres write-ahead logs, replication topologies, and operational safety nets.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'postgresql operations and reliability',
    tags: ['postgres', 'replication', 'backup verification', 'database'],
    categories: [
      { id: 'databases-storage', name: 'Databases & storage', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 21.0,
    hn: { mentions: 28, recommenders: 22, rec_months: 19, strong_recs: 16 },
    thumbnail_url: 'https://i.ytimg.com/vi/NVl9_6J1G60/hqdefault.jpg',
    related_incident_ids: ['incident-gitlab-2017-database-loss'],
    prevented_outage: 'GitLab (2017) Data Loss',
    architecture_layer: 'Databases/Storage',
    failure_vector: 'Data Loss & Split-Brain',
    forensic_summary: {
      trap: 'Believing backups exist because cron jobs output 0, while backup files are empty or silent permission errors block snapshot uploads.',
      mental_model: 'Schrödinger’s Backup: a backup exists solely when an automated system has restored it onto clean metal and validated table checksums.',
      production_rule: 'Automate daily end-to-end restore drills in staging; sound immediate P1 alarms if restore latency or row-count drift exceeds 1%.'
    }
  },
  {
    vid: 'xNzoerDljjo',
    url: 'https://www.youtube.com/watch?v=xNzoerDljjo',
    title: 'Saša Jurić - Parsing from first principles - WebCamp Zagreb 2019',
    channel: 'WebCamp Zagreb',
    summary: 'Deterministic finite automata (DFA) versus backtracking NFA engines and why non-linear regex catastrophic backtracking takes down production CPUs.',
    why_hn: 'Clear and visual explanation of parser boundaries and regular expression complexity.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'regular expressions and automata theory',
    tags: ['regex', 'automata', 'parsing', 'cpu performance'],
    categories: [
      { id: 'computational-theory', name: 'Computability & complexity theory', area: 'math-theory', area_name: 'Mathematics & Theoretical CS' }
    ],
    score: 20.0,
    hn: { mentions: 24, recommenders: 20, rec_months: 18, strong_recs: 14 },
    thumbnail_url: 'https://i.ytimg.com/vi/xNzoerDljjo/hqdefault.jpg',
    related_incident_ids: ['incident-cloudflare-2019-regex-cpu-spike'],
    prevented_outage: 'Cloudflare (2019) Regex CPU Spike',
    architecture_layer: 'Application Runtime',
    failure_vector: 'Resource Exhaustion',
    forensic_summary: {
      trap: 'Evaluating unanchored or nested quantifiers like .* (?:.*=.*) using backtracking NFA engines on untrusted network payloads.',
      mental_model: 'Linear-time DFA guarantee: compile expressions into deterministic finite automata that inspect each byte exactly once in O(N).',
      production_rule: 'Enforce linear-time DFA engines (Google RE2, Rust regex) in all edge reverse proxies and WAF inspection layers.'
    }
  },
  {
    vid: 'swQbA4zub20',
    url: 'https://www.youtube.com/watch?v=swQbA4zub20',
    title: 'AWS re:Invent: How AWS Minimizes the Blast Radius of Failures (ARC338)',
    channel: 'AWS Events',
    summary: 'Cellular architectures, regional fault isolation, and preventing single control-plane command typos from cascading across global fleets.',
    why_hn: 'Direct architectural lessons learned from the S3 2017 outage shared by senior AWS infrastructure architects.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'fault isolation in distributed systems',
    tags: ['blast radius', 'cell architecture', 'aws', 'high availability'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 21.5,
    hn: { mentions: 30, recommenders: 25, rec_months: 20, strong_recs: 18 },
    thumbnail_url: 'https://i.ytimg.com/vi/swQbA4zub20/hqdefault.jpg',
    related_incident_ids: ['incident-aws-s3-2017-typo-command', 'incident-knight-capital-2012-dead-code-deployment'],
    prevented_outage: 'AWS S3 (2017) Command Typo',
    architecture_layer: 'Deployment & Infrastructure',
    failure_vector: 'Configuration & Human Error',
    forensic_summary: {
      trap: 'Single administrative control planes capable of broadcasting destructive modifications across all regional zones simultaneously.',
      mental_model: 'Cellular Partitioning: partition workloads into self-contained independent cells where failure in one cell cannot propagate outwards.',
      production_rule: 'Administrative CLI scripts must strictly limit command blast radiuses to at most 5% of active nodes in any single invocation.'
    }
  },
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
      trap: 'Coupling edge BGP route advertisements to backbone health checks without physical out-of-band management isolation.',
      mental_model: 'Out-of-band network autonomy: data center ingress controls and physical access security must never depend on production DNS.',
      production_rule: 'BGP route advertisement scripts must include hard deadman switches preventing automated withdrawal of all authoritative prefixes.'
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
    related_incident_ids: ['incident-gitlab-2017-database-loss'],
    prevented_outage: 'GitLab (2017) Data Loss',
    architecture_layer: 'Deployment & Infrastructure',
    failure_vector: 'Configuration & Human Error',
    forensic_summary: {
      trap: 'Granting interactive root terminal shells on primary databases during active high-concurrency replication outages.',
      mental_model: 'Two-person rule + Read-only defaults: destructive commands (rm -rf, DROP, decommission) require dual cryptographically signed approvals.',
      production_rule: 'Production database instances must disable raw destructive interactive shell access; enforce automated failover via Raft.'
    }
  },
  {
    vid: 'rI8tNMsozo0',
    url: 'https://www.youtube.com/watch?v=rI8tNMsozo0',
    title: 'Rich Hickey - "Simple Made Easy"',
    channel: 'Strange Loop Conference',
    summary: 'The difference between simple and easy, how incidental complexity breeds race conditions and state corruption, and building unentangled software.',
    why_hn: 'Ranked among the top 3 most influential software engineering talks of the past two decades on Hacker News.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'software architecture and complexity',
    tags: ['simplicity', 'architecture', 'state', 'immutability'],
    categories: [
      { id: 'software-engineering', name: 'Software craft & design', area: 'engineering', area_name: 'Software Engineering' }
    ],
    score: 26.5,
    hn: { mentions: 64, recommenders: 55, rec_months: 40, strong_recs: 45 },
    thumbnail_url: 'https://i.ytimg.com/vi/rI8tNMsozo0/hqdefault.jpg',
    related_incident_ids: ['incident-knight-capital-2012-dead-code-deployment'],
    prevented_outage: 'Knight Capital (2012) Dead Code Deployment',
    architecture_layer: 'Application Runtime',
    failure_vector: 'Concurrency & Deadlocks',
    forensic_summary: {
      trap: 'Entangling stateful mutable code paths across legacy feature flags that silently interact with new subsystems.',
      mental_model: 'Complecting Invariant: unbraid state from computation; pure functions and immutable values eliminate concurrent mutation races.',
      production_rule: 'Feature flags must carry explicit deprecation dates; remove dormant code paths rather than setting flag = false indefinitely.'
    }
  },
  {
    vid: '7erJ1DV_Tlo',
    url: 'https://www.youtube.com/watch?v=7erJ1DV_Tlo',
    title: 'Martin Kleppmann - Distributed Systems: Partitions, Consensus & CRDTs',
    channel: 'University of Cambridge',
    summary: 'The CAP theorem demystified: why network partitions are inevitable physical realities, consensus trade-offs, and Conflict-free Replicated Data Types.',
    why_hn: 'Cambridge computer laboratory lecture series by the author of Designing Data-Intensive Applications.',
    content_type: 'lecture',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'distributed systems consensus and partitions',
    tags: ['cap theorem', 'crdt', 'consensus', 'distributed databases'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 24.0,
    hn: { mentions: 40, recommenders: 34, rec_months: 26, strong_recs: 28 },
    thumbnail_url: 'https://i.ytimg.com/vi/7erJ1DV_Tlo/hqdefault.jpg',
    related_incident_ids: ['incident-github-2018-database-partition-split-brain'],
    prevented_outage: 'GitHub (2018) Split-Brain',
    architecture_layer: 'Distributed Systems',
    failure_vector: 'Data Loss & Split-Brain',
    forensic_summary: {
      trap: 'Allowing partition-isolated sub-clusters to accept writes concurrently without verified quorum votes (>50%).',
      mental_model: 'Fencing tokens and state linearization: nodes must prove authoritative leadership before committing state updates.',
      production_rule: 'Stateful cluster failovers must implement STONITH node fencing and monotonically incrementing fencing tokens.'
    }
  },
  {
    vid: 'cN_DpYBzKso',
    url: 'https://www.youtube.com/watch?v=cN_DpYBzKso',
    title: 'Rob Pike - "Concurrency is not Parallelism"',
    channel: 'Heroku Waza Conference',
    summary: 'The structural difference between concurrency (composition of independently executing processes) and parallelism (simultaneous execution).',
    why_hn: 'Foundational mental model lecture for structuring concurrent, race-free network servers.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'concurrency models and communication',
    tags: ['concurrency', 'parallelism', 'go', 'channels', 'actors'],
    categories: [
      { id: 'software-engineering', name: 'Software craft & languages', area: 'engineering', area_name: 'Software Engineering' }
    ],
    score: 23.0,
    hn: { mentions: 36, recommenders: 30, rec_months: 24, strong_recs: 22 },
    thumbnail_url: 'https://i.ytimg.com/vi/cN_DpYBzKso/hqdefault.jpg',
    related_incident_ids: ['incident-stripe-2020-rate-limiter-cascade'],
    prevented_outage: 'Stripe (2020) Rate Limiter Cascade',
    architecture_layer: 'Application Runtime',
    failure_vector: 'Concurrency & Deadlocks',
    forensic_summary: {
      trap: 'Sharing mutable memory across asynchronous goroutines/threads protected by scattered mutexes that deadlock under load.',
      mental_model: 'Share memory by communicating: message-passing channels with bounded buffer capacities prevent uncontrolled thread contention.',
      production_rule: 'Never expose raw shared mutable state across thread boundaries; use isolated actors or bounded buffered channels.'
    }
  },
  {
    vid: 'v6gq5qlY74M',
    url: 'https://www.youtube.com/watch?v=v6gq5qlY74M',
    title: 'Diego Ongaro - "In Search of an Understandable Consensus Algorithm (Raft)"',
    channel: 'USENIX ATC',
    summary: 'The Raft consensus algorithm: leader election, log replication, safety invariants, and joint consensus cluster membership changes.',
    why_hn: 'The seminal presentation of Raft that revolutionized distributed systems coordination.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'raft consensus and distributed state machines',
    tags: ['raft', 'consensus', 'leader election', 'distributed state'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 24.5,
    hn: { mentions: 42, recommenders: 36, rec_months: 28, strong_recs: 26 },
    thumbnail_url: 'https://i.ytimg.com/vi/v6gq5qlY74M/hqdefault.jpg',
    related_incident_ids: ['incident-github-2018-database-partition-split-brain'],
    prevented_outage: 'GitHub (2018) Split-Brain',
    architecture_layer: 'Distributed Systems',
    failure_vector: 'Data Loss & Split-Brain',
    forensic_summary: {
      trap: 'Electing leaders using naive local heartbeat timeouts without verifying majority quorum acknowledgments across cluster nodes.',
      mental_model: 'Leader Completeness: a candidate must contain all committed log entries before majority nodes grant election votes.',
      production_rule: 'Consensus clusters must maintain odd member counts (3, 5, 7) and reject writes if active quorum drops below (N/2)+1.'
    }
  },
  {
    vid: 'b2F-DItXtZs',
    url: 'https://www.youtube.com/watch?v=b2F-DItXtZs',
    title: 'Leslie Lamport - "Thinking Above the Code"',
    channel: 'Microsoft Research',
    summary: 'Turing Award winner Leslie Lamport on why coding without formal mathematical specifications leads to unrecoverable distributed deadlocks.',
    why_hn: 'A powerful warning from the creator of Paxos and TLA+ against debugging distributed concurrency by trial and error.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'formal verification and distributed invariants',
    tags: ['tla+', 'formal methods', 'specifications', 'paxos'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 23.5,
    hn: { mentions: 34, recommenders: 29, rec_months: 22, strong_recs: 20 },
    thumbnail_url: 'https://i.ytimg.com/vi/b2F-DItXtZs/hqdefault.jpg',
    related_incident_ids: ['incident-aws-s3-2017-typo-command'],
    prevented_outage: 'AWS S3 (2017) Command Typo',
    architecture_layer: 'Distributed Systems',
    failure_vector: 'Concurrency & Deadlocks',
    forensic_summary: {
      trap: 'Writing complex distributed coordination logic in code before mathematically specifying state transitions and temporal invariants.',
      mental_model: 'State-Machine Invariant: state transitions must preserve safety properties under arbitrary message delays and reordering.',
      production_rule: 'Core consensus protocols and replication state machines must be formally validated using TLA+ model checking.'
    }
  },
  {
    vid: 'Unzc731iCUY',
    url: 'https://www.youtube.com/watch?v=Unzc731iCUY',
    title: 'Patrick Winston - "How to Speak" (MIT Lecture)',
    channel: 'MIT OpenCourseWare',
    summary: 'The legendary MIT guide to technical communication, heuristics for crisp explanations, and presenting engineering proposals with maximum clarity.',
    why_hn: 'The most recommended non-coding lecture on Hacker News for engineering leadership and architectural reviews.',
    content_type: 'lecture',
    level: 'general',
    shelf_life: 'evergreen',
    primary_topic: 'engineering communication and leadership',
    tags: ['communication', 'mit', 'leadership', 'presentation'],
    categories: [
      { id: 'software-engineering', name: 'Engineering leadership', area: 'engineering', area_name: 'Software Engineering' }
    ],
    score: 21.0,
    hn: { mentions: 38, recommenders: 32, rec_months: 28, strong_recs: 24 },
    thumbnail_url: 'https://i.ytimg.com/vi/Unzc731iCUY/hqdefault.jpg',
    related_incident_ids: ['incident-gitlab-2017-database-loss'],
    prevented_outage: 'GitLab (2017) Data Loss',
    architecture_layer: 'Deployment & Infrastructure',
    failure_vector: 'Configuration & Human Error',
    forensic_summary: {
      trap: 'Poor operational communication and ambiguous alert channels during high-stress production outages leading to duplicate commands.',
      mental_model: 'Incident Command Structure: single unified incident commander, clear timeboxed briefings, and unambiguous runbook vocabulary.',
      production_rule: 'During P0 outages, mandate a dedicated incident commander who does not touch keyboards and enforces verbal readbacks.'
    }
  },
  {
    vid: 'VMj-3S1tku0',
    url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
    title: 'Andrej Karpathy - Building micrograd & Neural Network Backpropagation',
    channel: 'Andrej Karpathy',
    summary: 'Autograd engine from scratch, backpropagation mathematics, and avoiding vanishing/exploding gradient resource exhaustion.',
    why_hn: 'Masterclass in mechanical empathy: demystifying deep learning compute graphs from first principles.',
    content_type: 'tutorial',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'neural networks and computational graphs',
    tags: ['ai', 'backpropagation', 'micrograd', 'computational graph'],
    categories: [
      { id: 'ai-data', name: 'AI & machine learning', area: 'ai-data', area_name: 'AI, Machine Learning & Data' }
    ],
    score: 21.0,
    hn: { mentions: 35, recommenders: 28, rec_months: 20, strong_recs: 22 },
    thumbnail_url: 'https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg',
    related_incident_ids: ['incident-datadog-2023-ebpf-kernel-panic'],
    prevented_outage: 'Datadog (2023) eBPF Kernel Panic',
    architecture_layer: 'Application Runtime',
    failure_vector: 'Resource Exhaustion',
    forensic_summary: {
      trap: 'Unbounded tensor allocations and circular computational graphs leaking gigabytes of GPU/CPU memory during inference loops.',
      mental_model: 'Static DAG execution: compile dynamic graphs into statically bounded execution plans with strict memory buffers.',
      production_rule: 'Model inference services must enforce strict maximum input dimensions and hard worker memory cgroups.'
    }
  },
  {
    vid: '2KmHtgtEZ1s',
    url: 'https://www.youtube.com/watch?v=2KmHtgtEZ1s',
    title: 'Kirk McKusick - "A Narrative History of BSD: Memory Management & FFS"',
    channel: 'USENIX Association',
    summary: 'The architect of the Fast File System (FFS) and BSD VM explains page replacement, buffer cache write-backs, and disk integrity.',
    why_hn: 'The premier primary source on operating system virtual memory paging and file system block management.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'file systems and virtual memory architecture',
    tags: ['bsd', 'unix', 'virtual memory', 'ffs', 'file systems'],
    categories: [
      { id: 'operating-systems', name: 'Operating systems & kernels', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 20.5,
    hn: { mentions: 26, recommenders: 21, rec_months: 18, strong_recs: 15 },
    thumbnail_url: 'https://i.ytimg.com/vi/2KmHtgtEZ1s/hqdefault.jpg',
    related_incident_ids: ['incident-crowdstrike-2024-bsod-kernel-driver'],
    prevented_outage: 'CrowdStrike (2024) BSOD Kernel Driver',
    architecture_layer: 'Kernel/OS',
    failure_vector: 'Resource Exhaustion',
    forensic_summary: {
      trap: 'Unsynchronized kernel buffer flushes that corrupt on-disk superblock headers during abrupt power loss or kernel panics.',
      mental_model: 'Soft Updates and Write-Ahead Logging: order metadata updates strictly such that on-disk pointers never reference unallocated blocks.',
      production_rule: 'Storage engines must mandate fsync/O_DIRECT boundaries on WAL logs before acknowledging transaction commit.'
    }
  },
  {
    vid: 'P2TcQ3h0ipQ',
    url: 'https://www.youtube.com/watch?v=P2TcQ3h0ipQ',
    title: 'Brendan Gregg - Systems Performance: Tuning and eBPF Tracing',
    channel: 'Netflix TechBlog / USENIX',
    summary: 'USE method (Utilization, Saturation, Errors), kernel latency flame graphs, and diagnosing thread starvation at microsecond resolution.',
    why_hn: 'The gold standard methodology for systems performance analysis from the creator of flame graphs.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'systems performance and kernel observability',
    tags: ['performance', 'ebpf', 'flame graphs', 'linux kernel'],
    categories: [
      { id: 'operating-systems', name: 'Operating systems & kernels', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 23.0,
    hn: { mentions: 40, recommenders: 35, rec_months: 28, strong_recs: 28 },
    thumbnail_url: 'https://i.ytimg.com/vi/P2TcQ3h0ipQ/hqdefault.jpg',
    related_incident_ids: ['incident-datadog-2023-ebpf-kernel-panic'],
    prevented_outage: 'Datadog (2023) eBPF Kernel Panic',
    architecture_layer: 'Kernel/OS',
    failure_vector: 'Resource Exhaustion',
    forensic_summary: {
      trap: 'Focusing on average CPU utilization while missing 100% saturation spikes in thread run queues and IO wait queues.',
      mental_model: 'USE Method: for every hardware and software resource, explicitly measure Utilization, Saturation, and Errors.',
      production_rule: 'Alert on system saturation (disk queue length, run queue latency, socket drops) rather than simple CPU percentages.'
    }
  },
  {
    vid: '01sAkU_NvBQ',
    url: 'https://www.youtube.com/watch?v=01sAkU_NvBQ',
    title: 'Gil Tene - "How NOT to Measure Latency"',
    channel: 'InfoQ Conference',
    summary: 'The coordinated omission problem in benchmark harnesses, why percentile averages are mathematical lies, and true HDR latency analysis.',
    why_hn: 'Mandatory viewing for anyone who has ever cited a p99 latency metric.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'latency measurement and coordinated omission',
    tags: ['latency', 'benchmarking', 'coordinated omission', 'hdr histogram'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 22.0,
    hn: { mentions: 36, recommenders: 30, rec_months: 22, strong_recs: 25 },
    thumbnail_url: 'https://i.ytimg.com/vi/01sAkU_NvBQ/hqdefault.jpg',
    related_incident_ids: ['incident-shopify-2019-cache-avalanche'],
    prevented_outage: 'Shopify (2019) Cache Avalanche',
    architecture_layer: 'Networking & Edge',
    failure_vector: 'Cascading Failures & Thundering Herds',
    forensic_summary: {
      trap: 'Coordinated Omission: load generation clients pausing when servers freeze, masking massive tail latency spikes in test dashboards.',
      mental_model: 'Open workload model: issue requests on an independent Poisson schedule regardless of whether prior requests returned.',
      production_rule: 'Load tests must use open-loop generators that record coordinated omission corrections and track 99.99th percentile distributions.'
    }
  },
  {
    vid: 'j6ow-UemzBc',
    url: 'https://www.youtube.com/watch?v=j6ow-UemzBc',
    title: 'Kavitha Srinivasan - Scaling Redis at Twitter: Caching Invariants',
    channel: 'QCon Conference',
    summary: 'Operating multi-terabyte in-memory caching fleets under thundering herds, eviction storms, and client socket timeouts.',
    why_hn: 'Direct architectural blueprint for avoiding cache avalanche disasters under massive social ingress.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'redis caching architecture and scale',
    tags: ['redis', 'caching', 'thundering herd', 'twitter', 'scale'],
    categories: [
      { id: 'databases-storage', name: 'Databases & storage', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 21.0,
    hn: { mentions: 28, recommenders: 23, rec_months: 18, strong_recs: 16 },
    thumbnail_url: 'https://i.ytimg.com/vi/j6ow-UemzBc/hqdefault.jpg',
    related_incident_ids: ['incident-shopify-2019-cache-avalanche'],
    prevented_outage: 'Shopify (2019) Cache Avalanche',
    architecture_layer: 'Cache Tier',
    failure_vector: 'Cascading Failures & Thundering Herds',
    forensic_summary: {
      trap: 'Allowing thousands of concurrent client threads to request the same missing cache key simultaneously from the primary database.',
      mental_model: 'Cache Dogpiling Invariant: origin recomputations must be strictly bounded to 1 in-flight worker per cache key.',
      production_rule: 'Wrap all cache-miss database fetches in distributed locks or singleflight coalescing groups.'
    }
  },
  {
    vid: 'yLkW3RzY6eQ',
    url: 'https://www.youtube.com/watch?v=yLkW3RzY6eQ',
    title: 'Kyle Kingsbury (aphyr) - Jepsen: Breaking Distributed Databases',
    channel: 'Strange Loop Conference',
    summary: 'How aphyr used Jepsen to uncover silent data corruption, lost updates, and split-brain states across popular distributed databases.',
    why_hn: 'The most entertaining and terrifying reality check on distributed consensus claims in industry.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'jepsen testing and distributed consistency',
    tags: ['jepsen', 'aphyr', 'split brain', 'consistency', 'databases'],
    categories: [
      { id: 'databases-storage', name: 'Databases & storage', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 25.5,
    hn: { mentions: 56, recommenders: 48, rec_months: 36, strong_recs: 40 },
    thumbnail_url: 'https://i.ytimg.com/vi/yLkW3RzY6eQ/hqdefault.jpg',
    related_incident_ids: ['incident-github-2018-database-partition-split-brain'],
    prevented_outage: 'GitHub (2018) Split-Brain',
    architecture_layer: 'Databases/Storage',
    failure_vector: 'Data Loss & Split-Brain',
    forensic_summary: {
      trap: 'Trusting database marketing claims about "strong consistency" without verifying behavior during simulated network partitions.',
      mental_model: 'Linearizability Verification: every read must return the most recent write in a total global order across all observers.',
      production_rule: 'Run Jepsen-style fault injection tests with simulated packet delay and node pauses before adopting any distributed store.'
    }
  },
  {
    vid: 'LHg6U_ZpQ78',
    url: 'https://www.youtube.com/watch?v=LHg6U_ZpQ78',
    title: 'Theo de Raadt - OpenBSD Security: Pledges, Unveils & Driver Boundaries',
    channel: 'AsiaBSDCon',
    summary: 'Architecting operating systems with least-privilege primitives (pledge, unveil) so compromised processes cannot breach the kernel.',
    why_hn: 'A rigorous defense of defensive engineering and mechanical fault isolation from the OpenBSD founder.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'operating system security and fault isolation',
    tags: ['openbsd', 'kernel', 'security', 'pledge', 'least privilege'],
    categories: [
      { id: 'operating-systems', name: 'Operating systems & kernels', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 21.0,
    hn: { mentions: 29, recommenders: 24, rec_months: 20, strong_recs: 18 },
    thumbnail_url: 'https://i.ytimg.com/vi/LHg6U_ZpQ78/hqdefault.jpg',
    related_incident_ids: ['incident-crowdstrike-2024-bsod-kernel-driver'],
    prevented_outage: 'CrowdStrike (2024) BSOD Kernel Driver',
    architecture_layer: 'Kernel/OS',
    failure_vector: 'Configuration & Human Error',
    forensic_summary: {
      trap: 'Giving software components broad kernel privileges when they only require read access to specific telemetry streams.',
      mental_model: 'Pledge & Unveil: processes explicitly restrict their own future syscall capabilities immediately after initialization.',
      production_rule: 'Daemons and agents must restrict syscall capabilities (e.g. seccomp / pledge) before entering their main event loop.'
    }
  },
  {
    vid: 'x1bXz4Y_5n0',
    url: 'https://www.youtube.com/watch?v=x1bXz4Y_5n0',
    title: 'John Ousterhout - "A Philosophy of Software Design"',
    channel: 'Google Tech Talks',
    summary: 'The nature of software complexity, deep modules with simple interfaces, and why shallow abstractions amplify failure cascades.',
    why_hn: 'Stanford professor John Ousterhout on reducing cognitive load and designing fault-tolerant module boundaries.',
    content_type: 'talk',
    level: 'intermediate',
    shelf_life: 'evergreen',
    primary_topic: 'software design and deep modules',
    tags: ['software design', 'complexity', 'interfaces', 'architecture'],
    categories: [
      { id: 'software-engineering', name: 'Software craft & design', area: 'engineering', area_name: 'Software Engineering' }
    ],
    score: 24.0,
    hn: { mentions: 45, recommenders: 38, rec_months: 30, strong_recs: 30 },
    thumbnail_url: 'https://i.ytimg.com/vi/x1bXz4Y_5n0/hqdefault.jpg',
    related_incident_ids: ['incident-cloudflare-2019-regex-cpu-spike'],
    prevented_outage: 'Cloudflare (2019) Regex CPU Spike',
    architecture_layer: 'Application Runtime',
    failure_vector: 'Concurrency & Deadlocks',
    forensic_summary: {
      trap: 'Shallow modules that expose internal complexity and synchronization mechanisms to upstream callers.',
      mental_model: 'Deep Module Interface: provide powerful functionality through a narrow, impenetrable interface that encapsulates invariants.',
      production_rule: 'A module interface must conceal internal locking, concurrency, and caching details completely from client callers.'
    }
  },
  {
    vid: '7k9_8B1lQ_o',
    url: 'https://www.youtube.com/watch?v=7k9_8B1lQ_o',
    title: 'Adrian Cockcroft - Cloud Architecture: Migrating from Monoliths to Blast-Isolated Cells',
    channel: 'QCon Conference',
    summary: 'Early Netflix architectural transition from monolithic databases to cell-isolated microservices with chaos engineering.',
    why_hn: 'The architectural playbook that established modern fault-tolerant cloud engineering.',
    content_type: 'talk',
    level: 'advanced',
    shelf_life: 'evergreen',
    primary_topic: 'cloud architecture and fault isolation',
    tags: ['chaos engineering', 'cloud architecture', 'blast radius', 'netflix'],
    categories: [
      { id: 'distributed-systems', name: 'Distributed systems', area: 'systems-security', area_name: 'Systems, Networks & Security' }
    ],
    score: 22.0,
    hn: { mentions: 32, recommenders: 27, rec_months: 22, strong_recs: 19 },
    thumbnail_url: 'https://i.ytimg.com/vi/7k9_8B1lQ_o/hqdefault.jpg',
    related_incident_ids: ['incident-netflix-2012-christmas-eve-elb', 'incident-aws-s3-2017-typo-command'],
    prevented_outage: 'AWS S3 (2017) Command Typo',
    architecture_layer: 'Deployment & Infrastructure',
    failure_vector: 'Cascading Failures & Thundering Herds',
    forensic_summary: {
      trap: 'Relying on a single shared cloud region without automated cross-region traffic shifting when upstream providers experience outages.',
      mental_model: 'Chaos Monkey & Failure Injection: constantly terminate nodes in production during business hours to prove self-healing.',
      production_rule: 'Every critical system must participate in automated weekly failure injection exercises in production.'
    }
  }
];
