"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BUDGET_STEPS = [
  { value: 3000000, label: "30 Lakh", words: "Thirty Lakh Rupees", formatted: "₹30,00,000" },
  { value: 5000000, label: "50 Lakh", words: "Fifty Lakh Rupees", formatted: "₹50,00,000" },
  { value: 7500000, label: "75 Lakh", words: "Seventy-Five Lakh Rupees", formatted: "₹75,00,000" },
  { value: 10000000, label: "1 Crore", words: "One Crore Rupees", formatted: "₹1,00,00,000" },
  { value: 20000000, label: "2 Crore", words: "Two Crore Rupees", formatted: "₹2,00,00,000" },
  { value: 30000000, label: "3 Crore+", words: "Three Crores & Above", formatted: "₹3,00,00,000+" },
];

export interface Step8Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step8Budget({ formData, setStepData, errors }: Step8Props) {
  const selectedIndex = BUDGET_STEPS.findIndex(b => b.label === formData.budget);
  const currentIndex = selectedIndex === -1 ? 1 : selectedIndex;
  const currentStepItem = BUDGET_STEPS[currentIndex];

  // Automatically set the budget in context if it is empty
  React.useEffect(() => {
    if (!formData.budget) {
      setStepData("budget", BUDGET_STEPS[1].label);
    }
  }, [formData.budget, setStepData]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    if (BUDGET_STEPS[idx]) {
      setStepData("budget", BUDGET_STEPS[idx].label);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-primary">
      <div className="space-y-1.5 text-center md:text-left">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
          Target Wedding Budget
        </h2>
        <p className="text-xs text-primary/70">
          Adjust the slider to specify your target budget scale. We will tailor venue recommendations accordingly.
        </p>
      </div>

      {/* Grand Display Panel */}
      <div className="p-8 rounded-2xl border border-accent/20 bg-secondary/30 text-center space-y-3 relative overflow-hidden shadow-[0_4px_24px_rgba(200,164,93,0.05)]">
        <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent pointer-events-none" />
        
        <span className="text-[10px] font-bold text-accent tracking-widest uppercase block">
          Estimated Budget Scale
        </span>
        
        {currentStepItem && (
          <>
            <motion.h3 
              key={currentStepItem.formatted}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight"
            >
              {currentStepItem.formatted}
            </motion.h3>

            <motion.p
              key={currentStepItem.words}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-serif text-xs md:text-sm text-accent italic font-medium"
            >
              {currentStepItem.words}
            </motion.p>
          </>
        )}
      </div>

      {/* Slider Input Block */}
      <div className="space-y-6 px-2">
        <div className="relative pt-4">
          <input
            type="range"
            min="0"
            max={BUDGET_STEPS.length - 1}
            step="1"
            value={currentIndex}
            onChange={handleSliderChange}
            className={cn(
              "w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all",
              // Webkit Thumb
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:w-4.5",
              "[&::-webkit-slider-thumb]:h-4.5",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-primary",
              "[&::-webkit-slider-thumb]:border-2",
              "[&::-webkit-slider-thumb]:border-accent",
              "[&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(200,164,93,0.5)]",
              "[&::-webkit-slider-thumb]:transition-all",
              "[&::-webkit-slider-thumb]:hover:scale-110",
              "[&::-webkit-slider-thumb]:active:scale-90",
              // Moz Thumb
              "[&::-moz-range-thumb]:w-4.5",
              "[&::-moz-range-thumb]:h-4.5",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-primary",
              "[&::-moz-range-thumb]:border-2",
              "[&::-moz-range-thumb]:border-accent",
              "[&::-moz-range-thumb]:shadow-[0_0_10px_rgba(200,164,93,0.5)]",
              "[&::-moz-range-thumb]:border-none",
              "[&::-moz-range-thumb]:transition-all",
              "[&::-moz-range-thumb]:hover:scale-110",
              "[&::-moz-range-thumb]:active:scale-90"
            )}
            style={{
              background: `linear-gradient(to right, var(--color-primary) ${currentIndex * (100 / (BUDGET_STEPS.length - 1))}%, rgba(200, 164, 93, 0.2) ${currentIndex * (100 / (BUDGET_STEPS.length - 1))}%)`
            }}
          />

          {/* Slider Ticks */}
          <div className="flex justify-between w-full px-1.5 mt-2">
            {BUDGET_STEPS.map((step, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => setStepData("budget", step.label)}
                  className="flex flex-col items-center focus:outline-none group cursor-pointer"
                >
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full border transition-all duration-300",
                    isSelected 
                      ? "bg-accent border-accent scale-125" 
                      : "bg-secondary-light border-accent/20 group-hover:border-accent/60"
                  )} />
                  <span className={cn(
                    "text-[9px] font-semibold mt-2 transition-colors duration-300 hidden sm:block",
                    isSelected ? "text-primary font-bold" : "text-primary/60 group-hover:text-primary"
                  )}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Responsive Mobile Labels */}
          {currentStepItem && (
            <div className="flex justify-between w-full px-1 mt-4 sm:hidden">
              <span className="text-[9px] font-semibold text-primary/60">₹30 Lakh</span>
              <span className="text-[9px] font-bold text-accent">{currentStepItem.label}</span>
              <span className="text-[9px] font-semibold text-primary/60">₹3 Crore+</span>
            </div>
          )}
        </div>
      </div>

      {errors.budget && (
        <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5" /> {errors.budget}
        </span>
      )}
    </div>
  );
}
