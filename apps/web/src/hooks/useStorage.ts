"use client";

import { useState, useEffect } from 'react';
import { LocalStorageManager, SearchHistoryItem, ProviderConnection } from '@compareall/storage';
import { LocationContext } from '@compareall/shared-types';

export function useStorage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [location, setLocation] = useState<LocationContext | null>(null);
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    // Load all data on mount to avoid SSR hydration mismatch
    setHistory(LocalStorageManager.getHistory());
    setLocation(LocalStorageManager.getLocation());
    setPreferences(LocalStorageManager.getPreferences());
    setConnections(LocalStorageManager.getConnections());
    setWishlist(LocalStorageManager.getWishlist());
    setIsHydrated(true);
  }, []);

  const addSearchHistory = (term: string) => {
    LocalStorageManager.addHistory(term);
    setHistory(LocalStorageManager.getHistory());
  };

  const clearSearchHistory = () => {
    LocalStorageManager.clearHistory();
    setHistory([]);
  };

  const saveLocation = (loc: LocationContext) => {
    LocalStorageManager.setLocation(loc);
    setLocation(loc);
  };

  const updatePreferences = (prefs: Record<string, any>) => {
    LocalStorageManager.updatePreferences(prefs);
    setPreferences(LocalStorageManager.getPreferences());
  };

  const connectProvider = (id: string) => {
    LocalStorageManager.connectProvider(id);
    setConnections(LocalStorageManager.getConnections());
  };

  const disconnectProvider = (id: string) => {
    LocalStorageManager.disconnectProvider(id);
    setConnections(LocalStorageManager.getConnections());
  };

  return {
    isHydrated,
    history,
    location,
    preferences,
    connections,
    wishlist,
    actions: {
      addSearchHistory,
      clearSearchHistory,
      saveLocation,
      updatePreferences,
      connectProvider,
      disconnectProvider,
      toggleWishlist: (item: any) => {
        LocalStorageManager.toggleWishlist({
          id: item.id,
          title: item.title,
          category: item.category,
        });
        setWishlist(LocalStorageManager.getWishlist());
      }
    }
  };
}
