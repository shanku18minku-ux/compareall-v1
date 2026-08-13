"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationContext as LocationType } from '@compareall/shared-types';

interface LocationContextType {
  location: LocationType | null;
  setLocation: (loc: LocationType | null) => void;
  isLoading: boolean;
  requestDeviceLocation: () => void;
  setManualLocation: (query: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount (Phase 11: Local storage)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_location');
      if (stored) {
        setLocationState(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLocation = (loc: LocationType | null) => {
    setLocationState(loc);
    if (loc) {
      localStorage.setItem('user_location', JSON.stringify(loc));
    } else {
      localStorage.removeItem('user_location');
    }
  };

  const requestDeviceLocation = () => {
    setIsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we'd reverse geocode here to get city/state/pincode
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: 'Current Location'
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const setManualLocation = (query: string) => {
    // In a real app, this would call Google Maps Geocoding API to get lat/lng
    // For now, we mock it
    const isPincode = /^\d+$/.test(query);
    setLocation({
      label: query,
      pincode: isPincode ? query : undefined,
      city: !isPincode ? query : undefined,
      lat: 28.6139, // Default mock lat (New Delhi)
      lng: 77.2090, // Default mock lng
    });
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLoading, requestDeviceLocation, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

