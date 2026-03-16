// FILE PATH: src/modules/properties/utils/propertyValidation.ts
// Module 1.2: Property Listings Management - Validation Utilities

import { PropertyFormData, PropertyType, ListingType } from '../types/property.types';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export const propertyValidation = {
  /**
   * Validate property title
   */
  validateTitle: (title: string): { valid: boolean; error?: string } => {
    if (!title || title.trim().length === 0) {
      return { valid: false, error: 'Title is required' };
    }
    if (title.length < 10) {
      return { valid: false, error: 'Title must be at least 10 characters' };
    }
    if (title.length > 100) {
      return { valid: false, error: 'Title must be less than 100 characters' };
    }
    return { valid: true };
  },

  /**
   * Validate property description
   */
  validateDescription: (description: string): { valid: boolean; error?: string } => {
    if (!description || description.trim().length === 0) {
      return { valid: false, error: 'Description is required' };
    }
    if (description.length < 50) {
      return { valid: false, error: 'Description must be at least 50 characters' };
    }
    if (description.length > 5000) {
      return { valid: false, error: 'Description must be less than 5000 characters' };
    }
    return { valid: true };
  },

  /**
   * Validate address
   */
  validateAddress: (address: any): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!address.street) errors.street = 'Street address is required';
    if (!address.city) errors.city = 'City is required';
    if (!address.state) errors.state = 'State is required';
    if (!address.zipCode) errors.zipCode = 'Zip code is required';
    if (!address.country) errors.country = 'Country is required';

    // Validate zip code format (US)
    if (address.zipCode && !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      errors.zipCode = 'Invalid zip code format';
    }

    // Validate coordinates
    if (address.latitude !== undefined) {
      if (address.latitude < -90 || address.latitude > 90) {
        errors.latitude = 'Invalid latitude';
      }
    }
    if (address.longitude !== undefined) {
      if (address.longitude < -180 || address.longitude > 180) {
        errors.longitude = 'Invalid longitude';
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate pricing
   */
  validatePricing: (price: number, listingType: ListingType): { valid: boolean; error?: string } => {
    if (!price || price <= 0) {
      return { valid: false, error: 'Price must be greater than 0' };
    }

    if (listingType === 'rent') {
      if (price < 100) {
        return { valid: false, error: 'Monthly rent seems too low. Please verify.' };
      }
      if (price > 50000) {
        return { valid: false, error: 'Monthly rent seems too high. Please verify.' };
      }
    } else {
      if (price < 10000) {
        return { valid: false, error: 'Sale price seems too low. Please verify.' };
      }
      if (price > 100000000) {
        return { valid: false, error: 'Sale price seems too high. Please verify.' };
      }
    }

    return { valid: true };
  },

  /**
   * Validate property details
   */
  validateDetails: (details: any): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Bedrooms
    if (details.bedrooms === undefined || details.bedrooms === null) {
      errors.bedrooms = 'Number of bedrooms is required';
    } else if (details.bedrooms < 0 || details.bedrooms > 20) {
      errors.bedrooms = 'Bedrooms must be between 0 and 20';
    }

    // Bathrooms
    if (details.bathrooms === undefined || details.bathrooms === null) {
      errors.bathrooms = 'Number of bathrooms is required';
    } else if (details.bathrooms < 0.5 || details.bathrooms > 20) {
      errors.bathrooms = 'Bathrooms must be between 0.5 and 20';
    }

    // Square footage
    if (!details.sqft || details.sqft <= 0) {
      errors.sqft = 'Square footage is required and must be greater than 0';
    } else if (details.sqft < 100) {
      errors.sqft = 'Square footage seems too small. Please verify.';
    } else if (details.sqft > 50000) {
      errors.sqft = 'Square footage seems too large. Please verify.';
    }

    // Year built (optional)
    if (details.yearBuilt) {
      const currentYear = new Date().getFullYear();
      if (details.yearBuilt < 1800 || details.yearBuilt > currentYear + 2) {
        errors.yearBuilt = `Year built must be between 1800 and ${currentYear + 2}`;
      }
    }

    // Lot size (optional)
    if (details.lotSize && details.lotSize < 0) {
      errors.lotSize = 'Lot size cannot be negative';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate images
   */
  validateImages: (images: File[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (images.length === 0) {
      errors.push('At least one image is required');
      return { valid: false, errors };
    }

    if (images.length > 50) {
      errors.push('Maximum 50 images allowed');
    }

    images.forEach((file, index) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`File ${index + 1}: Must be an image file`);
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        errors.push(`File ${index + 1}: Image size must be less than 10MB`);
      }

      // Check file format
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedFormats.includes(file.type)) {
        errors.push(`File ${index + 1}: Only JPEG, PNG, and WebP formats are allowed`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate complete property form
   */
  validatePropertyForm: (formData: Partial<PropertyFormData>, step?: number): ValidationResult => {
    const errors: Record<string, string> = {};

    // If step is provided, only validate that step
    if (step === 1 || !step) {
      // Basic Details
      const titleValidation = propertyValidation.validateTitle(formData.title || '');
      if (!titleValidation.valid) errors.title = titleValidation.error!;

      const descValidation = propertyValidation.validateDescription(formData.description || '');
      if (!descValidation.valid) errors.description = descValidation.error!;

      if (!formData.propertyType) errors.propertyType = 'Property type is required';
      if (!formData.listingType) errors.listingType = 'Listing type is required';
    }

    if (step === 2 || !step) {
      // Address
      if (formData.address) {
        const addressValidation = propertyValidation.validateAddress(formData.address);
        if (!addressValidation.valid) {
          Object.assign(errors, addressValidation.errors);
        }
      } else {
        errors.address = 'Address is required';
      }
    }

    if (step === 3 || !step) {
      // Details
      const detailsValidation = propertyValidation.validateDetails({
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        yearBuilt: formData.yearBuilt,
        lotSize: formData.lotSize
      });
      if (!detailsValidation.valid) {
        Object.assign(errors, detailsValidation.errors);
      }
    }

    if (step === 4 || !step) {
      // Pricing
      if (formData.price && formData.listingType) {
        const pricingValidation = propertyValidation.validatePricing(
          formData.price,
          formData.listingType
        );
        if (!pricingValidation.valid) errors.price = pricingValidation.error!;
      } else {
        errors.price = 'Price is required';
      }
    }

    if (step === 5 || !step) {
      // Features (optional, but validate if provided)
      if (!formData.petPolicy) errors.petPolicy = 'Pet policy is required';
      if (!formData.parking) errors.parking = 'Parking information is required';
    }

    if (step === 6 || !step) {
      // Images
      if (formData.images && formData.images.length > 0) {
        const imageValidation = propertyValidation.validateImages(formData.images);
        if (!imageValidation.valid) {
          errors.images = imageValidation.errors.join('; ');
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate URL format
   */
  validateUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate phone number
   */
  validatePhone: (phone: string): boolean => {
    const phoneRegex = /^\+?1?\d{10,15}$/;
    return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
  },

  /**
   * Validate email
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Sanitize input (prevent XSS)
   */
  sanitizeInput: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validate date format (YYYY-MM-DD)
   */
  validateDate: (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;

    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  },

  /**
   * Check if date is in the future
   */
  isFutureDate: (date: string): boolean => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  },
  /**
   * Validate complete property (for use in hooks)
   */
  validateProperty: (propertyData: PropertyFormData): Record<string, string> => {
    const result = propertyValidation.validatePropertyForm(propertyData);
    return result.errors;
  }
};

// Export individual function for convenience
export const validateProperty = propertyValidation.validateProperty;