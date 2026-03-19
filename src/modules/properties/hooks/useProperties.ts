// FILE PATH: src/modules/properties/hooks/useProperties.ts
// Custom hook for property CRUD operations

import { useCallback, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../../store";
import {
  fetchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  selectAllProperties,
  selectPropertyById,
  selectPropertiesLoading,
  selectPropertiesError,
} from "../store/propertySlice";
import { Property, PropertyFormData } from "../types/property.types";

export const useProperties = () => {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectAllProperties);
  const loading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);

  // Fetch all properties
  const loadProperties = useCallback(
    (filters?: Record<string, unknown>) => {
      dispatch(fetchProperties(filters));
    },
    [dispatch],
  );

  // Fetch single property by ID
  const loadProperty = useCallback(
    (id: string) => {
      return dispatch(fetchPropertyById(id));
    },
    [dispatch],
  );

  // Create new property
  const addProperty = useCallback(
    async (propertyData: PropertyFormData) => {
      return dispatch(createProperty(propertyData));
    },
    [dispatch],
  );

  // Update existing property
  const editProperty = useCallback(
    async (id: string, propertyData: Partial<Property>) => {
      return dispatch(updateProperty({ id, updates: propertyData }));
    },
    [dispatch],
  );

  // Delete property
  const removeProperty = useCallback(
    async (id: string) => {
      return dispatch(deleteProperty(id));
    },
    [dispatch],
  );

  // Load properties on mount
  useEffect(() => {
    if (properties.length === 0 && !loading) {
      loadProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    properties,
    loading,
    error,
    loadProperties,
    loadProperty,
    addProperty,
    editProperty,
    removeProperty,
  };
};

// Hook to get a single property by ID
export const useProperty = (id: string) => {
  const dispatch = useAppDispatch();
  const property = useAppSelector((state) => selectPropertyById(state, id));
  const loading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);

  useEffect(() => {
    if (!property && id) {
      dispatch(fetchPropertyById(id));
    }
  }, [id, property, dispatch]);

  return {
    property,
    loading,
    error,
  };
};
