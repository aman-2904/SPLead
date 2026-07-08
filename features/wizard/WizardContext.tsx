"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { z } from "zod";

// Define the Form Data Interface
export interface DayGuestCount {
  lunch: string;
  highTea: string;
  dinner: string;
  breakfast: string;
}

export interface DayRoomCount {
  rooms: string;
  guests: string;
}

export interface WizardFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  customCity?: string;
  weddingMonth: string;
  weddingDay: string;
  isFlexibleDate: boolean;
  duration: string;
  isFlexibleDuration: boolean;
  services: string[];
  guestCount: string;
  guestCountDetails: DayGuestCount[];
  sameGuestsAllDays: boolean;
  roomsCount: string;
  roomsCountDetails: DayRoomCount[];
  sameRoomsAllDays: boolean;
  locationPref: string[];
  venueAreas: string[];
  openAnywhere: boolean;
  venueTypes: string[];
  isVegetarianOnly: boolean;
  budget: string;
}

// Default Data Values
const DEFAULT_FORM_DATA: WizardFormData = {
  name: "",
  email: "",
  phone: "",
  city: "",
  customCity: "",
  weddingMonth: "",
  weddingDay: "",
  isFlexibleDate: false,
  duration: "",
  isFlexibleDuration: false,
  services: [],
  guestCount: "",
  guestCountDetails: [{ lunch: "", highTea: "", dinner: "", breakfast: "" }],
  sameGuestsAllDays: true,
  roomsCount: "",
  roomsCountDetails: [{ rooms: "", guests: "" }],
  sameRoomsAllDays: true,
  locationPref: [],
  venueAreas: [],
  openAnywhere: false,
  venueTypes: [],
  isVegetarianOnly: false,
  budget: "",
};

// Zod Validation Schemas for each step
export const stepSchemas = [
  // Step 1: City Selection, Name, Email & Compulsory Phone
  z.object({
    name: z.string().min(2, "Name is required (at least 2 characters)"),
    email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
    phone: z.string().min(8, "Phone number is required (at least 8 digits)"),
    city: z.string().min(1, "Please select a wedding city"),
    customCity: z.string().optional(),
  }).refine(data => data.city !== "other" || (data.customCity && data.customCity.trim().length > 0), {
    message: "Please enter your wedding city",
    path: ["customCity"],
  }),
  // Step 2: Wedding Date & Duration
  z.object({
    weddingMonth: z.string().optional(),
    weddingDay: z.string().optional(),
    isFlexibleDate: z.boolean(),
    duration: z.string().optional(),
    isFlexibleDuration: z.boolean(),
  }).refine(data => data.isFlexibleDate || (data.weddingMonth && data.weddingMonth.length > 0), {
    message: "Please select your wedding month",
    path: ["weddingMonth"],
  }).refine(data => data.isFlexibleDuration || (data.duration && data.duration.length > 0), {
    message: "Please select wedding duration",
    path: ["duration"],
  }),
  // Step 3: Services Required
  z.object({
    services: z.array(z.string()).min(1, "Please select at least one service"),
  }),
  // Step 4: Meal Guest Count
  z.object({
    sameGuestsAllDays: z.boolean(),
    guestCountDetails: z.array(
      z.object({
        lunch: z.string().optional(),
        highTea: z.string().optional(),
        dinner: z.string().optional(),
        breakfast: z.string().optional(),
      })
    ).min(1, "Please enter details for at least one day"),
  }).refine((data) => {
    let atLeastOneProvided = false;
    for (const day of data.guestCountDetails) {
      const vals = [day.lunch, day.highTea, day.dinner, day.breakfast];
      if (vals.some(v => v && v.trim().length > 0)) {
        atLeastOneProvided = true;
      }
      for (const v of vals) {
        if (v && v.trim().length > 0) {
          const num = Number(v);
          if (isNaN(num) || num < 0) {
            return false;
          }
        }
      }
    }
    return atLeastOneProvided;
  }, {
    message: "Please enter a valid guest count (positive number) for at least one meal",
    path: ["guestCountDetails"],
  }),
  // Step 5: Rooms Required
  z.object({
    sameRoomsAllDays: z.boolean(),
    roomsCountDetails: z.array(
      z.object({
        rooms: z.string().optional(),
        guests: z.string().optional(),
      })
    ).min(1, "Please enter details for at least one day"),
  }).refine((data) => {
    let atLeastOne = false;
    for (const day of data.roomsCountDetails) {
      const vals = [day.rooms, day.guests];
      if (vals.some(v => v && v.trim().length > 0)) {
        atLeastOne = true;
      }
      for (const v of vals) {
        if (v && v.trim().length > 0) {
          const num = Number(v);
          if (isNaN(num) || num < 0) {
            return false;
          }
        }
      }
    }
    return atLeastOne;
  }, {
    message: "Please enter a valid positive number for rooms or guests",
    path: ["roomsCountDetails"],
  }),
  // Step 6: Venue Area Preferences
  z.object({
    openAnywhere: z.boolean(),
    venueAreas: z.array(z.string()).optional(),
  }).refine(data => data.openAnywhere || (data.venueAreas && data.venueAreas.length > 0), {
    message: "Please select at least one area or choose open anywhere",
    path: ["venueAreas"],
  }),
  // Step 7: Venue Type & Food Preference
  z.object({
    venueTypes: z.array(z.string()).min(1, "Please select at least one venue type"),
    isVegetarianOnly: z.boolean().optional(),
  }),
  // Step 8: Budget
  z.object({
    budget: z.string().min(1, "Please select your target budget tier"),
  }),
];

interface WizardContextType {
  currentStep: number;
  formData: WizardFormData;
  setStepData: <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void;
  nextStep: () => boolean; // returns true if transition is successful
  prevStep: () => void;
  validateStep: (stepNumber: number) => { success: boolean; error?: string };
  errors: Record<string, string>;
  resetWizard: () => void;
  isLoaded: boolean;
}

// Exported type alias for step component props — compatible with the constrained generic above
export type SetStepDataFn = <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => void;

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "shaadi_platform_wizard";

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<WizardFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
      }
    } catch (e) {
      console.error("Failed to load wizard progress from local storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync / Autosave to localStorage on any updates
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ formData, currentStep })
      );
    } catch (e) {
      console.error("Failed to save wizard progress", e);
    }
  }, [formData, currentStep, isLoaded]);

  const setStepData = <K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Clear error for this field
    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const validateStep = (stepNum: number): { success: boolean; error?: string } => {
    const schema = stepSchemas[stepNum - 1];
    if (!schema) return { success: true };

    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0]?.toString();
        if (path) {
          formattedErrors[path] = err.message;
        }
      });
      setErrors(formattedErrors);
      // Return first error message
      return { success: false, error: result.error.errors[0]?.message };
    }

    setErrors({});
    return { success: true };
  };

  const nextStep = () => {
    const validation = validateStep(currentStep);
    if (!validation.success) {
      return false;
    }
    if (currentStep < 8) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return true;
  };

  const prevStep = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const resetWizard = () => {
    setFormData(DEFAULT_FORM_DATA);
    setCurrentStep(1);
    setErrors({});
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear local storage", e);
    }
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        formData,
        setStepData,
        nextStep,
        prevStep,
        validateStep,
        errors,
        resetWizard,
        isLoaded,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
