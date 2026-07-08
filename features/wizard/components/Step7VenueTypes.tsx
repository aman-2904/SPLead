"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const venueTypesList = [
  { id: "5-star-hotel", label: "5 Star Hotels", desc: "Premium hotels, grand ballrooms & grand scale facilities" },
  { id: "4-star-hotel", label: "4 Star Hotels", desc: "Elite comfort, elegant setups & full services" },
  { id: "3-star-hotel", label: "3 Star Hotels", desc: "Boutique stays, budget-friendly banquets & rooms" },
  { id: "luxury-resort", label: "Luxury Resorts", desc: "Scenic getaways, pool decks & signature villas" },
  { id: "farmhouse", label: "Farmhouse", desc: "Sprawling private estates, green fields & custom events" },
  { id: "banquet-hall", label: "Banquet Hall", desc: "Indoor events, centralized AC & customized stages" },
  { id: "palace", label: "Palace", desc: "Royal heritage fortresses, high arches & rich courtyards" },
  { id: "beach-resort", label: "Beach Resort", desc: "Coastal settings, sunset views & beachfront lawns" },
  { id: "heritage-property", label: "Heritage Property", desc: "Historic landmarks, stone pillars & vintage architecture" },
  { id: "open-lawn", label: "Open Lawn", desc: "Spacious lawns, outdoor setups & starry celebrations" },
];

export interface Step7Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step7VenueTypes({ formData, setStepData, errors }: Step7Props) {
  const toggleVenueType = (typeId: string) => {
    const isSelected = formData.venueTypes.includes(typeId);
    if (isSelected) {
      setStepData("venueTypes", formData.venueTypes.filter((x: string) => x !== typeId));
    } else {
      setStepData("venueTypes", [...formData.venueTypes, typeId]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-primary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-accent/15 pb-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
            Preferred Venue Styles & Catering
          </h2>
          <p className="text-xs text-primary/70">
            Select the kinds of properties you prefer and specify if you require pure vegetarian catering.
          </p>
        </div>

        {/* Vegetarian Catering Toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-2 bg-secondary/40 border border-accent/10 rounded-xl select-none self-center md:self-end">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isVegetarianOnly || false}
              onChange={(e) => setStepData("isVegetarianOnly", e.target.checked)}
              className="sr-only"
            />
            <div className={cn(
              "w-10 h-6 rounded-full transition-colors",
              formData.isVegetarianOnly ? "bg-emerald-600" : "bg-accent/20"
            )} />
            <div className={cn(
              "absolute top-1 left-1 bg-secondary-light w-4 h-4 rounded-full transition-transform shadow-sm",
              formData.isVegetarianOnly ? "translate-x-4" : ""
            )} />
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-primary block leading-none">Vegetarian Only</span>
            <span className="text-[8px] text-primary/50 block mt-0.5">Filter pure veg properties</span>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto p-2 bg-secondary/20 rounded-2xl border border-accent/10">
        {venueTypesList.map((type) => {
          const isSelected = formData.venueTypes.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => toggleVenueType(type.id)}
              className={cn(
                "group p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer transform relative overflow-hidden",
                isSelected
                  ? "border-accent bg-primary/5 shadow-[0_0_12px_rgba(200,164,93,0.2)] scale-[1.02]"
                  : "border-accent/15 bg-secondary-light hover:border-accent/40 hover:bg-accent/5 hover:scale-[1.01]"
              )}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-[9px] font-bold text-accent tracking-wider uppercase">
                  Style
                </span>
                <div className={cn(
                  "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                  isSelected ? "bg-accent border-accent text-primary" : "border-accent/30 bg-transparent"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-primary stroke-[3]" />}
                </div>
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-primary">{type.label}</h3>
                <p className="text-[9px] text-primary/60 mt-1 leading-normal line-clamp-2">
                  {type.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.venueTypes && (
        <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5" /> {errors.venueTypes}
        </span>
      )}
    </div>
  );
}
