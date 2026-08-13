import { StorageService } from "../types";

export class ExtensionStorageService implements StorageService {
  get<T>(key: string): T | null {
    // Placeholder for chrome.storage.local.get
    console.warn("ExtensionStorageService sync get not fully implemented for:", key);
    return null;
  }

  set<T>(key: string, value: T): void {
    // Placeholder for chrome.storage.local.set
    console.warn("ExtensionStorageService set called for:", key);
  }

  remove(key: string): void {
    // Placeholder for chrome.storage.local.remove
  }

  clear(): void {
    // Placeholder for chrome.storage.local.clear
  }
}
