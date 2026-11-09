import { DisasterIncident, IncidentSeverity } from '@/types/incident';
import { LibraryResource, ResourceType } from '@/types/resource';
import { SEEDED_INCIDENTS } from '@/data/incidents';
import { SEEDED_RESOURCES } from '@/data/resources';

// Internal cached state
let incidentsCache: DisasterIncident[] | null = null;
let resourcesCache: LibraryResource[] | null = null;
let incidentMap: Map<string, DisasterIncident> = new Map();
let resourceMap: Map<string, LibraryResource> = new Map();

/**
 * Initializes and synchronizes bidirectional relationships across Incidents & Resources
 */
function initializeRepository() {
  if (incidentsCache && resourcesCache) {
    return;
  }

  // Deep clone data to avoid side-effects
  const incidents: DisasterIncident[] = JSON.parse(JSON.stringify(SEEDED_INCIDENTS));
  const resources: LibraryResource[] = JSON.parse(JSON.stringify(SEEDED_RESOURCES));

  const incMap = new Map<string, DisasterIncident>();
  const resMap = new Map<string, LibraryResource>();

  incidents.forEach((inc) => {
    inc.related_resource_ids = Array.from(new Set(inc.related_resource_ids || []));
    incMap.set(inc.id, inc);
  });

  resources.forEach((res) => {
    res.related_incident_ids = Array.from(new Set(res.related_incident_ids || []));
    resMap.set(res.id, res);
  });

  // Bidirectional Cross-Link Enforcement
  // 1. Every resource referenced by an incident MUST have that incident in its related_incident_ids
  incidents.forEach((inc) => {
    inc.related_resource_ids.forEach((resId) => {
      const targetResource = resMap.get(resId);
      if (targetResource) {
        if (!targetResource.related_incident_ids.includes(inc.id)) {
          targetResource.related_incident_ids.push(inc.id);
        }
      }
    });
  });

  // 2. Every incident referenced by a resource MUST have that resource in its related_resource_ids
  resources.forEach((res) => {
    res.related_incident_ids.forEach((incId) => {
      const targetIncident = incMap.get(incId);
      if (targetIncident) {
        if (!targetIncident.related_resource_ids.includes(res.id)) {
          targetIncident.related_resource_ids.push(res.id);
        }
      }
    });
  });

  incidentsCache = incidents;
  resourcesCache = resources;
  incidentMap = incMap;
  resourceMap = resMap;
}

// Ensure repository is initialized
initializeRepository();

export function getAllIncidents(): DisasterIncident[] {
  initializeRepository();
  return incidentsCache || [];
}

export function getAllResources(): LibraryResource[] {
  initializeRepository();
  return resourcesCache || [];
}

export function getIncidentById(id: string): DisasterIncident | undefined {
  initializeRepository();
  return incidentMap.get(id);
}

export function getResourceById(id: string): LibraryResource | undefined {
  initializeRepository();
  return resourceMap.get(id);
}

export function getRelatedResourcesForIncident(incidentId: string): LibraryResource[] {
  initializeRepository();
  const incident = incidentMap.get(incidentId);
  if (!incident) return [];
  return incident.related_resource_ids
    .map((rId) => resourceMap.get(rId))
    .filter((r): r is LibraryResource => Boolean(r));
}

export function getRelatedIncidentsForResource(resourceId: string): DisasterIncident[] {
  initializeRepository();
  const resource = resourceMap.get(resourceId);
  if (!resource) return [];
  return resource.related_incident_ids
    .map((iId) => incidentMap.get(iId))
    .filter((i): i is DisasterIncident => Boolean(i));
}

export interface FilterOptions {
  query?: string;
  pillar?: 'all' | 'disasters' | 'library';
  category?: string;
  rootCause?: string;
  severity?: IncidentSeverity | 'all';
  resourceType?: ResourceType | 'all';
  sortBy?: 'relevance' | 'year-desc' | 'year-asc' | 'lindy-desc';
}

export interface SearchResults {
  incidents: DisasterIncident[];
  resources: LibraryResource[];
  totalMatches: number;
}

