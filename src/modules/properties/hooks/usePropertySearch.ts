// FILE PATH: src/modules/properties/hooks/usePropertySearch.ts
// Custom hook for property search with filters

import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchProperties } from "../store/propertySlice";
import {
  setFilters,
  setSearchQuery,
  setSortBy,
  clearFilters,
  selectSearchFilters,
  selectSearchQuery,
  selectSortBy,
  selectFilteredProperties,
} from "../store/searchSlice";
import { SearchFilters, SortOption } from "../types/property.types";

export const usePropertySearch = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectSearchFilters);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const filteredProperties = useAppSelector(selectFilteredProperties);

  // Update search query
  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch],
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  // Update sort option
  const updateSortBy = useCallback(
    (sort: SortOption) => {
      dispatch(setSortBy(sort));
    },
    [dispatch],
  );

  // Clear all filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Perform search with current filters
  const performSearch = useCallback(() => {
    const searchParams = {
      ...filters,
      query: searchQuery,
      sortBy,
    };
    dispatch(fetchProperties(searchParams));
  }, [dispatch, filters, searchQuery, sortBy]);

  // Auto-search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [filters, searchQuery, sortBy, performSearch]);

  return {
    filters,
    searchQuery,
    sortBy,
    filteredProperties,
    updateSearchQuery,
    updateFilters,
    updateSortBy,
    resetFilters,
    performSearch,
  };
};
