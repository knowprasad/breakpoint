import { Playlist } from '@/lib/userStore';
import curatedData from '@/lib/curatedTracksData.json';
import { HackerTubeVideo } from '@/types/hackertube';

const videos = curatedData as unknown as Record<string, HackerTubeVideo>;

export const PRESEEDED_TRACKS: Playlist[] = [
  {
    id: 'track-distributed-systems',
    name: 'Distributed Systems & Chaos Engineering',
    description: 'Iconic talks on deterministic simulation, conflict resolution, and avoiding cascading thundering herds.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    videos: [
      videos['4fFDFbi3toc'], // Testing Distributed Systems w/ Deterministic Simulation (Will Wilson)
      videos['yCcWpzY8dIA'], // Conflict Resolution for Eventual Consistency (Martin Kleppmann)
      videos['m64SWl9bfvk']  // Stop Rate Limiting! Capacity Management Done Right (Jon Moore)
    ].filter(Boolean)
  },
  {
    id: 'track-kernel-and-os',
    name: 'Linux Kernel & Low-Level Internals',
    description: 'Foundational insights into operating system architecture, process boundaries, and driver fault isolation.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    videos: [
      videos['EY6q5dv_B-o'], // Ken Thompson interviewed by Brian Kernighan
      videos['-zRN7XLCRhc'], // Fork Yeah! The Rise and Development of illumos (Bryan Cantrill)
      videos['o_AIw9bGogo']  // The Tragedy of systemd (Benno Rice)
    ].filter(Boolean)
  },
  {
    id: 'track-database-engines',
    name: 'High-Throughput Storage & Databases',
    description: 'Deep dives into storage engine mechanics, replication safety, and query execution.',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    videos: [
      videos['fU9hR3kiOK0'], // Turning the database inside out (Martin Kleppmann)
      videos['NVl9_6J1G60'], // Managing Multi-Terabyte PostgreSQL (Dan Robinson)
      videos['xNzoerDljjo']  // Parsing from first principles / DFA vs NFA (Saša Jurić)
    ].filter(Boolean)
  }
];
