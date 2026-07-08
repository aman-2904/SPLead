"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step4Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step4Guests({ formData, setStepData, errors }: Step4Props) {
  const sameAll = formData.sameGuestsAllDays;
  
  const handleFieldChange = (dayIndex: number, field: "lunch" | "highTea" | "dinner" | "breakfast", value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    const updated = [...formData.guestCountDetails];
    if (!updated[dayIndex]) return;
    
    updated[dayIndex] = {
      ...updated[dayIndex],
      [field]: cleanVal
    };
    
    setStepData("guestCountDetails", updated);
  };

  const addDay = () => {
    setStepData("guestCountDetails", [
      ...formData.guestCountDetails,
      { lunch: "", highTea: "", dinner: "", breakfast: "" }
    ]);
  };

  const removeDay = (dayIndex: number) => {
    if (formData.guestCountDetails.length <= 1) return;
    const updated = formData.guestCountDetails.filter((_: unknown, idx: number) => idx !== dayIndex);
    setStepData("guestCountDetails", updated);
  };

  const toggleSameAll = () => {
    const currentSame = !formData.sameGuestsAllDays;
    setStepData("sameGuestsAllDays", currentSame);
    if (currentSame && formData.guestCountDetails.length > 1) {
      setStepData("guestCountDetails", [formData.guestCountDetails[0]]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-primary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-accent/15 pb-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
            Estimate Meal-wise Guest Counts
          </h2>
          <p className="text-xs text-primary/70">
            Provide guest counts for each function to help caterers and venues calculate capacity.
          </p>
        </div>

        {/* Same Guests All Days Toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-2 bg-secondary/40 border border-accent/10 rounded-xl select-none self-center md:self-end">
          <div className="relative">
            <input
              type="checkbox"
              checked={sameAll || false}
              onChange={toggleSameAll}
              className="sr-only"
            />
            <div className={cn(
              "w-10 h-6 rounded-full transition-colors",
              sameAll ? "bg-primary" : "bg-accent/20"
            )} />
            <div className={cn(
              "absolute top-1 left-1 bg-secondary-light w-4 h-4 rounded-full transition-transform shadow-sm",
              sameAll ? "translate-x-4" : ""
            )} />
          </div>
          <span className="text-xs font-semibold text-primary">Same for all days</span>
        </label>
      </div>

      <div className="space-y-6 max-h-[350px] overflow-y-auto p-2 bg-secondary/20 rounded-2xl border border-accent/10">
        {formData.guestCountDetails.map((day: any, idx: number) => (
          <div
            key={idx}
            className="bg-secondary-light p-5 rounded-xl border border-accent/10 space-y-4 relative text-left"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-primary">
                {sameAll ? "Celebration Day" : `Celebration Day ${idx + 1}`}
              </h3>
              {!sameAll && formData.guestCountDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(idx)}
                  className="text-[10px] text-primary/60 hover:text-primary font-bold cursor-pointer"
                >
                  Remove Day
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "breakfast", label: "Breakfast" },
                { key: "lunch", label: "Lunch" },
                { key: "highTea", label: "High Tea" },
                { key: "dinner", label: "Dinner" },
              ].map((meal) => (
                <div key={meal.key} className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-primary/60 tracking-wider uppercase">
                    {meal.label}
                  </label>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={day[meal.key] || ""}
                    onChange={(e) => handleFieldChange(idx, meal.key as any, e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2 bg-secondary/35 border border-accent/35 rounded-xl text-xs text-primary font-medium focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {!sameAll && (
          <button
            type="button"
            onClick={addDay}
            className="w-full py-3 border border-dashed border-accent/40 rounded-xl text-xs font-semibold text-accent hover:bg-accent/5 hover:border-accent transition-all cursor-pointer text-center"
          >
            + Add Another Celebration Day
          </button>
        )}
      </div>

      {errors.guestCountDetails && (
        <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5" /> {errors.guestCountDetails}
        </span>
      )}
    </div>
  );
}
