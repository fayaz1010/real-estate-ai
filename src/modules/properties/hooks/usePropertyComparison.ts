// FILE PATH: src/modules/properties/hooks/usePropertyComparison.ts
// Custom hook for property comparison functionality

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  addToComparison,
  removeFromComparison,
  clearComparison,
  selectComparison,
  selectAllProperties,
} from '../store/propertySlice';

const MAX_COMPARISON_ITEMS = 4;

export const usePropertyComparison = () => {
  const dispatch = useAppDispatch();
  const comparisonIds = useAppSelector(selectComparison);
  const allProperties = useAppSelector(selectAllProperties);

  // Get properties in comparison
  const comparisonProperties = allProperties.filter(p => comparisonIds.includes(p.id));

  // Check if property is in comparison
  const isInComparison = useCallback(
    (propertyId: string) => comparisonIds.includes(propertyId),
    [comparisonIds]
  );

  // Check if comparison is full
  const isComparisonFull = comparisonIds.length >= MAX_COMPARISON_ITEMS;

  // Add property to comparison
  const addToCompare = useCallback(
    (propertyId: string) => {
      if (comparisonIds.length < MAX_COMPARISON_ITEMS && !comparisonIds.includes(propertyId)) {
        dispatch(addToComparison(propertyId));
        return true;
      }
      return false;
    },
    [dispatch, comparisonIds]
  );

  // Remove property from comparison
  const removeFromCompare = useCallback(
    (propertyId: string) => {
      dispatch(removeFromComparison(propertyId));
    },
    [dispatch]
  );

  // Toggle property in comparison
  const toggleComparison = useCallback(
    (propertyId: string) => {
      if (comparisonIds.includes(propertyId)) {
        dispatch(removeFromComparison(propertyId));
        return false;
      } else if (comparisonIds.length < MAX_COMPARISON_ITEMS) {
        dispatch(addToComparison(propertyId));
        return true;
      }
      return false;
    },
    [dispatch, comparisonIds]
  );

  // Clear all comparisons
  const clearAllComparisons = useCallback(() => {
    dispatch(clearComparison());
  }, [dispatch]);

  return {
    comparisonIds,
    comparisonProperties,
    comparisonCount: comparisonIds.length,
    maxComparisons: MAX_COMPARISON_ITEMS,
    isInComparison,
    isComparisonFull,
    addToCompare,
    removeFromCompare,
    toggleComparison,
    clearAllComparisons,
  };
};
