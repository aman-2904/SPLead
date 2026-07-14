"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { 
  Hotel, Camera, Flower2, Paintbrush, Sparkles, Disc, Utensils, 
  BedDouble, MailOpen, Globe, Car, Sparkle, Mic, ClipboardList, Check, AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "venue", label: "Venue", desc: "Palaces, resorts & banquets", icon: Hotel },
  { id: "photography", label: "Photography", desc: "Candid prints & cinematic films", icon: Camera },
  { id: "decoration", label: "Decoration", desc: "Thematic styling & floral decor", icon: Flower2 },
  { id: "makeup", label: "Makeup", desc: "Bridal makeovers & styling", icon: Paintbrush },
  { id: "mehendi", label: "Mehendi", desc: "Custom bridal henna & artists", icon: Sparkles },
  { id: "dj", label: "DJ", desc: "Celebrity DJs & sound setup", icon: Disc },
  { id: "rooms", label: "Rooms", desc: "Accommodations & guest buyouts", icon: BedDouble },
  { id: "invitation", label: "Invitation Cards", desc: "Designer wedding cards & boxes", icon: MailOpen },
  { id: "website", label: "Wedding Website", desc: "Custom digital RSVP portal", icon: Globe },
  { id: "transportation", label: "Transportation", desc: "Guest luxury cars & coach shuttles", icon: Car },
  { id: "pandit", label: "Pandit", desc: "Vedic registry & ritual assistance", icon: Sparkle },
  { id: "entertainment", label: "Entertainment", desc: "Choreographers, bands & singers", icon: Mic },
  { id: "planner", label: "Wedding Planner", desc: "Full coordination & execution", icon: ClipboardList },
];

export interface Step3Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step3Services({ formData, setStepData, errors }: Step3Props) {
  const allSelected = formData.services.length === SERVICES.length;
  const toggleSelectAll = () => {
    if (allSelected) {
      setStepData("services", []);
    } else {
      setStepData("services", SERVICES.map(s => s.id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-primary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
            Select the services you require
          </h2>
          <p className="text-xs text-primary/70">
            Select multiple categories or choose select all to bundle your luxury coordination.
          </p>
        </div>
        <button
          type="button"
          onClick={toggleSelectAll}
          className={cn(
            "px-4 py-2 border rounded-full text-xs font-semibold tracking-wider transition-all duration-300 uppercase cursor-pointer text-center md:self-end self-center",
            allSelected
              ? "border-primary bg-primary text-secondary"
              : "border-accent text-primary hover:bg-accent/15"
          )}
        >
          {allSelected ? "Clear All" : "Select All Services"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto p-2 bg-secondary/30 rounded-2xl border border-accent/10">
        {SERVICES.map((s) => {
          const isSelected = formData.services.includes(s.id);
          const IconComponent = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (isSelected) {
                  setStepData("services", formData.services.filter((x: string) => x !== s.id));
                } else {
                  setStepData("services", [...formData.services, s.id]);
                }
              }}
              className={cn(
                "group p-4 rounded-xl border text-left flex flex-col justify-between cursor-pointer transition-all duration-300 transform relative overflow-hidden",
                isSelected
                  ? "border-accent bg-primary/5 shadow-[0_0_12px_rgba(200,164,93,0.2)] scale-[1.02]"
                  : "border-accent/15 bg-secondary-light hover:border-accent/40 hover:bg-accent/5"
              )}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div className={cn(
                  "p-2 rounded-lg transition-colors duration-300",
                  isSelected ? "bg-accent/20 text-primary" : "bg-primary/5 text-accent"
                )}>
                  <IconComponent className="h-4 w-4" />
                </div>
                {isSelected && (
                  <div className="h-4 w-4 rounded-full bg-accent flex items-center justify-center shadow-sm">
                    <Check className="h-2.5 w-2.5 text-primary" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-primary">{s.label}</h3>
                <p className="text-[9px] text-primary/60 mt-1 leading-normal line-clamp-2">
                  {s.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      {errors.services && (
        <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5" /> {errors.services}
        </span>
      )}
    </div>
  );
}
