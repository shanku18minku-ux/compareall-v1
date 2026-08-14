"use client";

import { useState, useEffect } from 'react';
import { LocalStorageManager, SearchHistoryItem, ProviderConnection, CartItem } from '@compareall/storage';
import { LocationContext } from '@compareall/shared-types';

export function useStorage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [location, setLocation] = useState<LocationContext | null>(null);
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncData = () => {
      setHistory(LocalStorageManager.getHistory());
      setLocation(LocalStorageManager.getLocation());
      setPreferences(LocalStorageManager.getPreferences());
      setConnections(LocalStorageManager.getConnections());
      setWishlist(LocalStorageManager.getWishlist());
      setCart(LocalStorageManager.getCart());
      setIsHydrated(true);
    };

    // Load on mount
    syncData();

    // Listen for cross-tab or same-tab custom events
    window.addEventListener('storage', syncData);
    window.addEventListener('storage-updated', syncData);

    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('storage-updated', syncData);
    };
  }, []);

  const dispatchUpdate = () => {
    window.dispatchEvent(new Event('storage-updated'));
  };

  const addSearchHistory = (term: string) => {
    LocalStorageManager.addHistory(term);
    setHistory(LocalStorageManager.getHistory());
    dispatchUpdate();
  };

  const clearSearchHistory = () => {
    LocalStorageManager.clearHistory();
    setHistory([]);
    dispatchUpdate();
  };

  const saveLocation = (loc: LocationContext) => {
    LocalStorageManager.setLocation(loc);
    setLocation(loc);
    dispatchUpdate();
  };

  const updatePreferences = (prefs: Record<string, any>) => {
    LocalStorageManager.updatePreferences(prefs);
    setPreferences(LocalStorageManager.getPreferences());
    dispatchUpdate();
  };

  const connectProvider = (id: string) => {
    LocalStorageManager.connectProvider(id);
    setConnections(LocalStorageManager.getConnections());
    dispatchUpdate();
  };

  const disconnectProvider = (id: string) => {
    LocalStorageManager.disconnectProvider(id);
    setConnections(LocalStorageManager.getConnections());
    dispatchUpdate();
  };

  return {
    isHydrated,
    history,
    location,
    preferences,
    connections,
    wishlist,
    cart,
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
        dispatchUpdate();
      },
      addToCart: (item: Omit<CartItem, 'quantity'>) => {
        LocalStorageManager.addToCart(item);
        setCart(LocalStorageManager.getCart());
        dispatchUpdate();
      },
      removeFromCart: (id: string, providerId: string) => {
        LocalStorageManager.removeFromCart(id, providerId);
        setCart(LocalStorageManager.getCart());
        dispatchUpdate();
      },
      updateCartQuantity: (id: string, providerId: string, quantity: number) => {
        LocalStorageManager.updateCartQuantity(id, providerId, quantity);
        setCart(LocalStorageManager.getCart());
        dispatchUpdate();
      },
      clearCart: () => {
        LocalStorageManager.clearCart();
        setCart([]);
        dispatchUpdate();
      }
    }
  };
}
