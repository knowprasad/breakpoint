# MASTER PROJECT SPECIFICATION: ProductionCanon (Standalone Platform)
**The Battle-Tested Engineering Library & Production Disaster Encyclopedia**

> **Note on Project Scope:** This is a **completely standalone, full-stack product**. It is NOT an extension or sub-module of `hackertube-digest`. It is a brand-new application with its own dedicated web frontend, backend database, search engine, and integrated email subscription system.

---

## 1. Executive Summary & Architecture

Most developer education only teaches the **"happy path"**—clean code on localhost with zero network latency, zero hardware failure, and single-user traffic. In the real world, senior engineers and system design interviewers judge competence by **"failure imagination"**: *understanding how systems break when things go wrong.*

**ProductionCanon** is a standalone, full-stack engineering platform combining:
1. **The Timeless Technical Library:** The top 1% of talks, books, and courses repeatedly vouched for by senior engineers across 20 years of Hacker News.
2. **The Production Disaster Encyclopedia:** Forensic case studies of famous real-world outages (GitLab, Shopify, Cloudflare, AWS, CrowdStrike), detailing what broke, the underlying computer science mechanism, and the exact mitigation.
3. **Integrated Email Digest System:** A built-in subscription engine directly on the website allowing users to sign up and receive automated bi-weekly digests matching their preferred tracks.

