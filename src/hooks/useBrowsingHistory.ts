// FILE PATH: src/hooks/useBrowsingHistory.ts
// Hook for managing user's browsing history without requiring login

import { useState, useEffect, useCallback } from "react";

interface RecentSearch {
  query: string;
  timestamp: number;
  resultCount?: number;
}

interface ViewedProperty {
  id: string;
  title: string;
  price: number;
  image: string;
  timestamp: number;
  listingType: "rent" | "sale";
}

const STORAGE_KEYS = {
  RECENT_SEARCHES: "real_estate_recent_searches",
  VIEWED_PROPERTIES: "real_estate_viewed_properties",
};

const MAX_RECENT_SEARCHES = 10;
const MAX_VIEWED_PROPERTIES = 20;

export const useBrowsingHistory = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [viewedProperties, setViewedProperties] = useState<ViewedProperty[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const searches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      const viewed = localStorage.getItem(STORAGE_KEYS.VIEWED_PROPERTIES);

      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }

      if (viewed) {
        setViewedProperties(JSON.parse(viewed));
      }
    } catch (error) {
      console.error("Error loading browsing history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback(
    (query: string, resultCount?: number) => {
      if (!query.trim()) return;

      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (search) => search.query.toLowerCase() !== query.toLowerCase(),
        );

        const newSearch: RecentSearch = {
          query,
          timestamp: Date.now(),
          resultCount,
        };

        const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

        try {
          localStorage.setItem(
            STORAGE_KEYS.RECENT_SEARCHES,
            JSON.stringify(updated),
          );
        } catch (error) {
          console.error("Error saving recent search:", error);
        }

        return updated;
      });
    },
    [],
  );

  // Save viewed property
  const saveViewedProperty = useCallback(
    (property: {
      id: string;
      title: string;
      price: number;
      image: string;
      listingType: "rent" | "sale";
    }) => {
      setViewedProperties((prev) => {
        const filtered = prev.filter((p) => p.id !== property.id);

        const viewedProperty: ViewedProperty = {
          ...property,
          timestamp: Date.now(),
        };

        const updated = [viewedProperty, ...filtered].slice(
          0,
          MAX_VIEWED_PROPERTIES,
        );

        try {
          localStorage.setItem(
            STORAGE_KEYS.VIEWED_PROPERTIES,
            JSON.stringify(updated),
          );
        } catch (error) {
          console.error("Error saving viewed property:", error);
        }

        return updated;
      });
    },
    [],
  );

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  }, []);

  // Clear viewed properties
  const clearViewedProperties = useCallback(() => {
    setViewedProperties([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.VIEWED_PROPERTIES);
    } catch (error) {
      console.error("Error clearing viewed properties:", error);
    }
  }, []);

  // Clear all history
  const clearAllHistory = useCallback(() => {
    clearRecentSearches();
    clearViewedProperties();
  }, [clearRecentSearches, clearViewedProperties]);

  // Get popular searches from history
  const getPopularSearches = useCallback(() => {
    const searchCounts = recentSearches.reduce(
      (acc, search) => {
        acc[search.query] = (acc[search.query] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query);
  }, [recentSearches]);

  return {
    recentSearches,
    viewedProperties,
    isLoading,
    saveRecentSearch,
    saveViewedProperty,
    clearRecentSearches,
    clearViewedProperties,
    clearAllHistory,
    getPopularSearches,
  };
};

export default useBrowsingHistory;
