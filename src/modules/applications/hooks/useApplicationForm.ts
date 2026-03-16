// PLACEHOLDER FILE: hooks\useApplicationForm.ts
// TODO: Add your implementation here

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useDebounce } from "../../../hooks/useDebounce";
import { RootState, AppDispatch } from "../../../store";
import {
  updateFormData,
  setCurrentStep,
  resetForm,
  updateApplication,
} from "../store/applicationSlice";
import { ApplicationFormData } from "../types/application.types";
import {
  calculateApplicationScore,
  getScoreRating,
} from "../utils/scoringAlgorithm";

export const useApplicationForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentApplication, currentFormData, saving } = useSelector(
    (state: RootState) => state.applications,
  );

  const [localFormData, setLocalFormData] =
    useState<Partial<ApplicationFormData>>(currentFormData);
  const [realTimeScore, setRealTimeScore] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Debounce form data for autosave
  const debouncedFormData = useDebounce(localFormData, 2000);

  // Update local form data when Redux updates
  useEffect(() => {
    setLocalFormData(currentFormData);
  }, [currentFormData]);

  // Autosave when debounced data changes
  useEffect(() => {
    if (isDirty && currentApplication && debouncedFormData) {
      dispatch(
        updateApplication({
          applicationId: currentApplication.id,
          data: debouncedFormData,
        }),
      );
      setIsDirty(false);
    }
  }, [debouncedFormData, isDirty, currentApplication, dispatch]);

  // Calculate real-time score
  useEffect(() => {
    if (currentApplication) {
      const score = calculateApplicationScore({
        ...currentApplication,
        ...localFormData,
      } as any);
      setRealTimeScore(score);
    }
  }, [localFormData, currentApplication]);

  // Update form field
  const updateField = useCallback(
    (field: keyof ApplicationFormData, value: any) => {
      setLocalFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);

      // Also update Redux immediately for UI consistency
      dispatch(updateFormData({ [field]: value }));
    },
    [dispatch],
  );

  // Update nested field (e.g., personalInfo.firstName)
  const updateNestedField = useCallback(
    (parent: keyof ApplicationFormData, field: string, value: any) => {
      setLocalFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as any),
          [field]: value,
        },
      }));
      setIsDirty(true);

      dispatch(
        updateFormData({
          [parent]: {
            ...(localFormData[parent] as any),
            [field]: value,
          },
        }),
      );
    },
    [dispatch, localFormData],
  );

  // Add item to array field (e.g., employment, income)
  const addArrayItem = useCallback(
    (field: keyof ApplicationFormData, item: any) => {
      const currentArray = (localFormData[field] as any[]) || [];
      setLocalFormData((prev) => ({
        ...prev,
        [field]: [...currentArray, item],
      }));
      setIsDirty(true);

      dispatch(
        updateFormData({
          [field]: [...currentArray, item],
        }),
      );
    },
    [dispatch, localFormData],
  );

  // Update array item
  const updateArrayItem = useCallback(
    (field: keyof ApplicationFormData, index: number, item: any) => {
      const currentArray = [...((localFormData[field] as any[]) || [])];
      currentArray[index] = item;

      setLocalFormData((prev) => ({
        ...prev,
        [field]: currentArray,
      }));
      setIsDirty(true);

      dispatch(
        updateFormData({
          [field]: currentArray,
        }),
      );
    },
    [dispatch, localFormData],
  );

  // Remove array item
  const removeArrayItem = useCallback(
    (field: keyof ApplicationFormData, index: number) => {
      const currentArray = [...((localFormData[field] as any[]) || [])];
      currentArray.splice(index, 1);

      setLocalFormData((prev) => ({
        ...prev,
        [field]: currentArray,
      }));
      setIsDirty(true);

      dispatch(
        updateFormData({
          [field]: currentArray,
        }),
      );
    },
    [dispatch, localFormData],
  );

  // Navigate to step
  const goToStep = useCallback(
    (step: number) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch],
  );

  // Next step
  const nextStep = useCallback(() => {
    const currentStep = localFormData.step || 0;
    dispatch(setCurrentStep(currentStep + 1));
  }, [dispatch, localFormData.step]);

  // Previous step
  const previousStep = useCallback(() => {
    const currentStep = localFormData.step || 0;
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  }, [dispatch, localFormData.step]);

  // Reset form
  const reset = useCallback(() => {
    dispatch(resetForm());
    setLocalFormData({ step: 0 });
    setIsDirty(false);
  }, [dispatch]);

  // Force save (without debounce)
  const forceSave = useCallback(async () => {
    if (currentApplication) {
      await dispatch(
        updateApplication({
          applicationId: currentApplication.id,
          data: localFormData,
        }),
      );
      setIsDirty(false);
    }
  }, [currentApplication, localFormData, dispatch]);

  // Get score rating
  const scoreRating = getScoreRating(realTimeScore);

  // Calculate step completion
  const getStepCompletion = useCallback(
    (step: number): number => {
      switch (step) {
        case 0: { // Personal Info
          const personalInfo = localFormData.personalInfo || {};
          const personalFields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "dateOfBirth",
            "ssn",
            "idNumber",
          ];
          const completedPersonal = personalFields.filter(
            (field) => personalInfo[field as keyof typeof personalInfo],
          ).length;
          return Math.round((completedPersonal / personalFields.length) * 100);
        }

        case 1: // Employment
          return (localFormData.employment?.length || 0) > 0 ? 100 : 0;

        case 2: // Income
          return (localFormData.income?.length || 0) > 0 ? 100 : 0;

        case 3: // Rental History
          return (localFormData.rentalHistory?.length || 0) > 0 ? 100 : 0;

        case 4: // References
          return (localFormData.references?.length || 0) >= 2 ? 100 : 50;

        case 5: // Background Consent
          return localFormData.backgroundConsentGiven ? 100 : 0;

        case 6: // Documents
          return 0; // Based on uploaded documents

        case 7: // Review
          return 100;

        default:
          return 0;
      }
    },
    [localFormData],
  );

  // Check if step is complete
  const isStepComplete = useCallback(
    (step: number): boolean => {
      return getStepCompletion(step) === 100;
    },
    [getStepCompletion],
  );

  // Overall form completion
  const formCompletion = useCallback((): number => {
    const totalSteps = 8;
    const completedSteps = Array.from({ length: totalSteps }, (_, i) =>
      getStepCompletion(i),
    ).reduce((sum, completion) => sum + completion, 0);

    return Math.round(completedSteps / totalSteps);
  }, [getStepCompletion]);

  return {
    // Form data
    formData: localFormData,
    currentStep: localFormData.step || 0,

    // State
    saving,
    isDirty,

    // Score
    realTimeScore,
    scoreRating,

    // Field updates
    updateField,
    updateNestedField,
    addArrayItem,
    updateArrayItem,
    removeArrayItem,

    // Navigation
    goToStep,
    nextStep,
    previousStep,

    // Actions
    reset,
    forceSave,

    // Helpers
    getStepCompletion,
    isStepComplete,
    formCompletion,
  };
};
