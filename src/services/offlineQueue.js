import { MMKVStorage } from './mmkvStorage';
import realDataService from './realDataService';

const QUEUE_STORAGE_KEY = '@lazyeye_offline_therapy_queue';
const MAX_QUEUE_SIZE = 100;
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 2000;

class OfflineSessionQueue {
  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.listeners = new Set();
    this.syncTimer = null;
    this.lastSyncAt = null;
    this.hydrate();
  }

  hydrate() {
    try {
      const raw = MMKVStorage.getString(QUEUE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.queue = parsed;
        }
      }
    } catch (e) {
      this.queue = [];
    }
  }

  persist() {
    try {
      MMKVStorage.set(QUEUE_STORAGE_KEY, JSON.stringify(this.queue.slice(0, MAX_QUEUE_SIZE)));
    } catch (e) {}
    this.notify();
  }

  notify() {
    const stats = this.getStats();
    this.listeners.forEach((fn) => {
      try {
        fn(stats);
      } catch (e) {}
    });
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      this.listeners.add(listener);
      listener(this.getStats());
      return () => this.listeners.delete(listener);
    }
    return () => {};
  }

  getStats() {
    const pending = this.queue.filter((s) => s.status === 'pending' || s.status === 'failed');
    return {
      total: this.queue.length,
      pendingCount: pending.length,
      isSyncing: this.isSyncing,
      lastSyncAt: this.lastSyncAt,
    };
  }

  getQueue() {
    return [...this.queue];
  }

  enqueue({ userId, gameName, score, durationSeconds, playedAt }) {
    if (!userId || !gameName) {
      return { success: false, error: 'Missing userId or gameName' };
    }

    const timestamp = playedAt || new Date().toISOString().replace('T', ' ').substring(0, 19);
    const sessionItem = {
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      userId: Number(userId),
      gameName: String(gameName),
      score: Number(score) || 0,
      durationSeconds: Number(durationSeconds) || 0,
      playedAt: timestamp,
      attempts: 0,
      lastAttemptAt: null,
      status: 'pending',
      error: null,
    };

    this.queue.unshift(sessionItem);
    this.persist();

    try {
      if (realDataService && typeof realDataService.recordSession === 'function') {
        realDataService.recordSession(userId, gameName, score, durationSeconds);
      }
    } catch (e) {}

    setTimeout(() => {
      this.flush();
    }, 100);

    return { success: true, item: sessionItem };
  }

  async flush(apiClient) {
    if (this.isSyncing) return { syncing: true };
    const pending = this.queue.filter((s) => s.status === 'pending' || s.status === 'failed');
    if (pending.length === 0) return { empty: true };

    this.isSyncing = true;
    this.notify();

    let syncedCount = 0;
    const fetchFn = apiClient || (async (endpoint, opts) => {
      const url = `https://lazyeye.onrender.com${endpoint}`;
      const res = await fetch(url, {
        method: opts.method || 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: opts.body,
      });
      return await res.json();
    });

    const now = Date.now();

    for (const item of pending) {
      if (item.attempts > 0 && item.lastAttemptAt) {
        const delay = Math.min(300000, BASE_RETRY_DELAY_MS * Math.pow(2, item.attempts - 1));
        if (now - item.lastAttemptAt < delay) {
          continue;
        }
      }

      if (item.attempts >= MAX_RETRIES) {
        continue;
      }

      item.status = 'syncing';
      item.attempts += 1;
      item.lastAttemptAt = Date.now();

      try {
        const payload = {
          id: item.userId,
          game_name: item.gameName,
          game_score: item.score,
          duration: item.durationSeconds,
          string_score: JSON.stringify({ [item.gameName]: item.score }),
        };

        const result = await fetchFn('/SaveGameRecords', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (result && (result.status === 'success' || result.status === 200 || result.created_at_utc)) {
          item.status = 'synced';
          syncedCount++;
        } else {
          item.status = 'failed';
          item.error = result?.message || 'Server returned invalid response';
        }
      } catch (err) {
        item.status = 'failed';
        item.error = err?.message || 'Network request failed';
      }
    }

    this.queue = this.queue.filter((s) => s.status !== 'synced');
    this.lastSyncAt = new Date().toISOString();
    this.isSyncing = false;
    this.persist();

    return {
      syncedCount,
      remainingCount: this.queue.filter((s) => s.status === 'pending' || s.status === 'failed').length,
    };
  }

  startAutoSync(intervalMs = 30000) {
    this.stopAutoSync();
    this.syncTimer = setInterval(() => {
      this.flush();
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  clearQueue() {
    this.queue = [];
    this.persist();
  }
}

export const offlineQueue = new OfflineSessionQueue();
export default offlineQueue;
