// FILE PATH: src/modules/properties/hooks/useFavorites.ts
// Custom hook for managing favorite properties

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  addToFavorites,
  removeFromFavorites,
  selectFavorites,
  selectAllProperties,
} from '../store/propertySlice';

export const useFavorites = () => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavorites);
  const allProperties = useAppSelector(selectAllProperties);

  // Get favorite properties
  const favoriteProperties = allProperties.filter(p => favoriteIds.includes(p.id));

  // Check if property is favorited
  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.includes(propertyId),
    [favoriteIds]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (propertyId: string) => {
      if (favoriteIds.includes(propertyId)) {
        dispatch(removeFromFavorites(propertyId));
      } else {
        dispatch(addToFavorites(propertyId));
      }
    },
    [dispatch, favoriteIds]
  );

  // Add to favorites
  const addFavorite = useCallback(
    (propertyId: string) => {
      if (!favoriteIds.includes(propertyId)) {
        dispatch(addToFavorites(propertyId));
      }
    },
    [dispatch, favoriteIds]
  );

  // Remove from favorites
  const removeFavorite = useCallback(
    (propertyId: string) => {
      dispatch(removeFromFavorites(propertyId));
    },
    [dispatch]
  );

  return {
    favoriteIds,
    favoriteProperties,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
};
