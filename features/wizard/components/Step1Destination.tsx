"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { motion } from "framer-motion";
import { MapPin, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// City Options with illustration keys
const CITIES = [
  { name: "Delhi NCR", desc: "Grand Celebrations", key: "delhi", code: "DEL" },
  { name: "Jaipur", desc: "Royal Forts & Palaces", key: "jaipur", code: "JAI" },
  { name: "Goa", desc: "Beachfront Vows", key: "goa", code: "GOA" },
  { name: "Udaipur", desc: "Palace Lake Weddings", key: "udaipur", code: "UDA" },
  { name: "Mumbai", desc: "Coastal Glamour", key: "mumbai", code: "BOM" },
  { name: "Bangalore", desc: "Garden Elegance", key: "bangalore", code: "BLR" },
  { name: "Hyderabad", desc: "Nizami Splendour", key: "hyderabad", code: "HYD" },
  { name: "Kolkata", desc: "Artistic Heritage", key: "kolkata", code: "CCU" },
  { name: "Chandigarh", desc: "Modernist Milestones", key: "chandigarh", code: "IXC" },
];

function CityIllustration({ cityKey, isSelected }: { cityKey: string; isSelected: boolean }) {
  const strokeColor = isSelected ? "#C8A45D" : "#8C1D40";
  const fillOpacity = isSelected ? 0.25 : 0.08;

  switch (cityKey) {
    case "delhi":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M20 50h60M30 50V25M70 50V25" strokeLinecap="round" />
          <path d="M26 25h48M34 25v-8h32v8" />
          <path d="M40 50c0-6 4-10 10-10s10 4 10 10" />
          <path d="M38 17c0-4 3-7 12-7s12 3 12 7" />
          <circle cx="50" cy="30" r="3" fill={strokeColor} fillOpacity={fillOpacity} />
        </svg>
      );
    case "jaipur":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M15 50h70M25 50V30c0-5 3-9 8-9s8 4 8 9v20" />
          <path d="M59 50V30c0-5 3-9 8-9s8 4 8 9v20" />
          <path d="M41 50V22c0-6 4-10 9-10s9 4 9 10v28" />
          <path d="M45 12c0-3 2-5 5-5s5 2 5 5" />
          <circle cx="50" cy="22" r="2.5" fill={strokeColor} />
          <circle cx="33" cy="30" r="2" fill={strokeColor} />
          <circle cx="67" cy="30" r="2" fill={strokeColor} />
        </svg>
      );
    case "goa":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M15 50c15 0 25-5 35-5s20 5 35 5" strokeLinecap="round" />
          <path d="M20 50c3-10 10-25 22-25" strokeLinecap="round" />
          <path d="M42 25c-5 0-10-3-12-8M42 25c-2-5 0-11 4-13M42 25c5-1 9-5 10-10M42 25c5 3 8 8 7 13" strokeLinecap="round" />
          <circle cx="75" cy="20" r="6" fill={strokeColor} fillOpacity={fillOpacity} />
          <path d="M65 35c5 0 8-2 10-2s5 2 10 2" />
        </svg>
      );
    case "udaipur":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M10 48h80" strokeLinecap="round" />
          <path d="M20 48V32h25v16M55 48V25h25v23" />
          <path d="M25 32c0-4 3-7 7.5-7s7.5 3 7.5 7" />
          <path d="M60 25c0-4 4-8 10-8s10 4 10 8" />
          <path d="M35 48c5 3 15 3 20 0l3-4H32z" fill={strokeColor} fillOpacity={fillOpacity} />
          <path d="M45 44v-8l5 2v6" />
        </svg>
      );
    case "mumbai":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M15 50h70M25 50V25h50v25" strokeLinecap="round" />
          <path d="M33 50V35c0-4 3-7 8-7s8 3 8 7v15" />
          <path d="M51 50V35c0-4 3-7 8-7s8 3 8 7v15" />
          <path d="M20 25h60v-4H20z" fill={strokeColor} fillOpacity={fillOpacity} />
          <circle cx="50" cy="15" r="3" fill={strokeColor} />
        </svg>
      );
    case "bangalore":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M15 50h70M25 50V32c0-8 6-15 15-15h20c9 0 15 7 15 15v18" strokeLinecap="round" />
          <path d="M40 17v33M60 17v33M25 38h50" />
          <path d="M45 50c0-4 2-6 5-6s5 2 5 6" />
          <path d="M12 42c3-4 6-2 10-2M88 42c-3-4-6-2-10-2" strokeLinecap="round" />
        </svg>
      );
    case "hyderabad":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M15 50h70" strokeLinecap="round" />
          <path d="M30 50V22M70 50V22M38 50V22M62 50V22" />
          <path d="M26 22h48v-4H26z" fill={strokeColor} fillOpacity={fillOpacity} />
          <path d="M28 22V10h4v12M68 22V10h4v12" />
          <path d="M30 10c0-2 2-3 4-3s4 1 4 3" />
          <path d="M70 10c0-2 2-3 4-3s4 1 4 3" />
          <path d="M44 50c0-5 3-8 6-8s6 3 6 8" />
        </svg>
      );
    case "kolkata":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M10 46h80" strokeLinecap="round" />
          <path d="M20 46V20M80 46V20" strokeWidth="2" />
          <path d="M20 20c15 12 45 12 60 0" strokeWidth="1.5" />
          <path d="M20 26c15 10 45 10 60 0" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M30 33v13M40 36v10M50 37v9M60 36v10M70 33v13" strokeWidth="1" />
        </svg>
      );
    case "chandigarh":
      return (
        <svg viewBox="0 0 100 60" className="w-full h-16 transition-all duration-500 group-hover:scale-105" fill="none" stroke={strokeColor} strokeWidth="1.5">
          <path d="M20 50h60" strokeLinecap="round" />
          <path d="M50 50V35" strokeWidth="2" />
          <path d="M50 35c3-1 8-5 10-10s2-8-1-10c-2-1-4 1-5 3v5c0 1-2 1-2 0v-8c0-1-2-1-2 0v-8c0-1-2-1-2 0v11c0 1-2 1-2 0v-5c-1-2-3-3-5-2-3 2-3 5-1 10s7 9 10 10z" fill={strokeColor} fillOpacity={fillOpacity} />
        </svg>
      );
    default:
      return null;
  }
}

