"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ChevronLeft, ChevronRight, Check, AlertCircle, ShieldCheck, HelpCircle
} from "lucide-react";
import { WizardProvider, useWizard } from "@/features/wizard/WizardContext";
import { cn } from "@/lib/utils";

// Import Split Step Components
import { Step1Destination } from "@/features/wizard/components/Step1Destination";
import { Step2Timeline } from "@/features/wizard/components/Step2Timeline";
import { Step3Services } from "@/features/wizard/components/Step3Services";
import { Step4Guests } from "@/features/wizard/components/Step4Guests";
import { Step5Rooms } from "@/features/wizard/components/Step5Rooms";
import { Step6Areas } from "@/features/wizard/components/Step6Areas";
import { Step7VenueTypes } from "@/features/wizard/components/Step7VenueTypes";
import { Step8Budget } from "@/features/wizard/components/Step8Budget";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  })
};

function WizardForm() {
  const router = useRouter();
  const {
    currentStep,
    formData,
    errors,
    nextStep,
    prevStep,
    setStepData,
    resetWizard
  } = useWizard();

  const [direction, setDirection] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    setStepError(null);
    setDirection(1);
    const success = nextStep();
    if (!success) {
      const keys = Object.keys(errors);
      if (keys.length > 0) {
        setStepError(errors[keys[0] as string] || "Please fill required fields");
      } else {
        setStepError("Validation failed. Please verify inputs.");
      }
      return;
    }

    // Auto-save partial progress after step validation succeeds
    try {
      const { savePartialOnboarding } = await import("@/features/wizard/actions");
      const result = await savePartialOnboarding(formData, formData.requestId || null);
      if (result.success && result.requestId) {
        setStepData("requestId", result.requestId);
      }
    } catch (err) {
      console.error("Failed to auto-save partial progress:", err);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setStepError(null);
    prevStep();
  };

  const handleComplete = async () => {
    setStepError(null);
    const success = nextStep();
    if (!success) {
      setStepError(errors["budget"] || "Please select a budget range");
      return;
    }

    try {
      setIsSubmitting(true);
      const { savePartialOnboarding } = await import("@/features/wizard/actions");
      const result = await savePartialOnboarding(formData, formData.requestId || null);

      if (result.success) {
        resetWizard();
        router.push("/?submitted=true");
      } else {
        setStepError(result.error || "Failed to store onboarding details.");
      }
    } catch (e: any) {
      console.error(e);
      setStepError(e.message || "An unexpected database error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-secondary-light border border-accent/20 rounded-3xl overflow-hidden shadow-2xl elegant-glow">
      {/* Progress Header */}
      <div className="px-6 py-6 md:px-10 border-b border-accent/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase font-sans">
            Wedding Planning Board
          </span>
          <h1 className="font-serif text-2xl font-bold text-primary">
            Configure Your Celebration
          </h1>
        </div>
        <div className="flex flex-col items-end gap-1.5 w-full md:w-48">
          <div className="flex justify-between w-full text-xs font-medium text-primary/80">
            <span>Step {currentStep} of 8</span>
            <span>{Math.round((currentStep / 8) * 100)}%</span>
          </div>
          {/* Stepper Progress Bar */}
          <div className="w-full h-1.5 bg-accent/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 8) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>

      {/* Steps Warning Banner */}
      <AnimatePresence>
        {stepError && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary/5 border-b border-primary/20 px-6 py-3.5 flex items-center gap-2 text-xs font-semibold text-primary"
          >
            <AlertCircle className="h-4 w-4 text-accent" />
            {stepError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Form Body */}
      <div className="p-6 md:p-10 min-h-[420px] flex flex-col justify-between">
        <div className="overflow-hidden relative flex-grow -m-2 p-2">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full flex flex-col"
            >
              {currentStep === 1 && (
                <Step1Destination
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 2 && (
                <Step2Timeline
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <Step3Services
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <Step4Guests
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 5 && (
                <Step5Rooms
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 6 && (
                <Step6Areas
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 7 && (
                <Step7VenueTypes
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
              {currentStep === 8 && (
                <Step8Budget
                  formData={formData}
                  setStepData={setStepData}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8 border-t border-accent/15 mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={cn(
              "px-5 py-2.5 border border-accent/30 text-primary font-semibold text-xs rounded-full flex items-center gap-1 transition-all duration-300",
              (currentStep === 1 || isSubmitting)
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-accent/10 cursor-pointer"
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className={cn(
                "px-6 py-2.5 bg-primary hover:bg-primary-dark text-secondary font-semibold text-xs rounded-full flex items-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer animate-fade-in",
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {currentStep === 1 ? "Continue" : "Next Step"}
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting}
              className={cn(
                "px-6 py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold text-xs rounded-full flex items-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer uppercase tracking-wider",
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {isSubmitting ? "Submitting Request..." : "Submit"}
              <Check className={cn("h-3.5 w-3.5", isSubmitting ? "animate-pulse" : "")} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <div className="min-h-screen bg-secondary relative py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <WizardProvider>
        <div className="relative z-10 w-full max-w-4xl mx-auto space-y-6">
          {/* Top Brand Quote */}
          <div className="text-center space-y-2 mb-4">
            <Heart className="h-6 w-6 text-accent fill-accent mx-auto" />
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary">
              ShaadiPlatform Planner
            </h2>
            <p className="text-xs text-primary/70 max-w-md mx-auto font-sans leading-relaxed">
              Curate your unique preferences to unlock bespoke palace portfolios and award-winning decorators.
            </p>
          </div>

          <WizardForm />

          {/* Bottom Security Seals */}
          <div className="flex items-center justify-center gap-8 text-[10px] text-primary/50 font-sans pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span>100% Verified Vendors Only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-accent" />
              <span>Dedicated Concierge Helpline</span>
            </div>
          </div>
        </div>
      </WizardProvider>
    </div>
  );
}
