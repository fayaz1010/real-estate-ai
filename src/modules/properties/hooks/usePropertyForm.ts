// FILE PATH: src/modules/properties/hooks/usePropertyForm.ts
// Custom hook for property form management

import { useState, useCallback } from 'react';
import { useProperties } from './useProperties';
import { PropertyFormData } from '../types/property.types';
import { validateProperty } from '../utils/propertyValidation';

interface FormErrors {
  [key: string]: string;
}

export const usePropertyForm = (initialData?: Partial<PropertyFormData>) => {
  const { addProperty, editProperty } = useProperties();
  const [formData, setFormData] = useState<Partial<PropertyFormData>>(initialData || {});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Update form field
  const updateField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Update nested field (e.g., address.street)
  const updateNestedField = useCallback((path: string, value: any) => {
    const keys = path.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
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
  const handleSubmit = useCallback(async (propertyId?: string) => {
    if (!validate()) {
      return { success: false, errors };
    }

    setIsSubmitting(true);
    try {
      let result;
      if (propertyId) {
        result = await editProperty(propertyId, formData as any);
      } else {
        result = await addProperty(formData as PropertyFormData);
      }
      
      setIsDirty(false);
      return { success: true, data: result };
    } catch (error: any) {
      setErrors({ submit: error.message });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, errors, addProperty, editProperty]);

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