export function searchAndFilter(options: FilterOptions): SearchResults {
  initializeRepository();

  const query = (options.query || '').trim().toLowerCase();
  const pillar = options.pillar || 'all';
  const category = options.category;
  const rootCause = options.rootCause;
  const severity = options.severity;
  const resourceType = options.resourceType;
  const sortBy = options.sortBy || 'relevance';

  let filteredIncidents = pillar === 'library' ? [] : [...(incidentsCache || [])];
  let filteredResources = pillar === 'disasters' ? [] : [...(resourcesCache || [])];

  // 1. Text Search Filter
  if (query) {
    filteredIncidents = filteredIncidents.filter((inc) => {
      const matchText = [
        inc.title,
        inc.company,
        inc.category,
        inc.root_cause_tag,
        inc.trigger,
        inc.mechanism_explanation,
        inc.mitigation_rule,
        inc.service_affected,
        inc.impact,
        ...inc.checklist_rules
      ].join(' ').toLowerCase();

      return query.split(' ').every((term) => matchText.includes(term));
    });

    filteredResources = filteredResources.filter((res) => {
      const matchText = [
        res.title,
        res.creator,
        res.primary_topic,
        res.summary,
        res.mental_model_3min,
        res.why_recommended,
        res.pull_quote.text,
        ...res.tags,
        ...res.key_takeaways
      ].join(' ').toLowerCase();

      return query.split(' ').every((term) => matchText.includes(term));
    });
  }

  // 2. Category Filter
  if (category && category !== 'all') {
    filteredIncidents = filteredIncidents.filter((inc) => inc.category === category);
    filteredResources = filteredResources.filter((res) => res.primary_topic === category);
  }

  // 3. Root Cause Filter
  if (rootCause && rootCause !== 'all') {
    filteredIncidents = filteredIncidents.filter((inc) => inc.root_cause_tag === rootCause);
    // For resources, match if tagged or linked to an incident with this root cause
    filteredResources = filteredResources.filter((res) => {
      const hasTag = res.tags.includes(rootCause);
      const hasLinkedIncident = res.related_incident_ids.some((incId) => {
        const inc = incidentMap.get(incId);
        return inc?.root_cause_tag === rootCause;
      });
      return hasTag || hasLinkedIncident;
    });
  }

  // 4. Severity Filter (Incidents only)
  if (severity && severity !== 'all') {
    filteredIncidents = filteredIncidents.filter((inc) => inc.severity === severity);
  }

  // 5. Resource Type Filter (Resources only)
  if (resourceType && resourceType !== 'all') {
    filteredResources = filteredResources.filter((res) => res.type === resourceType);
  }

  // 6. Sorting
  if (sortBy === 'year-desc') {
    filteredIncidents.sort((a, b) => b.year - a.year);
  } else if (sortBy === 'year-asc') {
    filteredIncidents.sort((a, b) => a.year - b.year);
  } else if (sortBy === 'lindy-desc') {
    filteredResources.sort((a, b) => b.lindy_score - a.lindy_score);
  }

  return {
    incidents: filteredIncidents,
    resources: filteredResources,
    totalMatches: filteredIncidents.length + filteredResources.length
  };
}

export function getRepositoryStats() {
  initializeRepository();
  const incidents = incidentsCache || [];
  const resources = resourcesCache || [];

  const totalLinks = incidents.reduce((sum, inc) => sum + inc.related_resource_ids.length, 0);
  const avgLindy = Math.round(
    resources.reduce((sum, res) => sum + res.lindy_score, 0) / (resources.length || 1)
  );

  return {
    incidentCount: incidents.length,
    resourceCount: resources.length,
    crossLinkCount: totalLinks,
    averageLindyScore: avgLindy,
    criticalP0Count: incidents.filter((i) => i.severity === 'Critical P0').length,
    p1Count: incidents.filter((i) => i.severity === 'Major P1').length
  };
}

export function getAllCategories(): { slug: string; name: string; count: number }[] {
  initializeRepository();
  const categoriesMap = new Map<string, { name: string; count: number }>();

  const nameMapping: Record<string, string> = {
    'databases-storage': 'Databases & Storage',
    'distributed-systems': 'Distributed Systems',
    'networking-bgp': 'Networking & BGP',
    'operating-systems-kernel': 'OS & Kernel',
    'traffic-loadbalancing': 'Traffic & Load Balancing',
    'reliability-sre': 'Reliability & SRE',
    'system-architecture': 'System Architecture',
    'deployment-ci-cd': 'Deployment & CI/CD',
    'security': 'Security Enclaves',
    'machine-learning': 'Machine Learning'
  };

  [...(incidentsCache || [])].forEach((inc) => {
    const slug = inc.category;
    const current = categoriesMap.get(slug) || {
      name: nameMapping[slug] || slug.replace('-', ' '),
      count: 0
    };
    current.count += 1;
    categoriesMap.set(slug, current);
  });

  [...(resourcesCache || [])].forEach((res) => {
    const slug = res.primary_topic;
    const current = categoriesMap.get(slug) || {
      name: nameMapping[slug] || slug.replace('-', ' '),
      count: 0
    };
    current.count += 1;
    categoriesMap.set(slug, current);
  });

  return Array.from(categoriesMap.entries()).map(([slug, data]) => ({
    slug,
    name: data.name,
    count: data.count
  }));
}

export function getAllRootCauses(): { tag: string; title: string; count: number }[] {
  initializeRepository();
  const rootCauseMap = new Map<string, number>();

  const titleMapping: Record<string, string> = {
    'thundering-herd': 'Thundering Herd (Cache Avalanche)',
    'split-brain': 'Split-Brain & Consensus Partition',
    'redos-catastrophic-backtracking': 'ReDoS (Catastrophic Backtracking)',
    'null-pointer-dereference-c-kernel': 'Kernel Null Pointer & Memory Bounds',
    'cascading-retry-storm': 'Cascading Retry Storms & Harmonic Resonance',
    'dns-bgp-withdrawal': 'DNS BGP Route Withdrawal & Key Expiry',
    'dead-code-deployment': 'Dead Code Execution & Partial Rollout',
    'connection-pool-exhaustion': 'Connection Pool & Thread Starvation',
    'human-operational-and-backup-verification': 'Operational Error & Unexercised Backups',
    'clock-skew-leap-second': 'Clock Skew & Timestamp Drift'
  };

  [...(incidentsCache || [])].forEach((inc) => {
    const tag = inc.root_cause_tag;
    rootCauseMap.set(tag, (rootCauseMap.get(tag) || 0) + 1);
  });

  return Array.from(rootCauseMap.entries()).map(([tag, count]) => ({
    tag,
    title: titleMapping[tag] || tag.replace('-', ' '),
    count
  }));
}
