// FILE PATH: src/modules/properties/hooks/usePropertyForm.ts
// Custom hook for property form management

import { useState, useCallback } from "react";

import { Property, PropertyFormData } from "../types/property.types";
import { validateProperty } from "../utils/propertyValidation";

import { useProperties } from "./useProperties";

interface FormErrors {
  [key: string]: string;
}

export const usePropertyForm = (initialData?: Partial<PropertyFormData>) => {
  const { addProperty, editProperty } = useProperties();
  const [formData, setFormData] = useState<Partial<PropertyFormData>>(
    initialData || {},
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Update form field
  const updateField = useCallback(
    (field: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // Update nested field (e.g., address.street)
  const updateNestedField = useCallback((path: string, value: unknown) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const newData = { ...prev };
      let current: Record<string, unknown> = newData as Record<string, unknown>;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Record<string, unknown>;
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
    setIsDirty(true);
  }, []);

  // Validate form
  const validate = useCallback(() => {
    const validationErrors = validateProperty(formData as PropertyFormData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  // Submit form
  const handleSubmit = useCallback(
    async (propertyId?: string) => {
      if (!validate()) {
        return { success: false, errors };
      }

      setIsSubmitting(true);
      try {
        let result;
        if (propertyId) {
          result = await editProperty(
            propertyId,
            formData as unknown as Partial<Property>,
          );
        } else {
          result = await addProperty(formData as PropertyFormData);
        }

        setIsDirty(false);
        return { success: true, data: result };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        setErrors({ submit: message });
        return { success: false, error: message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, errors, addProperty, editProperty],
  );

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialData || {});
    setErrors({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,
    updateField,
    updateNestedField,
    validate,
    handleSubmit,
    resetForm,
    setFormData,
  };
};
