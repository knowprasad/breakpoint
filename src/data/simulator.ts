export interface SimulatorScenario {
  id: string;
  title: string;
  company_context: string;
  incident_id: string;
  alert_title: string;
  alert_metrics: string[];
  situation: string;
  options: {
    id: string;
    action: string;
    is_correct: boolean;
    outcome: string;
    lesson: string;
    related_resource_id: string;
  }[];
}

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: 'sim-cache-avalanche',
    title: 'Incident in Progress: Midnight Database Meltdown',
    company_context: 'Global E-Commerce Platform (Black Friday Eve)',
    incident_id: 'incident-shopify-2019-cache-avalanche',
    alert_title: 'CRITICAL ALERT: Primary MySQL CPU at 99.8%, Connection Pool Saturated',
    alert_metrics: [
      'MySQL CPU: 99.8% (Normal: 24%)',
      'Active Connections: 3,980 / 4,000 max',
      'Redis Cache Hit Rate: Dropped from 98.4% to 12.1% at 00:00:00 UTC',
      'Storefront Checkout 504 Errors: 14,200 req/sec'
    ],
    situation: 'It is 00:01:15 UTC. Your phone rings. The database primary is locked at 100% CPU. Redis memory is healthy, but cache hits plunged off a cliff at exactly midnight. Your junior engineer suggests restarting MySQL immediately to clear the connection pool.',
    options: [
      {
        id: 'opt-restart-db',
        action: 'Restart the primary MySQL cluster immediately to terminate active connections.',
        is_correct: false,
        outcome: 'Catastrophe. Restarting the cold database wipes buffer pool cache memory. When it restarts, thousands of waiting web workers flood the cold instance, crashing it again in a permanent reboot storm.',
        lesson: 'Never reboot a saturated database without first throttling or shedding incoming traffic at the ingress layer.',
        related_resource_id: 'book-google-sre'
      },
      {
        id: 'opt-scale-redis',
        action: 'Add 10 more Redis nodes to the cache cluster.',
        is_correct: false,
        outcome: 'Ineffective. Redis is not out of memory or CPU; the keys expired simultaneously due to uniform 24h TTL. More Redis nodes still have 0 keys in them.',
        lesson: 'Scaling cache capacity does not cure cache stampedes caused by simultaneous key expiration.',
        related_resource_id: 'talk-redis-internals'
      },
      {
        id: 'opt-throttle-and-jitter',
        action: 'Throttle traffic at edge proxy, warm critical session caches via singleflight coalescing, and hot-patch application TTL with ±20% randomized jitter.',
        is_correct: true,
        outcome: 'Success! Throttling traffic at the edge gives MySQL breathing room to clear its connection backlog. Singleflight request coalescing collapses duplicate queries into 1 DB read, and TTL jitter staggers future expirations across time.',
        lesson: 'Cache Stampede prevention requires TTL jitter, request coalescing (singleflight), and probabilistic early expiration (XFetch).',
        related_resource_id: 'paper-cache-stampede-vldb'
      }
    ]
  },
  {
    id: 'sim-redos-spike',
    title: 'Incident in Progress: Global Edge Proxy CPU Freeze',
    company_context: 'Global CDN & Security Edge Network',
    incident_id: 'incident-cloudflare-2019-regex-cpu-spike',
    alert_title: 'P0 OUTAGE: 100% CPU Across All Global Edge Nodes',
    alert_metrics: [
      'Global Edge CPU: 100% across all 200 data centers',
      'HTTP 502 Bad Gateway Rate: 84% of global requests',
      'Network Ingress: Unchanged (No volumetric DDoS attack detected)',
      'Recent Deploy: WAF rule set updated 4 minutes ago'
    ],
    situation: 'At 13:45 UTC, every core in every server in your edge network hit 100% CPU. Traffic volume did not increase. Nginx worker processes are non-responsive to new HTTP requests. The NOC engineer believes you are under a massive SYN flood.',
    options: [
      {
        id: 'opt-block-ips',
        action: 'Enable Under Attack mode and block top 100 ASNs generating incoming traffic.',
        is_correct: false,
        outcome: 'Fails. Legitimate customers are blocked, and edge CPU remains pegged at 100% because existing connections are stuck in CPU busy-loops.',
        lesson: 'Do not mistake algorithmic CPU starvation for a volumetric DDoS attack.',
        related_resource_id: 'book-systems-performance'
      },
      {
        id: 'opt-kill-waf-rule',
        action: 'Trigger the emergency WAF global killswitch to roll back the regex rule deployed 4 minutes ago.',
        is_correct: true,
        outcome: 'Instant recovery! Within 30 seconds of revoking the unanchored backtracking regex rule `.*(?:.*=.*)`, CPU across all edge servers plunges back to 22% baseline and 502 errors drop to zero.',
        lesson: 'Backtracking NFA regular expression engines exhibit exponential runtime O(2^n). Use linear-time DFA engines (RE2) for line-rate inspection.',
        related_resource_id: 'talk-regex-linear-time-cox'
      },
      {
        id: 'opt-restart-nginx',
        action: 'Issue an automated fleet-wide rolling restart of Nginx worker daemons.',
        is_correct: false,
        outcome: 'Failed. As soon as workers restart, the very first HTTP request matches the malformed regex and locks the new worker core into an infinite backtracking loop again.',
        lesson: 'Restarting software running toxic input or bad rules merely shifts the crash point forward by milliseconds.',
        related_resource_id: 'book-intro-to-automata'
      }
    ]
  },
  {
    id: 'sim-split-brain',
    title: 'Incident in Progress: Cross-Country Network Split',
    company_context: 'Developer Hosting & Git Infrastructure',
    incident_id: 'incident-github-2018-database-partition-split-brain',
    alert_title: 'WARNING: 43-Second Optical Fiber Interruption between US-East and US-West',
    alert_metrics: [
      'Heartbeat Loss: US-West lost connection to US-East for 43 seconds',
      'Automated Failover: Orchestrator promoted db-west to PRIMARY',
      'US-East Status: Still online, serving traffic to East Coast customers',
      'Link Status: Optical link has restored, but both clusters are accepting writes'
    ],
    situation: 'A 43-second transatlantic fiber blip caused your failover orchestrator in the West data center to assume the East primary was dead. It promoted the West replica. But the East primary was still alive! The network link is now back, but you now have two independent primary databases taking writes simultaneously.',
    options: [
      {
        id: 'opt-ignore-and-sync',
        action: 'Enable standard MySQL replication from West back to East without inspection.',
        is_correct: false,
        outcome: 'Catastrophic data corruption! Because both servers assigned sequential auto-increment IDs to new rows, tables now have conflicting duplicate IDs. Foreign keys point to wrong users and repositories.',
        lesson: 'Replication cannot reconcile conflicting auto-increment keys after a split-brain without data corruption.',
        related_resource_id: 'book-ddia'
      },
      {
        id: 'opt-fence-and-pause',
        action: 'Immediately fence (halt writes) on both databases, put platform in maintenance mode, and perform binlog differential reconciliation.',
        is_correct: true,
        outcome: 'Saves data integrity! Halting incoming writes prevents further row collision. Engineers extract binary logs from both sides, detect diverging transactions, and cleanly replay them in strict causal order.',
        lesson: 'Automated failover must enforce quorum fencing (STONITH / Raft) before promoting a replica to prevent dual-writer split brain.',
        related_resource_id: 'paper-raft-consensus'
      },
      {
        id: 'opt-drop-west',
        action: 'Immediately terminate the West database and revert all changes made to it.',
        is_correct: false,
        outcome: 'Data loss! West-coast users will permanently lose 45 minutes of pushed code, comments, and deployment credentials.',
        lesson: 'Never silently discard committed transactions during split-brain resolution without auditing the delta.',
        related_resource_id: 'talk-martin-kleppmann-crdt'
      }
    ]
  },
  {
    id: 'sim-crowdstrike-kernel-bsod',
    title: 'Incident in Progress: Ring 0 Crash Loop & Global Host Paralyzation',
    company_context: 'Global Endpoint Detection & Response (EDR) Fleet',
    incident_id: 'incident-crowdstrike-2024-bsod-kernel-driver',
    alert_title: 'CRITICAL ALERT: 8.5M Enterprise Windows Hosts in BSOD Crash Loop (BugCheck 0x50)',
    alert_metrics: [
      'Affected Endpoints: ~8.5 million enterprise Windows machines worldwide',
      'Kernel BugCheck Code: 0x00000050 (PAGE_FAULT_IN_NONPAGED_AREA)',
      'Failing Module: C-00000291*.sys / CSAgent.sys at Ring 0',
      'Fleet Reachability: 0% ICMP / RDP / WinRM reachable (Hosts crash before network stack)'
    ],
    situation: 'At 04:09 UTC, an automated Channel File 291 content update deployed to the CSAgent.sys endpoint driver. Due to an out-of-bounds memory pointer read in the kernel driver, millions of Windows workstations, hospital monitors, airline booking systems, and banking terminals worldwide are crashing into a blue screen (BSOD) reboot loop. Remote management tools cannot reach hosts because the crash occurs before network initialization.',
    options: [
      {
        id: 'opt-crowdstrike-ota-push',
        action: 'Push an urgent over-the-air (OTA) revert channel update to replace Channel File 291 with valid content.',
        is_correct: false,
        outcome: 'Trap! Blue-screened machines crash during early kernel driver initialization before the Windows network stack or EDR agent service can start. Over-the-air updates cannot reach hosts that cannot boot to network.',
        lesson: 'Kernel-space software failure domains cannot be repaired via in-band OTA network channels if the host crashes before network stack initialization.',
        related_resource_id: 'book-ostep'
      },
      {
        id: 'opt-crowdstrike-disable-defender',
        action: 'Disable Windows Defender and endpoint security services globally across Active Directory Group Policy.',
        is_correct: false,
        outcome: 'Ineffective and dangerous. The crash is triggered by the third-party CSAgent.sys kernel driver, not Windows Defender. Furthermore, domain controllers and clients cannot process Group Policy updates while locked in reboot loops.',
        lesson: 'Never disable core OS platform defenses when the root cause resides in a third-party kernel driver module.',
        related_resource_id: 'book-ostep'
      },
      {
        id: 'opt-crowdstrike-safemode-recovery',
        action: 'Boot into Safe Mode with BitLocker recovery keys, delete CSAgent.sys, and mandate boot watchdogs for future updates.',
        is_correct: true,
        outcome: 'Recovery achieved! Booting into Safe Mode prevents CSAgent.sys from initializing, allowing administrators and automated WinRE recovery scripts to delete the corrupt Channel 291 file. Mandating staged ring-based canaries and boot-cycle watchdogs ensures future driver updates roll back automatically if a machine fails to boot.',
        lesson: 'Ring 0 kernel extensions must use rigorous canary rollout gates, input fuzzing on config files, and automatic safe-mode rollback watchdogs.',
        related_resource_id: 'book-ostep'
      }
    ]
  },
  {
    id: 'sim-gitlab-db-loss',
    title: 'Incident in Progress: Secondary Replication Lag & Database Directory Deletion',
    company_context: 'Developer Platform & Source Code Management (GitLab)',
    incident_id: 'incident-gitlab-2017-database-loss',
    alert_title: 'CRITICAL ALERT: PostgreSQL Secondary Replication Lag at 40GB, pg_basebackup Hanging',
    alert_metrics: [
      'PostgreSQL WAL Lag: 40 GB and rising rapidly under write load',
      'pg_basebackup Status: Hanging / blocked on transaction lock for >45 min',
      'Replica Storage: /var/lib/postgresql/data at 91% capacity',
      'Primary Database CPU: 96% with query queue saturation'
    ],
    situation: 'It is 22:00 UTC. The secondary PostgreSQL database has fallen severely behind primary replication. An automated pg_basebackup was triggered to resync the replica, but it hung and locked up. A fatigued on-call engineer wants to wipe /var/lib/postgresql/data on what appears to be the secondary terminal to start a clean sync from scratch.',
    options: [
      {
        id: 'opt-gitlab-force-failover',
        action: 'Terminate the PostgreSQL primary instance immediately to force an automated failover to the secondary replica.',
        is_correct: false,
        outcome: 'Catastrophic data loss. The replica is lagging by 40GB of un-replayed WAL logs. Promoting an out-of-sync replica permanently drops 40GB of customer commits, issues, and production merge requests.',
        lesson: 'Never initiate an uncontrolled failover to a replica that suffers from extreme replication lag without reconciling the WAL gap.',
        related_resource_id: 'book-google-sre'
      },
      {
        id: 'opt-gitlab-rm-rf',
        action: 'Run rm -rf /var/lib/postgresql/data on what seems like the secondary without verifying hostname.',
        is_correct: false,
        outcome: 'Total catastrophic disaster! The engineer was logged into db1.cluster (the live primary!), not db2.cluster. Approximately 300GB of live production customer data is deleted in seconds, and backup scripts are discovered to have failed silently for weeks.',
        lesson: 'Destructive CLI operations require hostname banners, automated safety wrappers, and read-only credentials on production primary clusters.',
        related_resource_id: 'book-continuous-delivery-humble'
      },
      {
        id: 'opt-gitlab-pause-and-verify',
        action: 'Pause traffic at HAProxy, verify server hostname and IP, kill stalled pg_basebackup lock, and verify automated WAL backup restore pipeline.',
        is_correct: true,
        outcome: 'Crisis averted! Pausing traffic relieves database saturation without dropping data. Hostname verification prevents the primary deletion disaster, killing the dead lock allows replication to catch up cleanly, and backup pipelines are verified.',
        lesson: 'Backups do not exist unless automated daily restoration drills verify them; production state changes must verify terminal execution context.',
        related_resource_id: 'book-continuous-delivery-humble'
      }
    ]
  },
  {
    id: 'sim-aws-s3-typo',
    title: 'Incident in Progress: Maintenance Script Typo & Regional S3 Subsystem Cold Reboot',
    company_context: 'Global Cloud Infrastructure Provider (AWS US-EAST-1)',
    incident_id: 'incident-aws-s3-2017-typo-command',
    alert_title: 'P0 SYSTEM OUTAGE: S3 Index and Placement Subsystems Offline in US-EAST-1',
    alert_metrics: [
      'S3 GET/PUT Availability: Dropped to 0.0% in us-east-1',
      'Dependent Service Cascades: EC2, Lambda, EBS, and console failing health checks',
      'Subsystem Capacity: Index servers deprovisioned exceeds intended quota by 10x',
      'Retry Request Volume: Exponential retry storm peaking at 4.8M req/sec'
    ],
    situation: 'An authorized operational maintenance script executed to deprovision a small number of servers in the S3 billing system was entered with erroneous parameters, accidentally terminating critical servers in the S3 Index Subsystem. S3 is completely down in US-EAST-1. Millions of cloud applications worldwide are failing.',
    options: [
      {
        id: 'opt-s3-restart-region',
        action: 'Restart the entire Northern Virginia region simultaneously to force immediate global reconciliation.',
        is_correct: false,
        outcome: 'Total deadlock. Hundreds of thousands of cold microservices and dependent subsystems boot simultaneously, colliding on authorization endpoints and network backplanes, prolonging the outage for days.',
        lesson: 'Massive-scale cloud distributed systems cannot withstand simultaneous global cold boots without strict dependency ordering.',
        related_resource_id: 'paper-dynamo-amazon'
      },
      {
        id: 'opt-s3-dns-blackhole',
        action: 'Manually edit public DNS records to blackhole traffic for 6 hours.',
        is_correct: false,
        outcome: 'Prolongs downtime and pollutes external DNS caches worldwide with long TTLs, preventing seamless client recovery once backend subsystems return.',
        lesson: 'DNS blackholing is an uncoordinated blunt instrument that creates unpredictable propagation delays across the internet.',
        related_resource_id: 'paper-dynamo-amazon'
      },
      {
        id: 'opt-s3-cellular-partition',
        action: 'Partition fleet into isolated failure domains (cells) and restart index subsystems in rate-limited batches with circuit breakers.',
        is_correct: true,
        outcome: 'Controlled recovery succeeds! Rate-limiting the restart of index placement nodes allows metadata caches and partition maps to reconstruct without thrashing, while admission control rejects pounding client retries until health stabilizes.',
        lesson: 'Cellular architecture and rigorous rate-limited cold-start procedures are critical to prevent thundering herd recovery failures in core storage systems.',
        related_resource_id: 'paper-dynamo-amazon'
      }
    ]
  },
  {
    id: 'sim-stripe-ratelimit',
    title: 'Incident in Progress: Distributed Rate Limiter Memory Avalanche',
    company_context: 'Global Payments Gateway (Stripe)',
    incident_id: 'incident-stripe-2020-rate-limiter-cascade',
    alert_title: 'CRITICAL ALERT: Redis Rate Limiter Cluster at 100% Memory, API Gateway Queuing',
    alert_metrics: [
      'Redis Memory Utilization: 100% maxmemory reached (OOM command rejection)',
      'API Gateway P99 Latency: Spiked from 18ms to 4,200ms',
      'Web Worker Concurrency: 100% saturated with blocked HTTP threads',
      'Card Processing Error Rate: 38% 500/504 errors on /v1/charges'
    ],
    situation: 'A sudden surge in bot traffic combined with an analytics feature has filled the Redis rate limiting cluster to its memory ceiling. Redis nodes are failing health checks and evicting keys frantically. API web workers are synchronously blocked waiting for rate limiter Redis responses, causing payment requests to queue and time out.',
    options: [
      {
        id: 'opt-stripe-double-workers',
        action: 'Double web worker thread count across all API servers to process queued HTTP requests faster.',
        is_correct: false,
        outcome: 'Worsens collapse. Adding more worker threads increases concurrent connections to the already struggling Redis cluster, blowing through socket limits and inducing full kernel thrashing on database backends.',
        lesson: 'Increasing concurrency on saturated dependencies accelerates downstream resource exhaustion.',
        related_resource_id: 'book-release-it-nygard'
      },
      {
        id: 'opt-stripe-bypass-all',
        action: 'Temporarily bypass all rate limiting and let backend services take unmetered traffic.',
        is_correct: false,
        outcome: 'Immediate backend financial core failure! Without rate limiting, the malicious bot swarm and card testers overwhelm backend acquiring banking networks, causing card networks to throttle Stripe\'s entire acquiring BIN.',
        lesson: 'Completely disabling protective security mechanisms under load transfers the failure to fragile upstream external partners.',
        related_resource_id: 'book-release-it-nygard'
      },
      {
        id: 'opt-stripe-local-token-bucket',
        action: 'Degrade rate limiter to local in-memory token bucket fallback with adaptive concurrency limits and exponential backoff.',
        is_correct: true,
        outcome: 'Flawless fail-open/fail-local! When Redis is degraded, API gateways fail over to autonomous local in-memory token buckets. Requests proceed with minimal latency, Redis gets time to evict and recover, and payment success rate returns to 99.999%.',
        lesson: 'Critical path services (like rate limiters) must fail-safe to localized degraded state (e.g., local token buckets) and employ circuit breakers (Release It!).',
        related_resource_id: 'book-release-it-nygard'
      }
    ]
  },
  {
    id: 'sim-zoom-jwt-drift',
    title: 'Incident in Progress: Clock Drift & Mass Meeting Disconnection',
    company_context: 'Global Real-Time Video Collaboration (Zoom)',
    incident_id: 'incident-zoom-2020-leap-second-jwt-clock-skew',
    alert_title: 'CRITICAL ALERT: Auth Gateway 401 Unauthorized Spike on Valid User Tokens',
    alert_metrics: [
      'Auth Gateway 401 Error Rate: 62% of all session handshake attempts',
      'Active Video Meetings Dropped: 1.2M concurrent participants',
      'NTP Clock Drift on Edge Fleet: -4.200 seconds relative to UTC',
      'Token Validation Error: \'nbf\' (not before) claim timestamp is in the future'
    ],
    situation: 'At midnight, hundreds of thousands of users are randomly disconnected from active meetings. Client reconnect attempts fail with HTTP 401 Unauthorized. Telemetry shows authentication tokens issued by identity servers are being rejected by edge verification proxies with the error "token not valid yet" due to an unsynchronized NTP server pool causing 4.2s of clock drift.',
    options: [
      {
        id: 'opt-zoom-reissue-keys',
        action: 'Regenerate and deploy new RS256 private keys fleet-wide to force token reissue.',
        is_correct: false,
        outcome: 'Escalates crisis. Regenerating keys invalidates every single active token across all 300 million users worldwide, producing an unprecedented global re-login thundering herd that knocks the identity service offline for hours.',
        lesson: 'Key rotations do not fix timestamp validation logic and induce massive credential re-fetch stampedes.',
        related_resource_id: 'book-tcp-ip-illustrated'
      },
      {
        id: 'opt-zoom-disable-exp',
        action: 'Disable JWT expiration validation entirely in the production edge gateway.',
        is_correct: false,
        outcome: 'Massive security vulnerability. Disabling expiration allows replayed, stolen, and revoked tokens to remain valid indefinitely, exposing user meetings to unauthorized eavesdropping.',
        lesson: 'Never disable cryptographic integrity or expiration invariants as an incident shortcut.',
        related_resource_id: 'book-tcp-ip-illustrated'
      },
      {
        id: 'opt-zoom-clock-skew-leeway',
        action: 'Introduce a 60-second clock skew leeway (tolerance window) to JWT nbf and exp claims and synchronize host NTP daemons.',
        is_correct: true,
        outcome: 'Instant resolution! Adding a 60-second clock drift leeway accommodates standard distributed time divergence without compromising cryptographic security. Resynchronizing NTP daemons restores fleet time consistency, dropping 401 errors back to zero.',
        lesson: 'Distributed systems must never assume synchronized wall clocks without tolerance windows (clock skew leeway) across independently running nodes.',
        related_resource_id: 'book-tcp-ip-illustrated'
      }
    ]
  }
];
