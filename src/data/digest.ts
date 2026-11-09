import { DigestIssue } from '@/types/digest';

export const SAMPLE_DIGEST_ISSUES: DigestIssue[] = [
  {
    id: 'issue-42-wednesday-systems',
    track: 'systems',
    title: 'Autopsy: Shopify 2019 Cache Stampede & The Mathematics of Probabilistic Expiration',
    edition: 'Edition #42 • Wednesday Systems Track',
    date: 'Wednesday Morning ⚡',
    teaser: 'How 500,000 keys expiring at the exact same second brought Shopify checkout to its knees—and how 10 lines of algorithm code eliminate it forever.',
    subject_line: '⚡ [Incident Autopsy] Shopify Midnight Cache Avalanche & The XFetch Solution',
    lead_story: {
      title: 'The Catastrophe of Uniform TTLs',
      headline: 'What happens when 500,000 Redis keys expire at 00:00:00 UTC?',
      body_paragraphs: [
        'At exactly midnight UTC, millions of user sessions across Shopify stores expired. The developers had diligently set session expiration to 24 hours. But because millions of shoppers had browsed throughout the previous evening, their expiration timestamps were rounded or set uniformly.',
        'At 00:00:00 UTC, the cache cliff arrived. Hundreds of thousands of active visitors requested their cart simultaneously. Every single request missed Redis and hit the primary MySQL cluster with identical queries.',
        'Connection pools exploded, thread queues saturated, and CPU spiked to 100% within 40 seconds. Storefronts across North America and Europe threw 504 Gateway Timeouts.',
        'The mathematical antidote is not simply "more Redis memory". It is the XFetch algorithm (VLDB 2015). Instead of waiting for an expiration cliff, compute early expiration probabilistically: compute if (currentTime - delta * beta * ln(rand())) > expiry. Exactly one worker refreshes early in the background while all other workers continue serving the warm cached copy.'
      ],
      deep_takeaway: 'Never set uniform cache TTLs. Always add random jitter (±15-20%) and apply probabilistic early expiration or singleflight request coalescing to protect primary datastores.',
      diagram_box: [
        '┌──────────────────────────────────────────────────────────────┐',
        '│                THE CACHE STAMPEDE CLIFF                      │',
        '│                                                              │',
        '│  Redis Key: [ACTIVE] ────────────────────────► [EXPIRED!]     │',
        '│                                                    │         │',
        '│  Incoming Requests:                                │         │',
        '│  Req 1 ────────────────────────► Cache Miss ───────┤         │',
        '│  Req 2 ────────────────────────► Cache Miss ───────┼──► [DB] │',
        '│  Req 3 ────────────────────────► Cache Miss ───────┤   CPU   │',
        '│  Req 4...10,000 ───────────────► Cache Miss ───────┘   100%  │',
        '└──────────────────────────────────────────────────────────────┘'
      ]
    },
    featured_links: [
      {
        title: 'Designing Data-Intensive Applications (Chapter 3 & 11)',
        type: 'Book Chapter',
        url: '/resources/book-ddia',
        annotation: 'Martin Kleppmann on write amplification, read-through caching, and stampede defenses.'
      },
      {
        title: 'Optimal Probabilistic Cache Stampede Prevention (VLDB Paper)',
        type: 'Academic Paper',
        url: '/resources/paper-cache-stampede-vldb',
        annotation: 'The mathematical proof behind XFetch.'
      },
      {
        title: 'Redis Internals & Event Multiplexing by antirez',
        type: 'Iconic Talk',
        url: '/resources/talk-redis-internals',
        annotation: 'How epoll event loops behave under saturation.'
      }
    ]
  },
  {
    id: 'issue-43-sunday-mindset',
    track: 'mindset',
    title: 'The Architecture of Simplicity: Rich Hickey & The Danger of Complecting',
    edition: 'Edition #43 • Sunday Mindset Track',
    date: 'Sunday Morning 🧠',
    teaser: 'Why senior software architects obsess over simplicity over ease, and how "complecting" causes almost every production disaster.',
    subject_line: '🧠 [Architecture Canon] Rich Hickey on Simple vs Easy & The Root of Failure',
    lead_story: {
      title: 'Simple is Objective. Easy is Subjective.',
      headline: 'The difference between software that lasts 20 years and software that rots in 6 months.',
      body_paragraphs: [
        'In 2011, Rich Hickey delivered "Simple Made Easy" at Strange Loop. Over the past 15 years, it has become the most widely recommended talk on Hacker News for one reason: it names the disease that kills most software projects.',
        'Hickey points to the etymology of "simple" (simplex: one fold or twist) versus "complex" (complect: to braid or weave together). A component is simple if it does one thing, unbound from other concerns. A component is complected when it intertwines state, time, thread identity, and persistence into a single knot.',
        'When you look at history\'s most catastrophic outages—such as Knight Capital\'s $460M bankruptcy in 45 minutes—the root cause was not a complex mathematical error. It was complecting: reusing an old configuration flag that braided deprecated test code with live trading order routing.',
        'Senior engineers resist "easy" (things that are familiar and quick to write in 5 minutes) when it introduces complecting that destroys the system 3 years later.'
      ],
      deep_takeaway: 'Before adding a convenience method or a global flag, ask: "What two things am I braiding together here that could fail independently?" Keep state transitions decoupled from identity.',
      diagram_box: [
        '┌──────────────────────────────────────────────────────────────┐',
        '│                COMPLECTED vs SIMPLE ARCHITECTURE             │',
        '│                                                              │',
        '│  COMPLECTED:                                                 │',
        '│  [State] ───*woven with*───► [Time] ───*woven with*──► [IO]  │',
        '│  (Impossible to test without mocking the universe)           │',
        '│                                                              │',
        '│  SIMPLE:                                                     │',
        '│  [Pure Function]  ◄── Receives Value                         │',
        '│  [Explicit Log]   ◄── Records Transition                     │',
        '│  (Trivially reproducible, testable, and resilient)          │',
        '└──────────────────────────────────────────────────────────────┘'
      ]
    },
    featured_links: [
      {
        title: 'Simple Made Easy (Full Lecture)',
        type: 'Iconic Talk',
        url: '/resources/talk-simple-made-easy',
        annotation: 'Voted #1 most influential tech talk on Hacker News.'
      },
      {
        title: 'Knight Capital 2012 Outage Post-Mortem',
        type: 'Disaster Autopsy',
        url: '/incidents/incident-knight-capital-2012-dead-code-deployment',
        annotation: 'How complecting a configuration flag lost $460M in 45 minutes.'
      },
      {
        title: 'Operating Systems: Three Easy Pieces (Concurrency)',
        type: 'Foundational Book',
        url: '/resources/book-ostep',
        annotation: 'How race conditions and lock inversions manifest when state and threads complect.'
      }
    ]
  }
];
