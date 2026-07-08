"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step5Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step5Rooms({ formData, setStepData, errors }: Step5Props) {
  const sameRooms = formData.sameRoomsAllDays;
  
  const handleFieldChange = (dayIndex: number, field: "rooms" | "guests", value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    const updated = [...formData.roomsCountDetails];
    if (!updated[dayIndex]) return;
    
    updated[dayIndex] = {
      ...updated[dayIndex],
      [field]: cleanVal
    };
    
    setStepData("roomsCountDetails", updated);
  };

  const addDay = () => {
    setStepData("roomsCountDetails", [
      ...formData.roomsCountDetails,
      { rooms: "", guests: "" }
    ]);
  };

  const removeDay = (dayIndex: number) => {
    if (formData.roomsCountDetails.length <= 1) return;
    const updated = formData.roomsCountDetails.filter((_: unknown, idx: number) => idx !== dayIndex);
    setStepData("roomsCountDetails", updated);
  };

  const toggleSameRooms = () => {
    const currentSame = !formData.sameRoomsAllDays;
    setStepData("sameRoomsAllDays", currentSame);
    if (currentSame && formData.roomsCountDetails.length > 1) {
      setStepData("roomsCountDetails", [formData.roomsCountDetails[0]]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-primary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-accent/15 pb-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
            Accommodation Requirements
          </h2>
          <p className="text-xs text-primary/70">
            Estimate rooms and guest counts needing accommodations to optimize resort buyouts.
          </p>
        </div>

        {/* Same Rooms All Days Toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-2 bg-secondary/40 border border-accent/10 rounded-xl select-none self-center md:self-end">
          <div className="relative">
            <input
              type="checkbox"
              checked={sameRooms || false}
              onChange={toggleSameRooms}
              className="sr-only"
            />
            <div className={cn(
              "w-10 h-6 rounded-full transition-colors",
              sameRooms ? "bg-primary" : "bg-accent/20"
            )} />
            <div className={cn(
              "absolute top-1 left-1 bg-secondary-light w-4 h-4 rounded-full transition-transform shadow-sm",
              sameRooms ? "translate-x-4" : ""
            )} />
          </div>
          <span className="text-xs font-semibold text-primary">Same for all days</span>
        </label>
      </div>

      <div className="space-y-6 max-h-[350px] overflow-y-auto p-2 bg-secondary/20 rounded-2xl border border-accent/10">
        {formData.roomsCountDetails.map((day: any, idx: number) => (
          <div
            key={idx}
            className="bg-secondary-light p-5 rounded-xl border border-accent/10 space-y-4 relative animate-fade-in text-left"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-primary">
                {sameRooms ? "Accommodation Block" : `Accommodation Block - Day ${idx + 1}`}
              </h3>
              {!sameRooms && formData.roomsCountDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(idx)}
                  className="text-[10px] text-primary/60 hover:text-primary font-bold cursor-pointer"
                >
                  Remove Day
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-primary/60 tracking-wider uppercase">
                  Number of Rooms Required
                </label>
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={day.rooms || ""}
                  onChange={(e) => handleFieldChange(idx, "rooms", e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 bg-secondary/35 border border-accent/35 rounded-xl text-xs text-primary font-medium focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-primary/60 tracking-wider uppercase">
                  Guests Needing Rooms
                </label>
                <input
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={day.guests || ""}
                  onChange={(e) => handleFieldChange(idx, "guests", e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2 bg-secondary/35 border border-accent/35 rounded-xl text-xs text-primary font-medium focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        ))}

        {!sameRooms && (
          <button
            type="button"
            onClick={addDay}
            className="w-full py-3 border border-dashed border-accent/40 rounded-xl text-xs font-semibold text-accent hover:bg-accent/5 hover:border-accent transition-all cursor-pointer text-center"
          >
            + Add Accommodation Block Day
          </button>
        )}
      </div>

      {errors.roomsCountDetails && (
        <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5" /> {errors.roomsCountDetails}
        </span>
      )}
    </div>
  );
}
