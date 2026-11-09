import fs from 'fs';
import path from 'path';
import { DigestTrack } from '@/types/digest';

export interface Subscriber {
  email: string;
  track: DigestTrack;
  createdAt: string;
  confirmed: boolean;
  unsubscribed?: boolean;
  source?: string;
  lastDeliveredAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Memory cache fallback for serverless/edge environments where filesystem may be read-only
let memorySubscribers: Subscriber[] = [];

function ensureFileExists(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SUBSCRIBERS_FILE)) {
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Subscribers] Failed to ensure subscribers file, using memory storage:', err);
  }
}

export function getAllSubscribers(): Subscriber[] {
  try {
    ensureFileExists();
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const content = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8');
      const list = JSON.parse(content || '[]');
      if (Array.isArray(list)) {
        memorySubscribers = list;
        return list;
      }
    }
  } catch (err) {
    console.warn('[Subscribers] Could not read subscribers file, falling back to memory store:', err);
  }
  return memorySubscribers;
}

function persistSubscribers(subscribers: Subscriber[]): boolean {
  memorySubscribers = subscribers;
  try {
    ensureFileExists();
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[Subscribers] Failed to write to subscribers file, kept in memory:', err);
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standard pragmatic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function addSubscriber(
  rawEmail: string,
  track: DigestTrack = 'both',
  source: string = 'website'
): { subscriber: Subscriber; isNew: boolean } {
  const email = rawEmail.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new Error('Invalid email address format.');
  }

  const subscribers = getAllSubscribers();
  const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === email);

  if (existingIndex >= 0) {
    const existing = subscribers[existingIndex];
    // Re-subscribe if unsubscribed, or update track if changed
    const updated: Subscriber = {
      ...existing,
      track,
      unsubscribed: false,
      source: source || existing.source,
      confirmed: true
    };
    subscribers[existingIndex] = updated;
    persistSubscribers(subscribers);
    return { subscriber: updated, isNew: false };
  }

  const newSub: Subscriber = {
    email,
    track,
    createdAt: new Date().toISOString(),
    confirmed: true,
    unsubscribed: false,
    source
  };

  subscribers.unshift(newSub);
  persistSubscribers(subscribers);
  return { subscriber: newSub, isNew: true };
}

export function unsubscribeSubscriber(rawEmail: string): boolean {
  const email = rawEmail.trim().toLowerCase();
  const subscribers = getAllSubscribers();
  const idx = subscribers.findIndex((s) => s.email.toLowerCase() === email);
  if (idx >= 0) {
    subscribers[idx].unsubscribed = true;
    persistSubscribers(subscribers);
    return true;
  }
  return false;
}

export function getActiveSubscribersForTrack(track: 'systems' | 'mindset'): Subscriber[] {
  const subscribers = getAllSubscribers();
  return subscribers.filter((s) => {
    if (s.unsubscribed) return false;
    if (s.track === 'both') return true;
    return s.track === track;
  });
}