### The Defining Feature: Bidirectional Cross-Linking
* **When reading about a Disaster** (e.g., Shopify's 2019 Cache Avalanche), the interface directly links to the canonical talks and book chapters explaining TTL jitter and cache stampede prevention.
* **When studying a Concept** (e.g., B-Trees or Postgres Write-Ahead Logs), the interface shows real-world incidents where that exact mechanism failed under scale.

---

## 2. The Two Core Pillars

### Pillar 1: The Timeless Technical Library
* **Media Types:** Iconic Conference Talks, Foundational Books (*Designing Data-Intensive Applications*, *SICP*, *Operating Systems: Three Easy Pieces*), and Acclaimed University/Online Courses.
* **Curation Methodology (The Lindy Filter):** Sourced from 20 years of organic recommendations on Hacker News and Lobste.rs. Filtered for persistence over years rather than temporary hype.
* **Every Entry Contains:**
  * **3-Minute Mental Model:** Core thesis in plain English (read in 3 minutes without needing to watch 60 minutes).
  * **Why the Community Loves It:** Real quotes and context from senior practitioners.
  * **Level & Shelf-Life:** (Intro / Intermediate / Advanced; Evergreen).
  * **Key Takeaway Checklist:** Actionable rules to apply to code.

### Pillar 2: The Production Disaster Encyclopedia (Outage War Stories)
* **Scope:** 1,000+ real-world public post-mortems and incident retrospectives.
* **Structured Post-Mortem Schema:**
  * **The Incident Headline:** Company, Date, Duration, and Impact (e.g. *GitLab 2017: 6 hours of database outage and data loss*).
  * **The Trigger:** The immediate human action or code change that sparked the failure.
  * **The Hidden Mechanism (The Deep CS Concept):** The architectural flaw that allowed the trigger to cascade (e.g., *Replication lag, lock contention, thundering herd, split-brain, ReDoS*).
  * **The Mitigation & Defense Rule:** The concrete engineering pattern implemented to ensure it never happens again.
  * **Related Reading:** The specific books, talks, and courses that teach you how to defend against this.

---

## 3. The Bi-Weekly Digest & Notification Engine

Users can subscribe to an ambient, anti-burnout bi-weekly email digest (or self-host via GitHub Actions):
* **Wednesday Morning ⚡ (Systems & Disaster Track):**  
  Deep dive into a real production incident autopsy + the technical mechanism behind it.
* **Sunday Morning 🧠 (Mindset & Library Track):**  
  A timeless book chapter or iconic talk on software architecture, craft, and problem-solving.

---

## 4. Technical Architecture & Recommended Stack

To keep the platform fast, cost-effective, and easy to maintain:

* **Frontend:** **Next.js 15 (App Router)** or **Astro 5** with **Tailwind CSS** and **shadcn/ui**.
* **Database / Content Layer:**
  * Structured JSON Lines (`videos.jsonl`, `books.jsonl`, `incidents.jsonl`) loaded into **SQLite / Turso (libSQL)** or **Supabase (PostgreSQL)**.
* **Search Engine:**
  * Hybrid Search: Fast lexical search (Full-Text Search / SQLite FTS5) + Semantic Vector Search (384-dimensional BGE embeddings for finding concepts without exact keywords).
* **Email Delivery:** Resend API (free tier: 3,000 emails/month) or standard SMTP.
* **Hosting:** Vercel, Cloudflare Workers/Pages, or Netlify (100% free tier eligible).

---

## 5. Unified Data Schemas

### A. Library Resource (`resources.jsonl`)
```json
{
  "id": "talk-karpathy-micrograd",
  "type": "talk",
  "title": "Building micrograd from scratch",
  "creator": "Andrej Karpathy",
  "url": "https://www.youtube.com/watch?v=VMj-3S1tku0",
  "thumbnail_url": "https://i.ytimg.com/vi/VMj-3S1tku0/hqdefault.jpg",
  "primary_topic": "neural-networks",
  "tags": ["backpropagation", "autograd", "python", "machine-learning"],
  "summary": "Step-by-step implementation of backpropagation and autograd engine in Python.",
  "why_recommended": "The single clearest explanation of neural network calculus and gradient accumulation.",
  "pull_quote": {
    "text": "Karpathy explains the why with intuition and builds everything in code.",
    "source": "Hacker News",
    "year": "2022"
  },
  "lindy_score": 21.0,
  "related_incident_ids": []
}
```

### B. Disaster Incident (`incidents.jsonl`)
```json
{
  "id": "incident-shopify-2019-cache-avalanche",
  "title": "Shopify 2019: The Midnight Cache Avalanche",
  "company": "Shopify",
  "year": 2019,
  "service_affected": "Checkout & Primary Database",
  "category": "databases-storage",
  "root_cause_tag": "thundering-herd",
  "trigger": "Simultaneous key expiration of user session keys at midnight without TTL jitter.",
  "mechanism_explanation": "When hundreds of thousands of cached keys expired at the exact same second, subsequent incoming read requests bypassed the cache simultaneously and hit the PostgreSQL primary, overwhelming connection pools and driving CPU to 100%.",
  "mitigation_rule": "Always add random jitter (e.g. ±10% to 15%) to TTL values on caching layers to stagger expirations.",
  "original_postmortem_url": "https://shopify.engineering/...",
  "hn_discussion_url": "https://news.ycombinator.com/item?id=...",
  "related_resource_ids": [
    "talk-redis-internals",
    "book-designing-data-intensive-applications"
  ]
}
```

---

## 6. Phased Implementation Roadmap for the Next Agent

### Phase 1: Foundation & Data Ingestion
1. Initialize project with Next.js (App Router) + Tailwind CSS + shadcn/ui.
2. Ingest the 6,454 curated HackerTube videos (`videos.jsonl`).
3. Seed the initial catalog of 30 iconic CS Books & Courses.
4. Seed the initial collection of 50 famous production post-mortems (Cloudflare, GitLab, Shopify, AWS, Netflix, CrowdStrike).
5. Generate the bidirectional mapping (`resource_id <-> incident_id`).

### Phase 2: Core Web Platform Experience
1. **Interactive Search & Browse:** Instant filtering by Topic, Media Type (Talk/Book/Outage), and Root Cause.
2. **The Incident Card & Detail Page:** Clean, structured breakdown (Trigger $\to$ Mechanism $\to$ Mitigation $\to$ Related Talks).
3. **The Resource Detail Page:** 3-Minute Mental Model + Video Embed + "Famous Failures Linked to This Concept".

### Phase 3: The Bi-Weekly Email Subscriptions
1. Public email signup form on the landing page.
2. Automated scheduler (via Cron / GitHub Actions / Resend) delivering:
   * Wednesday: Outage Disaster Autopsy.
   * Sunday: Timeless Library Talk or Book Chapter.

### Phase 4: Pro / Monetization Features (Future)
1. **System Design Interview Simulator:** Interactive failure mode practice questions.
2. **Stack Pre-Mortem Linter:** Select your tech stack and get a custom report of known failure modes and checklists.

---

## 7. Instructions for the New Antigravity Agent

When you start your new project in Antigravity, hand this specification to the agent with the following prompt:

```markdown
You are the Lead Architect and Full-Stack Product Engineer for "ProductionCanon" (DevCanon).
Read the MASTER_PROJECT_SPEC.md file carefully. 

Your objective is to:
1. Review the data schemas, core pillars (Library + Disaster Encyclopedia), and bidirectional linking requirements.
2. Create an implementation plan breaking down Phase 1 and Phase 2.
3. Scaffold the Next.js application, set up the data models, and build the initial interactive UI with the seeded dataset.
Think thoroughly, design deep and clean modules, and build iteratively.
```
