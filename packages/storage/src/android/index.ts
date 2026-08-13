import { StorageService } from "../types";

export class AndroidStorageService implements StorageService {
  get<T>(key: string): T | null {
    // Placeholder for AsyncStorage / SQLite
    console.warn("AndroidStorageService not fully implemented for:", key);
    return null;
  }

  set<T>(key: string, value: T): void {
    // Placeholder for AsyncStorage / SQLite
    console.warn("AndroidStorageService set called for:", key);
  }

  remove(key: string): void {
    // Placeholder for AsyncStorage / SQLite
  }

  clear(): void {
    // Placeholder for AsyncStorage / SQLite
  }
}
