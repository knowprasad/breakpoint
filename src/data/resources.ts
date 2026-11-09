import { LibraryResource } from '@/types/resource';

export const SEEDED_RESOURCES: LibraryResource[] = [
  {
    id: 'book-ddia',
    type: 'book',
    title: 'Designing Data-Intensive Applications',
    creator: 'Martin Kleppmann',
    url: 'https://dataintensive.net/',
    thumbnail_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'distributed-systems',
    tags: ['databases', 'replication', 'consensus', 'transactions', 'partitioning', 'storage-engines'],
    summary: 'The definitive architectural guide to storage engines, distributed consensus, replication lag, and concurrency control in modern backend systems.',
    mental_model_3min: 'All data systems are trade-offs between consistency, availability, latency, and operational complexity. B-Trees optimize for reads at the cost of write amplification; LSM-Trees optimize writes at the cost of compaction overhead. Distributed transactions and two-phase commits fragilely couple nodes, whereas log-centric stream processing and idempotent event sourcing decouple time from state.',
    why_recommended: 'Frequently called "the best engineering book of the 21st century" on Hacker News. It gives engineers the exact vocabulary needed to reason through replication lag, split-brain partitions, and race conditions.',
    pull_quote: {
      text: 'If you read only one technical book in your entire software engineering career, make it Designing Data-Intensive Applications.',
      source: 'Hacker News (Top All-Time Book Recommendation)',
      year: '2023'
    },
    level: 'Intermediate',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Assume networks will partition, clocks will skew, and nodes will pause for GC.',
      'Replication lag means reading your own writes is not guaranteed without session-level consistency.',
      'Always distinguish between at-least-once delivery and exactly-once processing (which requires idempotency keys).',
      'Never rely on wall-clock timestamps for total ordering in distributed transactions.'
    ],
    lindy_score: 98.5,
    related_incident_ids: [
      'incident-gitlab-2017-database-loss',
      'incident-shopify-2019-cache-avalanche',
      'incident-github-2018-database-partition-split-brain',
      'incident-stripe-2020-rate-limiter-cascade',
      'incident-discord-2022-cassandra-gc-pause-split-brain',
      'incident-zoom-2020-leap-second-jwt-clock-skew'
    ]
  },
  {
    id: 'book-ostep',
    type: 'book',
    title: 'Operating Systems: Three Easy Pieces (OSTEP)',
    creator: 'Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'operating-systems-kernel',
    tags: ['virtualization', 'concurrency', 'persistence', 'virtual-memory', 'locks', 'file-systems'],
    summary: 'A masterclass explaining virtualization (CPU and memory), concurrency (threads and condition variables), and persistence (file systems, RAID, and journaling).',
    mental_model_3min: 'The operating system creates the illusion of infinite, private dedicated hardware. Virtual memory maps physical pages through multi-level page tables, and context switches save CPU register state. Concurrency primitives (mutexes, semaphores) prevent race conditions but introduce deadlock risks when lock hierarchies are violated. File systems turn unreliable block devices into structured trees using write-ahead journaling.',
    why_recommended: 'Renowned for its clarity, humor, and depth. It demystifies what happens underneath Linux processes, page faults, and disk I/O.',
    pull_quote: {
      text: 'OSTEP is the gold standard for understanding how software actually talks to silicon and storage hardware.',
      source: 'Lobste.rs Systems Engineering Review',
      year: '2021'
    },
    level: 'Intro',
    shelf_life: 'Classic',
    key_takeaways: [
      'Locks must always be acquired in a globally deterministic order to avoid deadlocks.',
      'Page faults into non-paged memory in kernel mode cause immediate operating system panic (BugCheck 0x50).',
      'Always use fsync() or O_SYNC if your database requires durable disk persistence before acknowledging a write.',
      'Context switches and thread pool overhead grow exponentially once thread count exceeds physical CPU cores.'
    ],
    lindy_score: 95.0,
    related_incident_ids: [
      'incident-crowdstrike-2024-bsod-kernel-driver',
      'incident-datadog-2023-ebpf-kernel-panic'
    ]
  },
  {
    id: 'book-google-sre',
    type: 'book',
    title: 'Site Reliability Engineering: How Google Runs Production Systems',
    creator: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Murphy',
    url: 'https://sre.google/sre-book/table-of-contents/',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'reliability-sre',
    tags: ['error-budgets', 'slos', 'postmortems', 'blameless-culture', 'canarying', 'on-call'],
    summary: 'The operational blueprint that established modern SRE: treating operations as a software problem, managing error budgets, and conducting blameless post-mortems.',
    mental_model_3min: 'Reliability is not 100% uptime; 100% is the wrong target because users cannot distinguish 99.99% from 100% over cellular networks. Instead, establish Service Level Objectives (SLOs) and spend the remaining margin as an "Error Budget" to ship fast. When disasters happen, conduct blameless post-mortems focused on system safeguards rather than human scapegoating.',
    why_recommended: 'Direct insights from Google engineers managing YouTube, Gmail, and Spanner at planet scale.',
    pull_quote: {
      text: 'Hope is not a strategy. The SRE book taught the software industry how to quantify and engineer reliability.',
      source: 'O\'Reilly Media Engineering Forum',
      year: '2019'
    },
    level: 'Intermediate',
    shelf_life: 'Essential',
    key_takeaways: [
      'Every production outage requires an actionable blameless post-mortem.',
      'Error budgets align engineering velocity with business reliability targets.',
      'Eliminate operational toil by capping manual ticket work to under 50% of an engineer\'s time.',
      'Never deploy changes globally all at once; always use progressive canary rollouts.'
    ],
    lindy_score: 93.0,
    related_incident_ids: [
      'incident-gitlab-2017-database-loss',
      'incident-aws-s3-2017-typo-command',
      'incident-netflix-2012-christmas-eve-elb',
      'incident-atlassian-2022-bad-script-tenant-deletion'
    ]
  },
  {
    id: 'talk-redis-internals',
    type: 'talk',
    title: 'Redis Internals: Event Loops, Data Structures & Mechanical Sympathy',
    creator: 'Salvatore Sanfilippo (antirez)',
    url: 'https://www.youtube.com/watch?v=YQhzMmI9A88',
    thumbnail_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'databases-storage',
    tags: ['redis', 'caching', 'event-loop', 'memory-layout', 'thundering-herd'],
    summary: 'A deep-dive by the creator of Redis explaining how a single-threaded epoll event loop outperforms multi-threaded architectures through CPU cache locality and zero-copy data structures.',
    mental_model_3min: 'Redis achieves 100,000+ ops/sec on a single thread because memory latency is orders of magnitude faster than lock synchronization overhead. By avoiding mutexes and context switches, execution time per command is deterministic. However, long-running $O(n)$ commands (like `KEYS *`) will block the single event loop, causing instant cascading client timeouts.',
    why_recommended: 'Teaches developers to think about CPU cache lines, memory allocations, and how event multiplexing works at the operating system socket layer.',
    pull_quote: {
      text: 'Antirez shows that understanding your machine\'s memory hierarchy yields 10x more performance than blindly adding more threads.',
      source: 'Hacker News Architecture Discussions',
      year: '2020'
    },
    level: 'Intermediate',
    shelf_life: 'Classic',
    key_takeaways: [
      'Avoid running O(n) blocking commands (`KEYS`, `FLUSHALL`) on production Redis instances.',
      'Never set uniform cache TTLs without randomized jitter.',
      'Monitor Redis memory fragmentation and latency spikes caused by background fork() BGSAVE commands.',
      'Single-threaded event loops guarantee atomic command execution without race conditions.'
    ],
    lindy_score: 89.0,
    related_incident_ids: [
      'incident-shopify-2019-cache-avalanche',
      'incident-stripe-2020-rate-limiter-cascade'
    ]
  },
  {
    id: 'talk-bryan-cantrill-debugging',
    type: 'talk',
    title: 'Debugging Under Fire: Keep your Head when Systems are Losing Theirs',
    creator: 'Bryan Cantrill',
    url: 'https://www.youtube.com/watch?v=30jNy6U1t3M',
    thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'reliability-sre',
    tags: ['debugging', 'kernel-panics', 'dtrace', 'incident-management', 'observability'],
    summary: 'Bryan Cantrill\'s legendary talk on forensic systems debugging during catastrophic production failures, analyzing real kernel panics and psychological composure under pressure.',
    mental_model_3min: 'During a production crisis, human panic causes more outages than the original bug. The first rule is: form a hypothesis, verify it with non-destructive instrumentation, and test your assumptions before issuing rash commands. Software does not act maliciously; it behaves exactly according to the instructions executed by the CPU registers.',
    why_recommended: 'An electrifying and unforgettable talk combining raw operating system internals with the real psychological realities of being on-call during a catastrophic outage.',
    pull_quote: {
      text: 'Bryan Cantrill is the Hunter S. Thompson of operating systems debugging. Mandatory viewing for every engineer who carries a pager.',
      source: 'Hacker News Video Archive',
      year: '2018'
    },
    level: 'Advanced',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Never reboot or mutate state until you have collected a memory dump or diagnostic evidence.',
      'Instrument systems with dynamic tracing (DTrace / eBPF) that imposes zero overhead when disabled.',
      'Distinguish between proximate triggers and foundational systemic causes in every post-mortem.',
      'Maintain composure and communicate clearly during live incident command bridges.'
    ],
    lindy_score: 91.5,
    related_incident_ids: [
      'incident-crowdstrike-2024-bsod-kernel-driver',
      'incident-datadog-2023-ebpf-kernel-panic'
    ]
  },
  {
    id: 'talk-regex-linear-time-cox',
    type: 'talk',
    title: 'Regular Expression Matching Can Be Simple And Fast (And Safe)',
    creator: 'Russ Cox',
    url: 'https://swtch.com/~rsc/regexp/regexp1.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'traffic-loadbalancing',
    tags: ['regex', 'automata', 'dfa', 'nfa', 'redos', 'algorithms'],
    summary: 'The seminal paper and lecture explaining why traditional PCRE backtracking regular expression engines exhibit exponential runtime O(2^n), and how Thompson NFAs achieve guaranteed linear time O(n).',
    mental_model_3min: 'Backtracking regex matchers (used in Perl, Python, PCRE, and Lua) remember previous branch choices on a call stack. On nested repetitions, non-matching strings cause exponential branch exploration, causing catastrophic backtracking. Ken Thompson\'s 1968 algorithm tracks all active NFA states in parallel, guaranteeing that time complexity scales strictly linearly with input length.',
    why_recommended: 'Directly addresses the exact root cause behind major global outages at Cloudflare and Stack Overflow.',
    pull_quote: {
      text: 'Russ Cox\'s article proves that algorithmic choice can be the difference between microsecond execution and a global 502 outage.',
      source: 'Google Engineering Blog',
      year: '2016'
    },
    level: 'Advanced',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Never execute PCRE or backtracking regexes on untrusted input inside edge proxies or WAFs.',
      'Use DFA-based engines (RE2, Rust regex, Hyperscan) to guarantee linear-time execution.',
      'Avoid unanchored wildcard patterns with nested quantifiers like `.*(?:.*=.*)`.',
      'Always set execution CPU time budgets for regex evaluations in user-facing code paths.'
    ],
    lindy_score: 96.0,
    related_incident_ids: [
      'incident-cloudflare-2019-regex-cpu-spike'
    ]
  },
  {
    id: 'paper-raft-consensus',
    type: 'paper',
    title: 'In Search of an Understandable Consensus Algorithm (Raft)',
    creator: 'Diego Ongaro & John Ousterhout (Stanford University)',
    url: 'https://raft.github.io/raft.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'distributed-systems',
    tags: ['consensus', 'raft', 'paxos', 'leader-election', 'log-replication', 'split-brain'],
    summary: 'The breakthrough paper that made distributed consensus understandable and practical by decomposing it into leader election, log replication, and safety invariants.',
    mental_model_3min: 'Distributed nodes must agree on a sequential log of state changes despite message loss and network partitions. Raft elects a leader with randomized election timers to avoid split votes. The leader accepts client proposals, appends them to its log, and replicates them to followers. An entry is committed only when written to a quorum (strict majority) of nodes, ensuring safety across any partition.',
    why_recommended: 'Adopted across industry leaders (etcd, Kubernetes, CockroachDB, Consul, Kafka KRaft) because it is rigorous yet humanly understandable.',
    pull_quote: {
      text: 'Paxos made distributed systems feel like dark magic. Raft made consensus an engineering discipline anyone can implement.',
      source: 'Stanford CS Faculty Review',
      year: '2014'
    },
    level: 'Intermediate',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'A quorum requires a strict majority: (N/2) + 1 nodes.',
      'Always run consensus clusters with an odd number of voting nodes (3, 5, or 7).',
      'Randomized election timeouts prevent endless split-vote loops during leader elections.',
      'Never promote a database replica without verifying that it holds the latest committed log index.'
    ],
    lindy_score: 97.0,
    related_incident_ids: [
      'incident-github-2018-database-partition-split-brain',
      'incident-discord-2022-cassandra-gc-pause-split-brain'
    ]
  },
  {
    id: 'paper-lamport-clocks-1978',
    type: 'paper',
    title: 'Time, Clocks, and the Ordering of Events in a Distributed System',
    creator: 'Leslie Lamport',
    url: 'https://lamport.azurewebsites.net/pubs/time-clocks.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'distributed-systems',
    tags: ['logical-clocks', 'causality', 'distributed-systems', 'partial-ordering', 'lamport-timestamps'],
    summary: 'The foundational computer science paper that introduced the concept of causality, partial ordering (happened-before relation), and logical timestamps in distributed systems.',
    mental_model_3min: 'In distributed computing, physical wall clocks can never be perfectly synchronized across multiple machines due to relativistic physics, quartz crystal drift, and variable network latency. Therefore, physical timestamps cannot establish which event caused another. Lamport introduced logical clocks: monotonically increasing integer counters incremented on events and synchronized on message passing.',
    why_recommended: 'The most cited paper in distributed computing history. It won Leslie Lamport the Turing Award and forms the conceptual root of all modern distributed databases.',
    pull_quote: {
      text: 'Once you read Lamport\'s 1978 paper, you will never trust System.currentTimeMillis() in a distributed system again.',
      source: 'Communications of the ACM Retrospective',
      year: '2020'
    },
    level: 'Advanced',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Physical wall clocks drift continuously; never use them to determine causal ordering.',
      'The "happened-before" relation (→) defines causality independent of physical time.',
      'Always allow a clock-skew buffer when validating time-based security tokens or assertions.',
      'Logical and vector clocks preserve causality across distributed nodes without physical synchronization.'
    ],
    lindy_score: 99.0,
    related_incident_ids: [
      'incident-zoom-2020-leap-second-jwt-clock-skew'
    ]
  },
  {
    id: 'talk-simple-made-easy',
    type: 'talk',
    title: 'Simple Made Easy',
    creator: 'Rich Hickey',
    url: 'https://www.youtube.com/watch?v=SxdOUGdseq4',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'system-architecture',
    tags: ['software-design', 'complexity', 'simplicity', 'architecture', 'functional-programming'],
    summary: 'Rich Hickey\'s masterwork separating "simple" (unentangled, doing one thing) from "easy" (familiar, near at hand), showing how complexity ruins software over time.',
    mental_model_3min: 'Simple comes from simplex (one braid/fold). Complect means to braid together. When we entangle state, time, threads, and data representations into monolithic abstractions, we introduce hidden bugs that no unit test can catch. By decoupling state changes from identity through immutability, systems remain comprehensible, debuggable, and reliable.',
    why_recommended: 'Regularly voted the #1 most influential software engineering talk of all time on Hacker News. It fundamentally changes how developers design software systems.',
    pull_quote: {
      text: 'Simple Made Easy should be shown to every freshman computer science student on day one.',
      source: 'Hacker News Community Poll',
      year: '2022'
    },
    level: 'Intro',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Simplicity is an objective quality: doing one thing without complecting responsibilities.',
      'Familiarity is subjective: what is "easy" now often creates disastrous accidental complexity later.',
      'Immutable data structures eliminate entire classes of concurrent data races.',
      'Separate constructs: decouple state from time, identity from value.'
    ],
    lindy_score: 99.5,
    related_incident_ids: [
      'incident-knight-capital-2012-dead-code-deployment',
      'incident-atlassian-2022-bad-script-tenant-deletion'
    ]
  },
  {
    id: 'talk-exponential-backoff-jitter',
    type: 'talk',
    title: 'Exponential Backoff and Jitter: The Physics of Avoiding Thundering Herds',
    creator: 'Marc Brooker (VP & Distinguished Engineer, AWS)',
    url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/',
    thumbnail_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'distributed-systems',
    tags: ['backoff', 'jitter', 'retry-storms', 'networking', 'load-balancing'],
    summary: 'The mathematical proof demonstrating why standard exponential backoff without randomized jitter synchronizes client retries into destructive harmonic waves.',
    mental_model_3min: 'When a downstream service slows down or drops a connection, clients retry. If retries use pure exponential backoff (e.g., 1s, 2s, 4s, 8s), all failing clients retry at the exact same synchronized intervals, creating violent waves of traffic (harmonic resonance). Adding "Full Jitter" (randomizing between 0 and exponential ceiling) flattens request volume, allowing degraded servers to safely recover.',
    why_recommended: 'A short, mathematically rigorous classic from the chief architect behind AWS DynamoDB and Lambda.',
    pull_quote: {
      text: 'Adding full jitter to retries is a one-line code change that prevents multi-million dollar outages.',
      source: 'AWS Architecture Series',
      year: '2019'
    },
    level: 'Intro',
    shelf_life: 'Essential',
    key_takeaways: [
      'Never implement exponential backoff without full randomized jitter.',
      'Full Jitter formula: sleep = rand(0, min(cap, base * 2 ^ attempt)).',
      'Set hard limits on maximum retry attempts; unbounded retries amplify failure storms.',
      'Combine jittered retries with circuit breakers to fast-fail traffic when error rates spike.'
    ],
    lindy_score: 94.0,
    related_incident_ids: [
      'incident-aws-s3-2017-typo-command',
      'incident-netflix-2012-christmas-eve-elb'
    ]
  },
  {
    id: 'course-cs144-networking',
    type: 'course',
    title: 'Stanford CS144: Introduction to Computer Networking',
    creator: 'Nick McKeown & Keith Winstein (Stanford University)',
    url: 'https://cs144.github.io/',
    thumbnail_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'networking-bgp',
    tags: ['tcp-ip', 'routing', 'bgp', 'congestion-control', 'packet-switching', 'dns'],
    summary: 'Students build a complete user-space TCP stack and internet router from scratch in C++, mastering sliding windows, congestion control, BGP route advertisements, and DNS.',
    mental_model_3min: 'The internet is a best-effort packet-switched network without centralized control. TCP provides the abstraction of a reliable byte stream over unreliable IP datagrams through sequence numbers, acknowledgments, sliding windows, and congestion control (Tahoe, Reno, BBR). Border Gateway Protocol (BGP) glues independent autonomous systems (AS) together via path-vector route exchange, vulnerable to route leaks and blackholes.',
    why_recommended: 'Hands-down the finest practical networking curriculum on earth. Building TCP from scratch permanently cements how packets, retransmissions, and flow control behave.',
    pull_quote: {
      text: 'Once you write your own TCP state machine in CS144, network latency and socket timeouts make complete physical sense.',
      source: 'Stanford Alumni Tech Network',
      year: '2023'
    },
    level: 'Advanced',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'TCP flow control prevents overwhelming the receiver; congestion control prevents overwhelming the network.',
      'BGP route announcements propagate globally within minutes; an incorrect advertisement can blackhole traffic worldwide.',
      'Always set socket-level SO_RCVTIMEO and SO_SNDTIMEO timeouts to avoid hanging indefinitely.',
      'DNS records are cached recursively; long TTLs prolong the duration of incident recovery.'
    ],
    lindy_score: 96.5,
    related_incident_ids: [
      'incident-facebook-2021-bgp-routing-blackhole',
      'incident-slack-2021-dnssec-expiration'
    ]
  },
  {
    id: 'talk-circuit-breakers-fowler',
    type: 'talk',
    title: 'Circuit Breaker & Bulkhead Patterns in Resilient Distributed Systems',
    creator: 'Martin Fowler',
    url: 'https://martinfowler.com/bliki/CircuitBreaker.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'distributed-systems',
    tags: ['circuit-breaker', 'bulkhead', 'resilience', 'fail-fast', 'microservices'],
    summary: 'The canonical formulation of software circuit breakers (Closed -> Open -> Half-Open) and bulkheads to stop cascading failures across distributed microservices.',
    mental_model_3min: 'When an upstream service fails or slows down, continuing to send requests exhausts client worker threads, saturating thread pools and cascading failure throughout the entire architecture. A circuit breaker tracks failures: when a threshold is breached, the circuit trips Open, instantly failing subsequent calls without waiting for timeouts. Periodically, the circuit transitions to Half-Open to test downstream health.',
    why_recommended: 'Essential reading that prevents secondary dependency failures from taking down the core business platform.',
    pull_quote: {
      text: 'Martin Fowler\'s Circuit Breaker pattern is the most critical firewall against cascading microservice collapse.',
      source: 'ThoughtWorks Technology Radar',
      year: '2019'
    },
    level: 'Intro',
    shelf_life: 'Essential',
    key_takeaways: [
      'Trip the circuit open after a sustained error or latency spike to give downstream services room to heal.',
      'Return cached fallbacks or fail-open defaults when the circuit is open.',
      'Isolate failure domains using the Bulkhead pattern so slow logging or analytics calls cannot starve payment threads.',
      'Monitor circuit breaker state transitions as primary alerts in operations dashboards.'
    ],
    lindy_score: 92.0,
    related_incident_ids: [
      'incident-stripe-2020-rate-limiter-cascade'
    ]
  },
  {
    id: 'talk-dan-luu-postmortems',
    type: 'talk',
    title: 'Post-mortems and What Complex Systems Teach Us About Failure',
    creator: 'Dan Luu',
    url: 'https://danluu.com/postmortem-lessons/',
    thumbnail_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'reliability-sre',
    tags: ['postmortems', 'complex-systems', 'normalization-of-deviance', 'drills', 'failure-modes'],
    summary: 'Dan Luu\'s meticulous synthesis of hundreds of production post-mortems, showing how complex systems fail due to normalization of deviance and unexercised recovery paths.',
    mental_model_3min: 'Most catastrophic outages are not caused by exotic zero-day exploits, but by banal flaws: unexercised backup scripts, configuration typos, silent monitoring failures, and untested failover paths. Organizations gradually accept minor anomalies as normal (normalization of deviance) until an unexpected combination of events triggers complete system collapse.',
    why_recommended: 'A forensic, evidence-based antidote to superficial engineering hype. Dan Luu breaks down real failures with unflinching rigor.',
    pull_quote: {
      text: 'Dan Luu shows that production reliability is not about brilliance—it is about relentless, disciplined hygiene.',
      source: 'Hacker News Frontpage',
      year: '2021'
    },
    level: 'Intermediate',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'If you have not tested your backup restore script this month, you do not have backups.',
      'Beware normalization of deviance: warnings that are routinely ignored become tomorrow\'s P0 outage.',
      'Small configuration changes cause more downtime than major code releases.',
      'Practice disaster recovery drills in staging and production to uncover hidden assumptions.'
    ],
    lindy_score: 93.5,
    related_incident_ids: [
      'incident-gitlab-2017-database-loss',
      'incident-slack-2021-dnssec-expiration'
    ]
  },
  {
    id: 'book-systems-performance',
    type: 'book',
    title: 'Systems Performance: Enterprise and the Cloud',
    creator: 'Brendan Gregg',
    url: 'https://www.brendangregg.com/systems-performance-2nd-edition-book.html',
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'operating-systems-kernel',
    tags: ['linux-internals', 'ebpf', 'profiling', 'flame-graphs', 'cpu-memory-disk', 'latency'],
    summary: 'The authoritative encyclopedia of operating system performance, kernel analysis, CPU scheduling, disk I/O latency, and eBPF profiling by the inventor of Flame Graphs.',
    mental_model_3min: 'Performance analysis is the science of identifying resource saturation and latency bottlenecks using methodologies like USE (Utilization, Saturation, Errors) and RED (Rate, Errors, Duration). Rather than guessing with ad-hoc metrics, profile on-CPU and off-CPU time directly using kernel probes (eBPF, perf) to observe where execution cycles are spent.',
    why_recommended: 'The undisputed bible of Linux performance engineering used daily by Netflix, Intel, and cloud architects.',
    pull_quote: {
      text: 'Brendan Gregg literally invented the Flame Graph. This book will turn you into a kernel performance wizard.',
      source: 'ACM Queue Book Review',
      year: '2022'
    },
    level: 'Advanced',
    shelf_life: 'Classic',
    key_takeaways: [
      'Apply the USE Method for every resource: Check Utilization, Saturation, and Errors.',
      'Differentiate between on-CPU time (busy loops, bad regex) and off-CPU time (blocking locks, disk I/O).',
      'Average latency hides tail latency: always examine p95, p99, and max response distributions.',
      'Kernel panics in Ring 0 are non-recoverable; sandbox low-level inspection with eBPF verifiers.'
    ],
    lindy_score: 97.5,
    related_incident_ids: [
      'incident-crowdstrike-2024-bsod-kernel-driver',
      'incident-datadog-2023-ebpf-kernel-panic'
    ]
  },
  {
    id: 'talk-martin-kleppmann-crdt',
    type: 'talk',
    title: 'CRDTs: The Hard Parts (Conflict-free Replicated Data Types)',
    creator: 'Martin Kleppmann',
    url: 'https://www.youtube.com/watch?v=PM0hbmEb510',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'distributed-systems',
    tags: ['crdt', 'eventual-consistency', 'distributed-state', 'offline-first', 'split-brain'],
    summary: 'Martin Kleppmann analyzes how distributed nodes can concurrently mutate shared state while offline or across network partitions, mathematically converging to identical state without a central coordinator.',
    mental_model_3min: 'Traditional databases resolve multi-master conflicts using locking or "last-write-wins" (which silently drops data based on inaccurate wall clocks). CRDTs structure data so that all concurrent mutations are mathematically commutative, associative, and idempotent (semilattice). As long as all updates eventually reach all nodes in any order, all nodes arrive at the exact same state.',
    why_recommended: 'Crucial for understanding why multi-region active-active architectures struggle with relational databases and how collaborative applications (Figma, Notion) work.',
    pull_quote: {
      text: 'Martin Kleppmann demonstrates the mathematical elegance of distributed convergence without central locks.',
      source: 'Strange Loop Conference',
      year: '2020'
    },
    level: 'Advanced',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Last-Write-Wins (LWW) is a data loss mechanism masquerading as a conflict resolution strategy.',
      'CRDT operations must be mathematically commutative and idempotent to survive out-of-order networks.',
      'Garbage collecting tombstone metadata is the hardest practical challenge in CRDT implementations.',
      'Decouple local write latency from network round-trips by adopting optimistic replication.'
    ],
    lindy_score: 91.0,
    related_incident_ids: [
      'incident-github-2018-database-partition-split-brain'
    ]
  },
  {
    id: 'talk-karpathy-micrograd',
    type: 'talk',
    title: 'Building micrograd from scratch: Backpropagation and Autograd',
    creator: 'Andrej Karpathy',
    url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
    thumbnail_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'machine-learning',
    tags: ['autograd', 'backpropagation', 'neural-networks', 'calculus', 'python'],
    summary: 'Step-by-step implementation of a tiny scalar autograd engine and neural network in ~100 lines of pure Python, demystifying the chain rule and gradient descent.',
    mental_model_3min: 'Neural networks are not mysterious black boxes; they are mathematical expression DAGs (Directed Acyclic Graphs). A forward pass evaluates expressions and computes values. A backward pass traverses the DAG in reverse topological order, applying the chain rule of calculus to accumulate partial derivatives of the loss with respect to each weight.',
    why_recommended: 'Universally acclaimed as the single clearest, most intuitive explanation of neural network calculus and gradient accumulation ever produced.',
    pull_quote: {
      text: 'Karpathy explains the why with pure intuition and builds everything from absolute scratch in front of your eyes.',
      source: 'Hacker News (Top Machine Learning Talk)',
      year: '2022'
    },
    level: 'Intro',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'Every complex AI model decomposes into basic scalar addition, multiplication, and non-linearities.',
      'Backpropagation is simply the recursive application of the calculus chain rule over a DAG.',
      'Always implement the simplest possible mental model before adopting heavy frameworks.',
      'Understand foundational mechanisms at the lowest level to debug higher-level abstractions.'
    ],
    lindy_score: 95.0,
    related_incident_ids: []
  },
  {
    id: 'talk-discord-scylladb-migration',
    type: 'talk',
    title: 'How Discord Stores Trillions of Messages: The ScyllaDB Migration',
    creator: 'Bo Ingram (Senior Staff Engineer, Discord)',
    url: 'https://discord.com/blog/how-discord-stores-trillions-of-messages',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'databases-storage',
    tags: ['scylladb', 'cassandra', 'c++', 'garbage-collection', 'high-throughput', 'latency'],
    summary: 'How Discord migrated from 177 Cassandra nodes to ScyllaDB, dropping p99 latency by 98% and mastering thread-per-core systems architecture.',
    mental_model_3min: 'Garbage collection in managed runtimes (JVM, Go) pauses threads during heap sweeps. When storing trillions of records with heavy mutation churn, GC pauses cause unpredictable latency spikes and false node-failure heartbeats. Adopting an asynchronous, thread-per-core C++ architecture pinned to hardware CPU cores eliminates GC pauses and maximizes hardware IOPS.',
    why_recommended: 'A masterclass in real-world systems scaling at multi-trillion record volume, detailing data migration strategies with zero downtime.',
    pull_quote: {
      text: 'Discord\'s migration post is the gold standard for honest, metrics-driven infrastructure architecture.',
      source: 'Hacker News Frontpage',
      year: '2023'
    },
    level: 'Intermediate',
    shelf_life: 'Essential',
    key_takeaways: [
      'Stop-the-world GC pauses in datastores create false-positive network partition alerts.',
      'Thread-per-core architectures eliminate mutex lock contention across CPU sockets.',
      'Always dual-write and read-verify during large-scale database migrations.',
      'Partition keys must be designed to avoid hot spots in wide-column databases.'
    ],
    lindy_score: 90.0,
    related_incident_ids: [
      'incident-discord-2022-cassandra-gc-pause-split-brain'
    ]
  },
  {
    id: 'paper-cache-stampede-vldb',
    type: 'paper',
    title: 'Optimal Probabilistic Cache Stampede Prevention',
    creator: 'Vattani, Chierichetti, Lowenstein (VLDB 2015)',
    url: 'https://www.vldb.org/pvldb/vol8/p886-vattani.pdf',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    primary_topic: 'databases-storage',
    tags: ['caching', 'xfetch', 'thundering-herd', 'algorithms', 'cache-stampede'],
    summary: 'The mathematical foundation of the XFetch algorithm, proving how probabilistic early recomputation completely eliminates cache stampedes with minimal overhead.',
    mental_model_3min: 'Traditional caches wait until a key expires to recompute it, causing concurrent readers to simultaneously miss and hammer the database (cache stampede). XFetch makes recomputation probabilistic: as a key approaches its expiration time, the probability that an incoming read will proactively recompute the key increases exponentially based on computation cost, ensuring exactly one client refreshes the cache before it ever expires.',
    why_recommended: 'The mathematically optimal solution to the thundering herd problem that took down Shopify and Instagram.',
    pull_quote: {
      text: 'XFetch is one of those rare CS algorithms that is mathematically proven, easy to implement in 10 lines of code, and completely solves a catastrophic production flaw.',
      source: 'VLDB Best Paper Honorable Mention',
      year: '2015'
    },
    level: 'Intermediate',
    shelf_life: 'Evergreen',
    key_takeaways: [
      'XFetch formula: compute if `currentTime - delta * beta * ln(rand()) > expiry`.',
      'Probabilistic early expiration guarantees background refreshing before expiration occurs.',
      'Protects expensive compute queries from sudden cache expiration cliffs.',
      'Requires zero distributed locking or coordination between web workers.'
    ],
    lindy_score: 96.0,
    related_incident_ids: [
      'incident-shopify-2019-cache-avalanche'
    ]
  }
];