export interface Step1Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step1Destination({ formData, setStepData, errors }: Step1Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-1.5 text-center md:text-left">
        <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
          Tell us about your celebration details
        </h2>
        <p className="text-xs text-primary/70">
          Select your destination hub and introduce yourself to customize your luxury planner board.
        </p>
      </div>

      {/* Personal Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-secondary/35 p-6 rounded-2xl border border-accent/15">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-primary tracking-wider uppercase">
            Full Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setStepData("name", e.target.value)}
            placeholder="Enter your full name"
            className={cn(
              "w-full px-4 py-3 bg-secondary-light border rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium",
              errors.name ? "border-primary shadow-[0_0_10px_rgba(140,29,64,0.1)]" : "border-accent/30"
            )}
          />
          {errors.name && (
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-primary" /> {errors.name}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-primary tracking-wider uppercase">
            Phone Number <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => setStepData("phone", e.target.value)}
            placeholder="e.g. +91 99887 76655"
            className={cn(
              "w-full px-4 py-3 bg-secondary-light border rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium",
              errors.phone ? "border-primary shadow-[0_0_10px_rgba(140,29,64,0.1)]" : "border-accent/30"
            )}
          />
          {errors.phone && (
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-primary" /> {errors.phone}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-primary tracking-wider uppercase">
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setStepData("email", e.target.value)}
            placeholder="Enter your email address"
            className={cn(
              "w-full px-4 py-3 bg-secondary-light border rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium",
              errors.email ? "border-primary shadow-[0_0_10px_rgba(140,29,64,0.1)]" : "border-accent/30"
            )}
          />
          {errors.email && (
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-primary" /> {errors.email}
            </span>
          )}
        </div>
      </div>

      {/* Cities Grid Section */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-primary tracking-wider uppercase">
          Select Wedding City <span className="text-primary">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CITIES.map((c) => {
            const isSelected = formData.city === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setStepData("city", c.name);
                  setStepData("customCity", "");
                }}
                className={cn(
                  "group p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 transform cursor-pointer relative overflow-hidden",
                  isSelected
                    ? "border-accent bg-primary/5 shadow-[0_0_15px_rgba(200,164,93,0.25)] scale-[1.02]"
                    : "border-accent/20 bg-secondary/50 hover:bg-accent/5 hover:border-accent/40 hover:scale-[1.01]"
                )}
              >
                <div className="w-full flex items-center justify-between mb-3 z-10">
                  <span className="text-[9px] font-bold text-accent tracking-widest">
                    {c.code}
                  </span>
                  {isSelected && (
                    <div className="h-4 w-4 rounded-full bg-accent flex items-center justify-center shadow-sm">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                  )}
                </div>
                <div className="w-full mb-3 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <CityIllustration cityKey={c.key} isSelected={isSelected} />
                </div>
                <div className="z-10">
                  <h3 className="font-serif text-sm font-bold text-primary">{c.name}</h3>
                  <p className="text-[9px] text-primary/60 mt-0.5">{c.desc}</p>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setStepData("city", "other")}
            className={cn(
              "group p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 transform cursor-pointer relative",
              formData.city === "other"
                ? "border-accent bg-primary/5 shadow-[0_0_15px_rgba(200,164,93,0.25)] scale-[1.02]"
                : "border-accent/20 bg-secondary/50 hover:bg-accent/5 hover:border-accent/40 hover:scale-[1.01]"
            )}
          >
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-accent tracking-widest">CUSTOM</span>
              {formData.city === "other" && (
                <div className="h-4 w-4 rounded-full bg-accent flex items-center justify-center shadow-sm">
                  <Check className="h-2.5 w-2.5 text-primary" />
                </div>
              )}
            </div>
            <div className="w-full mb-3 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity py-4">
              <MapPin className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-primary">Other City</h3>
              <p className="text-[9px] text-primary/60 mt-0.5">Explore custom destinations</p>
            </div>
          </button>
        </div>
      </div>

      {formData.city === "other" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md pt-2"
        >
          <label className="block text-xs font-semibold text-primary mb-2">
            Enter Custom Wedding Destination
          </label>
          <input
            type="text"
            value={formData.customCity || ""}
            onChange={(e) => setStepData("customCity", e.target.value)}
            placeholder="e.g. Mussoorie, Kerala, London"
            className={cn(
              "w-full px-4 py-3 bg-secondary/50 border rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium",
              errors.customCity ? "border-primary shadow-[0_0_10px_rgba(140,29,64,0.1)]" : "border-accent/30"
            )}
          />
          {errors.customCity && (
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3 text-primary" /> {errors.customCity}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}
