// PLACEHOLDER FILE: src/modules/inspections/hooks/useInspectionBooking.ts
// TODO: Add your implementation here

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from './useInspections';
import { validateInspectionBooking } from '../utils/inspectionValidation';
import {
  InspectionBookingRequest,
  InspectionType,
  InspectionAttendee,
} from '../types/inspection.types';

interface BookingState {
  currentStep: number;
  propertyId: string | null;
  type: InspectionType | null;
  preferredDate: string | null;
  preferredTimeSlot: string | null;
  attendees: Omit<InspectionAttendee, 'id'>[];
  tenantNotes: string;
  errors: Record<string, string>;
}

const TOTAL_STEPS = 4;

export const useInspectionBooking = () => {
  const navigate = useNavigate();
  const { createNewInspection } = useInspections();

  const [bookingState, setBookingState] = useState<BookingState>({
    currentStep: 0,
    propertyId: null,
    type: null,
    preferredDate: null,
    preferredTimeSlot: null,
    attendees: [],
    tenantNotes: '',
    errors: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update booking data
  const updateBookingData = useCallback(
    (updates: Partial<Omit<BookingState, 'currentStep' | 'errors'>>) => {
      setBookingState((prev) => ({
        ...prev,
        ...updates,
        errors: {}, // Clear errors on update
      }));
    },
    []
  );

  // Add attendee
  const addAttendee = useCallback((attendee: Omit<InspectionAttendee, 'id'>) => {
    setBookingState((prev) => ({
      ...prev,
      attendees: [...prev.attendees, attendee],
    }));
  }, []);

  // Remove attendee
  const removeAttendee = useCallback((index: number) => {
    setBookingState((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index),
    }));
  }, []);

  // Update attendee
  const updateAttendee = useCallback(
    (index: number, updates: Partial<Omit<InspectionAttendee, 'id'>>) => {
      setBookingState((prev) => ({
        ...prev,
        attendees: prev.attendees.map((attendee, i) =>
          i === index ? { ...attendee, ...updates } : attendee
        ),
      }));
    },
    []
  );

  // Validate current step
  const validateStep = useCallback(
    (step: number): boolean => {
      const { propertyId, type, preferredDate, preferredTimeSlot, attendees } =
        bookingState;

      let stepData: Partial<InspectionBookingRequest> = {};

      switch (step) {
        case 0: // Property selection
          stepData = { propertyId: propertyId || '' };
          break;
        case 1: // Inspection type
          stepData = { propertyId: propertyId || '', type: type || undefined };
          break;
        case 2: // Date & time
          stepData = {
            propertyId: propertyId || '',
            type: type || undefined,
            preferredDate: preferredDate || '',
            preferredTimeSlot: preferredTimeSlot || '',
          };
          break;
        case 3: // Attendees & notes
          stepData = {
            propertyId: propertyId || '',
            type: type || undefined,
            preferredDate: preferredDate || '',
            preferredTimeSlot: preferredTimeSlot || '',
            attendees,
          };
          break;
      }

      const validation = validateInspectionBooking(stepData);

      if (!validation.isValid) {
        setBookingState((prev) => ({ ...prev, errors: validation.errors }));
        return false;
      }

      return true;
    },
    [bookingState]
  );

  // Next step
  const nextStep = useCallback(() => {
    if (validateStep(bookingState.currentStep)) {
      setBookingState((prev) => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS - 1),
      }));
    }
  }, [bookingState.currentStep, validateStep]);

  // Previous step
  const prevStep = useCallback(() => {
    setBookingState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      errors: {},
    }));
  }, []);

  // Go to specific step
  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) {
      setBookingState((prev) => ({ ...prev, currentStep: step, errors: {} }));
    }
  }, []);

  // Submit booking request
  const submitBooking = useCallback(async () => {
    // Validate all steps
    for (let step = 0; step < TOTAL_STEPS; step++) {
      if (!validateStep(step)) {
        goToStep(step);
        return;
      }
    }

    const { propertyId, type, preferredDate, preferredTimeSlot, attendees, tenantNotes } =
      bookingState;

    if (!propertyId || !type || !preferredDate || !preferredTimeSlot) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingRequest: InspectionBookingRequest = {
        propertyId,
        type,
        preferredDate,
        preferredTimeSlot,
        attendees,
        tenantNotes: tenantNotes || undefined,
      };

      const inspection = await createNewInspection(bookingRequest);

      // Navigate to confirmation page
      navigate(`/inspections/${inspection.id}/confirmation`);
    } catch (error) {
      console.error('Failed to submit booking:', error);
      setBookingState((prev) => ({
        ...prev,
        errors: { submit: 'Failed to submit booking. Please try again.' },
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingState, createNewInspection, navigate, validateStep, goToStep]);

  // Reset booking
  const resetBooking = useCallback(() => {
    setBookingState({
      currentStep: 0,
      propertyId: null,
      type: null,
      preferredDate: null,
      preferredTimeSlot: null,
      attendees: [],
      tenantNotes: '',
      errors: {},
    });
  }, []);

  // Calculate completion percentage
  const getCompletionPercentage = useCallback(() => {
    return Math.round(((bookingState.currentStep + 1) / TOTAL_STEPS) * 100);
  }, [bookingState.currentStep]);

  return {
    // State
    currentStep: bookingState.currentStep,
    propertyId: bookingState.propertyId,
    type: bookingState.type,
    preferredDate: bookingState.preferredDate,
    preferredTimeSlot: bookingState.preferredTimeSlot,
    attendees: bookingState.attendees,
    tenantNotes: bookingState.tenantNotes,
    errors: bookingState.errors,
    isSubmitting,
    totalSteps: TOTAL_STEPS,
    completionPercentage: getCompletionPercentage(),

    // Actions
    updateBookingData,
    addAttendee,
    removeAttendee,
    updateAttendee,
    nextStep,
    prevStep,
    goToStep,
    submitBooking,
    resetBooking,
    validateStep,
  };
};
