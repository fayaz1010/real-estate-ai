import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { screeningService } from '@/services/screeningService';

interface Property {
  id: string;
  title: string;
  address: string;
}

interface ScreeningRequestFormProps {
  properties: Property[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  tenantName: string;
  email: string;
  phone: string;
  propertyId: string;
}

interface FormErrors {
  tenantName?: string;
  email?: string;
  phone?: string;
  propertyId?: string;
}

export const ScreeningRequestForm: React.FC<ScreeningRequestFormProps> = ({
  properties,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>({
    tenantName: '',
    email: '',
    phone: '',
    propertyId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Tenant name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\+?[\d\s()-]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.propertyId) {
      newErrors.propertyId = 'Please select a property.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      await screeningService.createScreeningRequest(formData);
      onSuccess?.();
    } catch {
      setSubmitError(
        'Failed to submit screening request. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitError && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
        >
          <p
            className="text-red-700 text-sm"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {submitError}
          </p>
        </div>
      )}

      {/* Tenant Name */}
      <div>
        <label
          htmlFor="tenantName"
          className="block text-sm font-semibold mb-1.5"
          style={{ fontFamily: "'Montserrat', sans-serif", color: '#091a2b' }}
        >
          Tenant Name
        </label>
        <Input
          id="tenantName"
          name="tenantName"
          value={formData.tenantName}
          onChange={handleChange}
          placeholder="Enter tenant's full name"
          aria-invalid={!!errors.tenantName}
          aria-describedby={errors.tenantName ? 'tenantName-error' : undefined}
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        />
        {errors.tenantName && (
          <p
            id="tenantName-error"
            className="text-red-600 text-xs mt-1"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {errors.tenantName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold mb-1.5"
          style={{ fontFamily: "'Montserrat', sans-serif", color: '#091a2b' }}
        >
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tenant@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-red-600 text-xs mt-1"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold mb-1.5"
          style={{ fontFamily: "'Montserrat', sans-serif", color: '#091a2b' }}
        >
          Phone Number
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        />
        {errors.phone && (
          <p
            id="phone-error"
            className="text-red-600 text-xs mt-1"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Property Selection */}
      <div>
        <label
          htmlFor="propertyId"
          className="block text-sm font-semibold mb-1.5"
          style={{ fontFamily: "'Montserrat', sans-serif", color: '#091a2b' }}
        >
          Property
        </label>
        <select
          id="propertyId"
          name="propertyId"
          value={formData.propertyId}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-primary/30 bg-background px-3 py-2 text-sm text-text_primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-invalid={!!errors.propertyId}
          aria-describedby={errors.propertyId ? 'propertyId-error' : undefined}
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="">Select a property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.address || property.title}
            </option>
          ))}
        </select>
        {errors.propertyId && (
          <p
            id="propertyId-error"
            className="text-red-600 text-xs mt-1"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {errors.propertyId}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Screening Request'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
