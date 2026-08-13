export * from "./LocalStorageManager";
import { StorageService } from "../types";

export class WebStorageService implements StorageService {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.warn(`[Storage] Failed to read ${key}:`, e);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[Storage] Quota or Write Error for ${key}:`, e);
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
  }
}
