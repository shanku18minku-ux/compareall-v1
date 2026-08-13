export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

export type DataSourceType = "official_api" | "affiliate" | "partner" | "extension" | "public_source" | "demo";

export type CachedData<T> = {
  data: T;
  cachedAt: number;
  expiresAt?: number;
  source: DataSourceType;
};

export const STORAGE_KEYS = {
  LOCATION: "compareall.location",
  PINCODE: "compareall.pincode",
  RECENT_SEARCHES: "compareall.recentSearches",
  RECENT_COMPARISONS: "compareall.recentComparisons",
  FAVORITES: "compareall.favorites",
  PREFERENCES: "compareall.preferences",
  CACHED_RESULTS: "compareall.cachedResults",
  CONNECTIONS: "compareall.connections",
};
