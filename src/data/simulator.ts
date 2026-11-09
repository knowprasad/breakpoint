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
  }
];
