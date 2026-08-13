export interface SearchHistoryItem {
  id: string;
  term: string;
  timestamp: number;
}

export interface WishlistItem {
  id: string;
  title: string;
  category: string;
  addedAt: number;
}

export type ConnectionStatus = 'not_connected' | 'connecting' | 'connected' | 'expired' | 'error';

export interface ProviderConnection {
  providerId: string;
  status: ConnectionStatus;
  connectedAt: number;
  mockToken?: string;
}

export class LocalStorageManager {
  private static readonly HISTORY_KEY = 'ca_search_history';
  private static readonly WISHLIST_KEY = 'ca_wishlist';
  private static readonly CONNECTIONS_KEY = 'ca_connections';
  private static readonly PREFERENCES_KEY = 'ca_preferences';
  private static readonly LOCATION_KEY = 'ca_location';

  private static get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  // --- Search History ---
  static getHistory(): SearchHistoryItem[] {
    return this.get<SearchHistoryItem[]>(this.HISTORY_KEY, []);
  }

  static addHistory(term: string) {
    if (!term.trim()) return;
    const history = this.getHistory();
    // Remove duplicates
    const filtered = history.filter(h => h.term.toLowerCase() !== term.toLowerCase());
    filtered.unshift({ id: Date.now().toString(), term, timestamp: Date.now() });
    // Keep only last 10
    this.set(this.HISTORY_KEY, filtered.slice(0, 10));
  }

  static clearHistory() {
    this.set(this.HISTORY_KEY, []);
  }

  // --- Wishlist ---
  static getWishlist(): WishlistItem[] {
    return this.get<WishlistItem[]>(this.WISHLIST_KEY, []);
  }

  static toggleWishlist(item: { id: string, title: string, category: string }) {
    const list = this.getWishlist();
    const existingIdx = list.findIndex(i => i.id === item.id);
    if (existingIdx >= 0) {
      list.splice(existingIdx, 1); // Remove
    } else {
      list.unshift({ ...item, addedAt: Date.now() }); // Add
    }
    this.set(this.WISHLIST_KEY, list);
  }

  static isInWishlist(id: string): boolean {
    return this.getWishlist().some(i => i.id === id);
  }

  // --- Connections ---
  static getConnections(): ProviderConnection[] {
    return this.get<ProviderConnection[]>(this.CONNECTIONS_KEY, []);
  }

  static connectProvider(providerId: string, status: ConnectionStatus = 'connected') {
    const connections = this.getConnections();
    const existing = connections.find(c => c.providerId === providerId);
    
    if (existing) {
      existing.status = status;
    } else {
      connections.push({
        providerId,
        status,
        connectedAt: Date.now(),
        mockToken: `mock_tok_${Date.now()}` // Privacy by design: NEVER store real passwords
      });
    }
    this.set(this.CONNECTIONS_KEY, connections);
  }

  static disconnectProvider(providerId: string) {
    const connections = this.getConnections();
    this.set(this.CONNECTIONS_KEY, connections.filter(c => c.providerId !== providerId));
  }

  static isConnected(providerId: string): boolean {
    return this.getConnections().some(c => c.providerId === providerId && c.status === 'connected');
  }

  // --- Preferences & Settings ---
  static getPreferences(): Record<string, any> {
    return this.get<Record<string, any>>(this.PREFERENCES_KEY, { theme: 'system' });
  }

  static updatePreferences(prefs: Record<string, any>) {
    const current = this.getPreferences();
    this.set(this.PREFERENCES_KEY, { ...current, ...prefs });
  }

  // --- Location ---
  static getLocation(): any | null {
    return this.get<any | null>(this.LOCATION_KEY, null);
  }

  static setLocation(location: any) {
    this.set(this.LOCATION_KEY, location);
  }
}

