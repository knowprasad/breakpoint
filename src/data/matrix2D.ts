import { MatrixLayer, MatrixPrimitive, MatrixCellData } from '@/types/matrix';

export const MATRIX_LAYERS: MatrixLayer[] = [
  'Application Runtime',
  'Cache Tier',
  'Database & Storage',
  'Networking & Edge',
  'Deployment & Infrastructure'
];

export const MATRIX_PRIMITIVES: MatrixPrimitive[] = [
  'Resource Exhaustion',
  'Concurrency & Race Conditions',
  'State Corruption & Desync',
  'Network Partitions & Timeouts'
];

export const MATRIX_CELLS: MatrixCellData[] = [
  // 1. Application Runtime
  {
    id: 'cell-app-resource',
    layer: 'Application Runtime',
    primitive: 'Resource Exhaustion',
    patternName: 'Linear-Time DFA (RE2) & Bounded Cgroups',
    shortCode: 'DFA / RE2',
    defensivePattern: {
      name: 'Deterministic Finite Automata & Resource Cgroups',
      headline: 'Guaranteed O(N) evaluation bounds for regular expressions and hard CPU/memory cgroups.',
      mechanism: 'Backtracking NFA engines evaluate expressions with exponential complexity O(2^N) when non-matching strings cause catastrophic path permutations. Thompson DFA engines compile patterns into state transitions where each byte is inspected exactly once.',
      invariant: 'Never evaluate untrusted input with a backtracking regex engine; enforce linear-time RE2 engines and strict cgroup CPU quotas.',
      codeExample: `// Go RE2 Linear-Time Guarantee\nvar safeRegex = regexp.MustCompile(\`^[a-zA-Z0-9_-]+$\`)\n// Matches in strict O(len(input)) time with zero backtracking`
    },
    incidentIds: ['incident-cloudflare-2019-regex-cpu-spike', 'incident-datadog-2023-ebpf-kernel-panic'],
    talkIds: ['xNzoerDljjo', 'FITJMJjASUs']
  },
  {
    id: 'cell-app-concurrency',
    layer: 'Application Runtime',
    primitive: 'Concurrency & Race Conditions',
    patternName: 'Actor Isolation & Bounded Channels',
    shortCode: 'ACTOR / CHAN',
    defensivePattern: {
      name: 'Share Memory by Communicating (Actor Model)',
      headline: 'Isolate mutable state within sequential execution boundaries communicating over bounded channels.',
      mechanism: 'Multi-threaded shared memory with fine-grained mutexes inevitably leads to lock inversion deadlocks and thread starvation under high load. Actor processes process messages sequentially from private mailboxes.',
      invariant: 'Eliminate raw shared mutable state across thread boundaries; use single-writer actor loops and bounded channels.',
      codeExample: `// Bounded channel backpressure\nrequests := make(chan WorkItem, 1000)\nselect {\n  case requests <- item: // accepted\n  default: return ErrServiceOverloaded // fast-fail\n}`
    },
    incidentIds: ['incident-stripe-2020-rate-limiter-cascade', 'incident-therac25-1985-race-condition'],
    talkIds: ['cN_DpYBzKso', 'rI8tNMsozo0']
  },
  {
    id: 'cell-app-state',
    layer: 'Application Runtime',
    primitive: 'State Corruption & Desync',
    patternName: 'Immutable State & Monotonic Clocks',
    shortCode: 'IMMUTABLE / CLOCK',
    defensivePattern: {
      name: 'Functional Immutability & Monotonic Time Verification',
      headline: 'Prevent in-memory mutation drift and clock-skew authentication rejections.',
      mechanism: 'Operating system wall clocks can jump backward during NTP syncs or leap seconds, breaking token expiration logic (nbf/exp). Monotonic time measures elapsed duration without backwards leaps.',
      invariant: 'Use monotonic clock sources (CLOCK_MONOTONIC) for deadlines and token validation windows with ±60s clock skew tolerance.',
      codeExample: `// Token verification with clock-skew leeway\njwt.Verify(token, jwt.WithLeeway(60 * time.Second))`
    },
    incidentIds: ['incident-zoom-2020-leap-second-jwt-clock-skew'],
    talkIds: ['rI8tNMsozo0', '4fFDFbi3toc']
  },
  {
    id: 'cell-app-network',
    layer: 'Application Runtime',
    primitive: 'Network Partitions & Timeouts',
    patternName: 'Context Deadlines & Client Circuit Breakers',
    shortCode: 'DEADLINE / BREAKER',
    defensivePattern: {
      name: 'Distributed Deadline Propagation & Circuit Breakers',
      headline: 'Bounded timeouts that propagate across microservice call trees with automated fast-tripping.',
      mechanism: 'When upstream services delay responses, client threads queue indefinitely, consuming memory and thread pools until the entire application runtime freezes. Deadline propagation cancels downstream work once parent timeouts expire.',
      invariant: 'Every outbound RPC must carry an explicit context deadline; circuit breakers trip to fast-fail if downstream 5xx exceeds 50%.',
      codeExample: `ctx, cancel := context.WithTimeout(parentCtx, 250*time.Millisecond)\ndefer cancel()\nresp, err := client.Fetch(ctx, req)`
    },
    incidentIds: ['incident-aws-s3-2017-typo-command'],
    talkIds: ['m64SWl9bfvk', 'swQbA4zub20']
  },

  // 2. Cache Tier
  {
    id: 'cell-cache-resource',
    layer: 'Cache Tier',
    primitive: 'Resource Exhaustion',
    patternName: 'Probabilistic Early Refresh (XFetch) & TTL Jitter',
    shortCode: 'XFETCH / JITTER',
    defensivePattern: {
      name: 'XFetch Algorithm & Randomized TTL Jitter',
      headline: 'Prevent simultaneous key expiration cascades by staggering refreshes probabilistically.',
      mechanism: 'When high-read keys share identical TTLs, they expire at the same second. The XFetch algorithm computes a probabilistic refresh trigger based on read compute cost and remaining TTL: -beta * delta * ln(rand()).',
      invariant: 'Every cache write MUST apply randomized TTL jitter of ±15-20% and use probabilistic early recomputation.',
      codeExample: `// XFetch Probabilistic Early Expiration\nfunction shouldRefresh(val, ttl, deltaMs, beta = 1.0) {\n  return Date.now() - deltaMs * beta * Math.log(Math.random()) >= ttl;\n}`
    },
    incidentIds: ['incident-shopify-2019-cache-avalanche', 'incident-reddit-2018-k8s-redis-cache-stampede'],
    talkIds: ['m64SWl9bfvk', 'j6ow-UemzBc']
  },
  {
    id: 'cell-cache-concurrency',
    layer: 'Cache Tier',
    primitive: 'Concurrency & Race Conditions',
    patternName: 'Singleflight Mutex & Request Coalescing',
    shortCode: 'SINGLEFLIGHT',
    defensivePattern: {
      name: 'Singleflight In-Flight Request Deduplication',
      headline: 'Collapse duplicate concurrent cache misses into exactly 1 database fetch.',
      mechanism: 'Under thundering herd conditions, 10,000 workers experience a cache miss for the same product key. Singleflight registers an in-flight promise for the key; all concurrent callers wait on that single database query.',
      invariant: 'Wrap all origin database fetches behind a query-level singleflight coalescing group.',
      codeExample: `var g singleflight.Group\nv, err, _ := g.Do("product:123", func() (interface{}, error) {\n    return db.Query("SELECT * FROM products WHERE id=123")\n})`
    },
    incidentIds: ['incident-shopify-2019-cache-avalanche', 'incident-stripe-2020-rate-limiter-cascade'],
    talkIds: ['m64SWl9bfvk', 'j6ow-UemzBc']
  },
  {
    id: 'cell-cache-state',
    layer: 'Cache Tier',
    primitive: 'State Corruption & Desync',
    patternName: 'Change Data Capture (CDC) & Binlog Invalidation',
    shortCode: 'CDC / DEBEZIUM',
    defensivePattern: {
      name: 'Transactional Outbox & CDC Invalidation',
      headline: 'Eliminate dual-write race conditions by tailing the database write-ahead log for cache invalidation.',
      mechanism: 'Applications that write to DB then write to Redis suffer from race conditions when concurrent updates finish out of order. Change Data Capture tails MySQL binlogs or Postgres WAL to emit serial cache invalidations.',
      invariant: 'Never perform application-level dual writes; let database transaction logs drive cache evictions asynchronously.',
      codeExample: `// Debezium / Kafka CDC Consumer\nonBinlogEvent(event) => {\n  redis.del(event.table + ":" + event.primaryKey);\n}`
    },
    incidentIds: ['incident-valve-steam-2015-caching-profile-leak'],
    talkIds: ['NVl9_6J1G60', '7erJ1DV_Tlo']
  },
  {
    id: 'cell-cache-network',
    layer: 'Cache Tier',
    primitive: 'Network Partitions & Timeouts',
    patternName: 'Stale-While-Revalidate & Circuit Breaker',
    shortCode: 'SWR / BYPASS',
    defensivePattern: {
      name: 'Stale-While-Revalidate with Partition Fallback',
      headline: 'Serve stale cached payloads during backend network partitions rather than throwing 504s.',
      mechanism: 'If the cache tier or backend database is unreachable, edge workers return the expired cache value marked with a Warning header while scheduling a background reconnection attempt.',
      invariant: 'Degrade gracefully to stale cached reads rather than failing hard with 504 Gateway Timeouts.',
      codeExample: `headers.set('Cache-Control', 'max-age=60, stale-while-revalidate=86400, stale-if-error=86400');`
    },
    incidentIds: ['incident-shopify-2019-cache-avalanche'],
    talkIds: ['m64SWl9bfvk', '4fFDFbi3toc']
  },

  // 3. Database & Storage
  {
    id: 'cell-db-resource',
    layer: 'Database & Storage',
    primitive: 'Resource Exhaustion',
    patternName: 'Bounded Connection Pool (HikariCP) & Queue Limits',
    shortCode: 'POOL / HIKARI',
    defensivePattern: {
      name: 'Sized Connection Pools with Adaptive Limiting',
      headline: 'Fix database connection pools to hardware limits rather than scaling threads with traffic.',
      mechanism: 'More database connections increase OS context switching and disk spindle thrashing, reducing total throughput. Sizing connection pools to (2 * CPU cores + spindle count) maximizes transactions per second.',
      invariant: 'Connection pool size must be hard-capped and reject excess callers with queue wait timeout (max 250ms).',
      codeExample: `pool.setMaximumPoolSize(Runtime.getRuntime().availableProcessors() * 2 + 1);\npool.setConnectionTimeout(250); // fast-fail`
    },
    incidentIds: ['incident-shopify-2019-cache-avalanche', 'incident-gitlab-2017-database-loss'],
    talkIds: ['m64SWl9bfvk', 'NVl9_6J1G60']
  },
  {
    id: 'cell-db-concurrency',
    layer: 'Database & Storage',
    primitive: 'Concurrency & Race Conditions',
    patternName: 'Optimistic Concurrency Control (OCC) & Fencing Tokens',
    shortCode: 'OCC / FENCING',
    defensivePattern: {
      name: 'Optimistic Concurrency Control with Version Columns',
      headline: 'Prevent lost updates and write-skews without heavy database table lockups.',
      mechanism: 'Pessimistic table locks cause transaction queue explosions. OCC allows reads to proceed without locks; writes include WHERE version = expected_version. If another worker mutated the row, retry with fresh state.',
      invariant: 'Mutations on concurrent shared records must check monotonic version numbers: UPDATE tbl SET v=v+1 WHERE id=? AND v=?',
      codeExample: `UPDATE accounts SET balance = balance - 100, version = version + 1 \nWHERE id = 42 AND version = 5;`
    },
    incidentIds: ['incident-github-2018-database-partition-split-brain'],
    talkIds: ['yLkW3RzY6eQ', '4fFDFbi3toc']
  },
  {
    id: 'cell-db-state',
    layer: 'Database & Storage',
    primitive: 'State Corruption & Desync',
    patternName: 'Write-Ahead Log (WAL) & Automated Daily Restore Drills',
    shortCode: 'WAL / VERIFY',
    defensivePattern: {
      name: 'Continuous WAL Archival with Ephemeral Restore Verification',
      headline: 'A backup does not exist until automated machines restore it and execute checksum queries.',
      mechanism: 'Backups silently break when storage permissions change, cron scripts fail, or replication lags without alerts. Automated restore pipelines spin up ephemeral nodes daily, restore data from S3, and run integrity queries.',
      invariant: 'Automate daily end-to-end restores into ephemeral staging environments; sound P1 alarms on verification failure.',
      codeExample: `// CI Daily Restore Verification Job\npg_restore --clean -d test_db s3://backups/latest.dump\npsql -d test_db -c "SELECT COUNT(*) FROM users;" || alert_p1()`
    },
    incidentIds: ['incident-gitlab-2017-database-loss'],
    talkIds: ['NVl9_6J1G60', 'fNk_zzaMoSs']
  },
  {
    id: 'cell-db-network',
    layer: 'Database & Storage',
    primitive: 'Network Partitions & Timeouts',
    patternName: 'STONITH Node Fencing & Raft Consensus Failover',
    shortCode: 'STONITH / RAFT',
    defensivePattern: {
      name: 'Shoot The Other Node In The Head (STONITH) & Raft Failover',
      headline: 'Eliminate split-brain primary promotions during transient optical WAN partitions.',
      mechanism: 'During network partitions, both sides of a cluster may believe the other is dead and promote dual primaries. STONITH physically cuts power/network to the old primary before promoting the replica.',
      invariant: 'Primary promotion orchestrators must verify >50% majority quorum votes and fence old primaries with STONITH.',
      codeExample: `// Patroni / Raft Leader Election Contract\nif !raftCluster.hasQuorum() { refuseWrite(ErrSplitBrainRisk) }`
    },
    incidentIds: ['incident-github-2018-database-partition-split-brain', 'incident-discord-2022-cassandra-gc-pause-split-brain'],
    talkIds: ['4fFDFbi3toc', 'v6gq5qlY74M', '7erJ1DV_Tlo']
  },

  // 4. Networking & Edge
  {
    id: 'cell-net-resource',
    layer: 'Networking & Edge',
    primitive: 'Resource Exhaustion',
    patternName: 'Stateless SYN Cookies & Token Bucket Ingress',
    shortCode: 'SYN / TOKEN',
    defensivePattern: {
      name: 'SYN Cookie Verification & Token Bucket Ingress Throttling',
      headline: 'Absorb massive volumetric connection attempts without exhausting kernel TCP memory.',
      mechanism: 'SYN flood attacks exhaust the kernel SYN backlog queue before handshakes complete. SYN cookies encode TCP state into initial sequence numbers, requiring zero kernel memory allocation until the final ACK arrives.',
      invariant: 'Enable net.ipv4.tcp_syncookies = 1 on edge hosts; rate-limit client ingress with token bucket algorithms.',
      codeExample: `sysctl -w net.ipv4.tcp_syncookies=1\nsysctl -w net.ipv4.tcp_max_syn_backlog=8192`
    },
    incidentIds: ['incident-cloudflare-2019-regex-cpu-spike'],
    talkIds: ['NGFhc8R_uO4', 'P2TcQ3h0ipQ']
  },
  {
    id: 'cell-net-concurrency',
    layer: 'Networking & Edge',
    primitive: 'Concurrency & Race Conditions',
    patternName: 'BGP Route Flap Dampening & Anycast Balancing',
    shortCode: 'BGP / DAMPEN',
    defensivePattern: {
      name: 'BGP Route Flap Dampening & Monotonic DNS Serials',
      headline: 'Prevent routing oscillations and race conditions across global autonomous systems.',
      mechanism: 'When internet links flap up and down rapidly, BGP routers broadcast flood waves of route recalculations. Route flap dampening assigns penalty points to unstable prefixes, suppressing them until stable.',
      invariant: 'Apply BGP route dampening penalties to unstable paths; enforce monotonic SOA serial numbers on DNS updates.',
      codeExample: `router bgp 65000\n  bgp dampening 15 750 2000 60`
    },
    incidentIds: ['incident-facebook-2021-bgp-routing-blackhole', 'incident-google-2019-bgp-swiss-route-leak'],
    talkIds: ['NGFhc8R_uO4', 'swQbA4zub20']
  },
  {
    id: 'cell-net-state',
    layer: 'Networking & Edge',
    primitive: 'State Corruption & Desync',
    patternName: 'DNSSEC Cryptographic Monitoring & OOB Consoles',
    shortCode: 'DNSSEC / OOB',
    defensivePattern: {
      name: 'Automated Cryptographic Key Rollover & Out-of-Band Networks',
      headline: 'Prevent global DNS blackholes caused by expired RRSIG cryptographic signatures.',
      mechanism: 'If DNSSEC signatures expire, recursive resolvers worldwide reject the entire domain. Automated monitoring checks expiration timestamps 30 days ahead and verifies out-of-band management connectivity.',
      invariant: 'Monitor DNSSEC expiration 30 days ahead; maintain out-of-band serial consoles isolated from public DNS.',
      codeExample: `// Prometheus DNSSEC Expiry Metric Alert\nalert: DNSSECExpiringSoon\nexpr: (dnssec_rrsig_expiry_timestamp - time()) < 86400 * 14\nfor: 1h\nlabels: { severity: "critical" }`
    },
    incidentIds: ['incident-facebook-2021-bgp-routing-blackhole', 'incident-slack-2021-dnssec-expiration'],
    talkIds: ['NGFhc8R_uO4', '4fFDFbi3toc']
  },
  {
    id: 'cell-net-network',
    layer: 'Networking & Edge',
    primitive: 'Network Partitions & Timeouts',
    patternName: 'Multi-Homed BGP Failover & Direct Interconnects',
    shortCode: 'MULTI-HOMED',
    defensivePattern: {
      name: 'Multi-Homed BGP Transit & Direct Physical Peering',
      headline: 'Survive subsea cable cuts and transit provider failures with autonomous route shifting.',
      mechanism: 'Single-transit networks collapse when upstream tier-1 providers experience fiber cuts or routing errors. Multi-homed BGP announces prefixes to multiple providers with BFD (Bidirectional Forwarding Detection).',
      invariant: 'Deploy BFD with sub-second failover across at least 3 geographically distinct transit providers.',
      codeExample: `neighbor 198.51.100.1 fall-over bfd\nbfd interval 300 min_rx 300 multiplier 3`
    },
    incidentIds: ['incident-facebook-2021-bgp-routing-blackhole', 'incident-github-2018-database-partition-split-brain'],
    talkIds: ['NGFhc8R_uO4', '4fFDFbi3toc']
  },

  // 5. Deployment & Infrastructure
  {
    id: 'cell-infra-resource',
    layer: 'Deployment & Infrastructure',
    primitive: 'Resource Exhaustion',
    patternName: 'Cellular Partitioning & Jittered Exponential Backoff',
    shortCode: 'CELL / JITTER',
    defensivePattern: {
      name: 'Cell-Based Architecture & Jittered Client Backoff',
      headline: 'De-synchronize retry waves during cold restarts to prevent harmonic traffic resonance.',
      mechanism: 'When an infrastructure tier recovers from a reboot, synchronized retry loops from millions of clients hammer the initializing instances. Exponential backoff with Full Jitter flattens the retry wave.',
      invariant: 'All SDK and client retry loops MUST use Full Jitter: rand(0, min(cap, base * 2 ^ attempt)).',
      codeExample: `function fullJitterBackoff(attempt, baseMs = 100, capMs = 10000) {\n  const temp = Math.min(capMs, baseMs * Math.pow(2, attempt));\n  return Math.random() * temp;\n}`
    },
    incidentIds: ['incident-aws-s3-2017-typo-command', 'incident-netflix-2012-christmas-eve-elb'],
    talkIds: ['swQbA4zub20', 'm64SWl9bfvk', '7k9_8B1lQ_o']
  },
  {
    id: 'cell-infra-concurrency',
    layer: 'Deployment & Infrastructure',
    primitive: 'Concurrency & Race Conditions',
    patternName: 'Expand-Contract Schema Migrations & Deployment Mutex',
    shortCode: 'EXPAND-CONTRACT',
    defensivePattern: {
      name: 'Expand-Contract Backward-Compatible Migrations',
      headline: 'Prevent rolling-update version mismatches between application code and database schemas.',
      mechanism: 'Rolling deployments run old and new versions concurrently for hours. Breaking schema changes instantly break in-flight pods. Expand-Contract decouples schema changes into 4 non-breaking phases.',
      invariant: 'Every schema migration must be backward-compatible with previous application versions.',
      codeExample: `// Phase 1: Add new column nullable\n// Phase 2: App writes to both old and new columns\n// Phase 3: Backfill old data\n// Phase 4: App reads only new column; drop old column`
    },
    incidentIds: ['incident-uber-2016-postgres-to-schemaless'],
    talkIds: ['NVl9_6J1G60', 'swQbA4zub20']
  },
  {
    id: 'cell-infra-state',
    layer: 'Deployment & Infrastructure',
    primitive: 'State Corruption & Desync',
    patternName: 'Immutable Container Artifacts & Dead Code Elimination',
    shortCode: 'IMMUTABLE / PRUNE',
    defensivePattern: {
      name: 'Hermetic Immutable Deployments & Dead Code Pruning',
      headline: 'Prevent forgotten dormant code execution and configuration drift across server fleets.',
      mechanism: 'Deploying by copying files onto existing machines leaves forgotten server instances running legacy code. Immutable deployments build tamper-evident container images with 100% replacement verification.',
      invariant: 'Mandate immutable image digests; verify 100% of fleet nodes match the target SHA before routing traffic.',
      codeExample: `deploy: image: registry.internal/app@sha256:8f4c28... # pinned digest`
    },
    incidentIds: ['incident-knight-capital-2012-dead-code-deployment', 'incident-atlassian-2022-bad-script-tenant-deletion'],
    talkIds: ['swQbA4zub20', 'rI8tNMsozo0']
  },
  {
    id: 'cell-infra-network',
    layer: 'Deployment & Infrastructure',
    primitive: 'Network Partitions & Timeouts',
    patternName: 'Phased Canary Deployment Rings & Hardware Watchdogs',
    shortCode: 'CANARY / WATCHDOG',
    defensivePattern: {
      name: 'Staged Canary Soak Rings with Automated Rollbacks',
      headline: 'Halt flawed code and configuration pushes on canary hosts before global fleet exposure.',
      mechanism: 'Pushing changes fleet-wide in a single broadcast exposes millions of hosts to catastrophic Bugs. Canary rings deploy changes gradually (Canary -> 1% -> 10% -> 100%) with automated health metric gates.',
      invariant: 'Global releases must require canary soak gates; kernel drivers require local boot-crash watchdogs.',
      codeExample: `canary_pipeline:\n  - stage: internal_canary (soak: 2h)\n  - stage: 1_percent_prod (soak: 4h)\n  - stage: 10_percent_prod (soak: 6h)\n  - stage: 100_percent_prod`
    },
    incidentIds: ['incident-crowdstrike-2024-bsod-kernel-driver', 'incident-datadog-2023-ebpf-kernel-panic'],
    talkIds: ['EY6q5dv_B-o', 'FITJMJjASUs', 'swQbA4zub20']
  }
];

export function getCellData(layer: MatrixLayer, primitive: MatrixPrimitive): MatrixCellData | undefined {
  return MATRIX_CELLS.find((c) => c.layer === layer && c.primitive === primitive);
}
