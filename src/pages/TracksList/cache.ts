import type { ListTracksPaginationResponseAPI } from "../../features/Track/model";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const TTL = 60_000; // 1 минута

class TracksCache {
  private cache = new Map<
    string,
    CacheEntry<ListTracksPaginationResponseAPI>
  >();

  private key(skip: number, limit: number) {
    return `${skip}:${limit}`;
  }

  get(skip: number, limit: number) {
    const key = this.key(skip, limit);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() - entry.timestamp > TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(skip: number, limit: number, data: ListTracksPaginationResponseAPI) {
    const key = this.key(skip, limit);

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

export const tracksCache = new TracksCache();
