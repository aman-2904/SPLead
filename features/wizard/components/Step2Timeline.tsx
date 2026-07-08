"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step2Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step2Timeline({ formData, setStepData, errors }: Step2Props) {
  // Generate next 12 months dynamically
  const months = [];
  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      shortName: monthNames[d.getMonth()].substring(0, 3),
      year: d.getFullYear()
    });
  }

  // Generate days for selected month
  const getDaysInMonth = (monthVal: string) => {
    if (!monthVal) return 30;
    const [yr, mn] = monthVal.split("-").map(Number);
    return new Date(yr || 2026, mn || 1, 0).getDate();
  };

  const daysCount = formData.weddingMonth ? getDaysInMonth(formData.weddingMonth) : 31;
  const daysArray = Array.from({ length: daysCount }, (_, i) => String(i + 1));

  return (
    <div className="space-y-8">
      <div className="space-y-1.5 text-center md:text-left">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
          Set your wedding date & duration
        </h2>
        <p className="text-xs text-primary/70">
          Choose a month (with optional day) and specify the duration of the celebrations.
        </p>
      </div>

      {/* Section 1: Wedding Date */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-accent/10 pb-2">
          <label className="block text-[10px] font-bold text-primary tracking-wider uppercase">
            1. Wedding Month <span className="text-primary">*</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary">
            <input
              type="checkbox"
              checked={formData.isFlexibleDate || false}
              onChange={(e) => {
                setStepData("isFlexibleDate", e.target.checked);
                if (e.target.checked) {
                  setStepData("weddingMonth", "");
                  setStepData("weddingDay", "");
                }
              }}
              className="h-3.5 w-3.5 rounded accent-primary border-accent/30 cursor-pointer"
            />
            Flexible on Dates
          </label>
        </div>

        {!formData.isFlexibleDate ? (
          <div className="space-y-6">
            {/* Grid of Months */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {months.map((m) => {
                const isSelected = formData.weddingMonth === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setStepData("weddingMonth", m.value);
                      setStepData("weddingDay", "");
                    }}
                    className={cn(
                      "p-3 rounded-xl border text-center transition-all cursor-pointer",
                      isSelected
                        ? "border-accent bg-primary/5 shadow-sm font-bold text-primary"
                        : "border-accent/15 bg-secondary/30 hover:bg-accent/5 text-primary/80"
                    )}
                  >
                    <div className="text-xs font-serif">{m.shortName}</div>
                    <div className="text-[9px] text-accent font-semibold">{m.year}</div>
                  </button>
                );
              })}
            </div>
            {errors.weddingMonth && (
              <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.weddingMonth}
              </span>
            )}

            {/* Optional Day Picker */}
            {formData.weddingMonth && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 pt-2"
              >
                <label className="block text-[10px] font-bold text-primary/60 tracking-wider uppercase">
                  Select Day (Optional)
                </label>
                <div className="flex flex-wrap gap-2 justify-start max-h-[140px] overflow-y-auto p-2 bg-secondary/30 rounded-xl border border-accent/10">
                  {daysArray.map((day) => {
                    const isSelected = formData.weddingDay === day;
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setStepData("weddingDay", "");
                          } else {
                            setStepData("weddingDay", day);
                          }
                        }}
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer",
                          isSelected
                            ? "bg-accent border-accent text-primary shadow-sm"
                            : "bg-secondary-light border-accent/10 text-primary/80 hover:border-accent/40"
                        )}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-accent/30 rounded-2xl bg-secondary/30 text-center space-y-2">
            <Calendar className="h-6 w-6 text-accent mx-auto animate-pulse" />
            <h4 className="font-serif text-sm font-bold text-primary">Flexible Timeline Active</h4>
            <p className="text-[10px] text-primary/60 max-w-xs mx-auto">
              We will optimize venue listings and vendor quotes for available auspicious dates in the upcoming months.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Wedding Duration */}
      <div className="space-y-4 pt-4 border-t border-accent/10">
        <div className="flex items-center justify-between border-b border-accent/10 pb-2">
          <label className="block text-[10px] font-bold text-primary tracking-wider uppercase">
            2. Wedding Duration <span className="text-primary">*</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-primary">
            <input
              type="checkbox"
              checked={formData.isFlexibleDuration || false}
              onChange={(e) => {
                setStepData("isFlexibleDuration", e.target.checked);
                if (e.target.checked) setStepData("duration", "Not Decided");
                else setStepData("duration", "");
              }}
              className="h-3.5 w-3.5 rounded accent-primary border-accent/30 cursor-pointer"
            />
            Not Yet Decided
          </label>
        </div>

        {!formData.isFlexibleDuration ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["1 Day", "2 Days", "3 Days", "4 Days"].map((d) => {
                const isSelected = formData.duration === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setStepData("duration", d)}
                    className={cn(
                      "p-3.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold",
                      isSelected
                        ? "border-accent bg-primary/5 shadow-sm text-primary"
                        : "border-accent/15 bg-secondary/30 hover:bg-accent/5 text-primary/80"
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
            {errors.duration && (
              <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="h-3.5 w-3.5" /> {errors.duration}
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 border border-dashed border-accent/30 rounded-2xl bg-secondary/30 text-center">
            <span className="text-xs text-primary/80 font-medium">
              Duration set to: <strong className="text-accent">Flexible / Not Yet Decided</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
