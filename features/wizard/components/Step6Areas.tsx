"use client";

import React from "react";
import { WizardFormData, SetStepDataFn } from "@/features/wizard/WizardContext";
import { Check, AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const CITY_AREAS: Record<string, string[]> = {
  "Delhi NCR": [
    "South Delhi", "North Delhi", "East Delhi", "West Delhi",
    "Central Delhi", "Noida", "Greater Noida", "Faridabad",
    "Gurgaon", "Aerocity"
  ],
  "Udaipur": [
    "Lake Pichola", "Fatehsagar Lake", "Shobhagpura",
    "Jagdish Temple Area", "Balicha (Bypass)"
  ],
  "Jaipur": [
    "C-Scheme", "Malviya Nagar", "Mansarovar",
    "Kukas (Heritage Corridor)", "Tonk Road", "Amer"
  ],
  "Goa": [
    "North Goa (Candolim/Calangute)", "South Goa (Cavelossim/Varca)",
    "Panaji", "Vagator", "Morjim"
  ],
  "Mumbai": [
    "South Mumbai (Colaba/Marine Drive)", "Bandra/Juhu",
    "Andheri", "Navi Mumbai", "Thane"
  ],
  "Bangalore": [
    "Indiranagar", "Whitefield", "Jayanagar",
    "Koramangala", "Nandi Hills (Outskirts)", "Yelahanka"
  ],
  "Hyderabad": [
    "Gachibowli", "Banjara Hills", "Jubilee Hills",
    "Secunderabad", "Shamshabad (Airport Area)"
  ],
  "Kolkata": [
    "Salt Lake", "New Town", "Alipore", "Ballygunge", "Park Street"
  ],
  "Chandigarh": [
    "Sector 17", "Mohali", "Panchkula", "Zirakpur", "Madhya Marg"
  ]
};

export interface Step6Props {
  formData: any;
  setStepData: SetStepDataFn;
  errors: any;
}

export function Step6Areas({ formData, setStepData, errors }: Step6Props) {
  const currentCity = formData.city;
  const areas = CITY_AREAS[currentCity] || [];
  const openAny = formData.openAnywhere;

  const toggleArea = (area: string) => {
    const isSelected = formData.venueAreas.includes(area);
    if (isSelected) {
      setStepData("venueAreas", formData.venueAreas.filter((x: string) => x !== area));
    } else {
      setStepData("venueAreas", [...formData.venueAreas, area]);
    }
  };

  const toggleOpenAnywhere = () => {
    const updatedVal = !formData.openAnywhere;
    setStepData("openAnywhere", updatedVal);
    if (updatedVal) {
      setStepData("venueAreas", []);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-primary">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-accent/15 pb-4">
        <div className="space-y-1.5 text-center md:text-left">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-primary">
            Preferred Areas in {currentCity || "Destination"}
          </h2>
          <p className="text-xs text-primary/70">
            Select the specific neighborhoods or select open anywhere to view all listings in {currentCity || "the city"}.
          </p>
        </div>

        {/* Open Anywhere Toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-2 bg-secondary/40 border border-accent/10 rounded-xl select-none self-center md:self-end">
          <div className="relative">
            <input
              type="checkbox"
              checked={openAny || false}
              onChange={toggleOpenAnywhere}
              className="sr-only"
            />
            <div className={cn(
              "w-10 h-6 rounded-full transition-colors",
              openAny ? "bg-primary" : "bg-accent/20"
            )} />
            <div className={cn(
              "absolute top-1 left-1 bg-secondary-light w-4 h-4 rounded-full transition-transform shadow-sm",
              openAny ? "translate-x-4" : ""
            )} />
          </div>
          <span className="text-xs font-semibold text-primary">Open Anywhere</span>
        </label>
      </div>

      {!openAny ? (
        <div className="space-y-3">
          {areas.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto p-2 bg-secondary/20 rounded-2xl border border-accent/10">
              {areas.map((area) => {
                const isSelected = formData.venueAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={cn(
                      "group p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer transform relative overflow-hidden",
                      isSelected
                        ? "border-accent bg-primary/5 shadow-[0_0_12px_rgba(200,164,93,0.2)] scale-[1.02]"
                        : "border-accent/15 bg-secondary-light hover:border-accent/40 hover:bg-accent/5 hover:scale-[1.01]"
                    )}
                  >
                    <span className="font-serif text-sm font-bold text-primary">{area}</span>
                    <div className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                      isSelected ? "bg-accent border-accent text-primary" : "border-accent/30 bg-transparent"
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-primary stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 max-w-md text-left">
              <label className="block text-xs font-semibold text-primary">
                Preferred Neighborhood / Area
              </label>
              <input
                type="text"
                value={formData.venueAreas[0] || ""}
                onChange={(e) => setStepData("venueAreas", e.target.value ? [e.target.value] : [])}
                placeholder="e.g. Backwaters, City Center, Mountains"
                className="w-full px-4 py-3 bg-secondary/50 border border-accent/30 rounded-xl text-xs focus:outline-none focus:border-primary transition-all text-primary font-medium"
              />
              <p className="text-[10px] text-primary/60 leading-normal">
                Since you selected a custom city or we couldn't match preset neighborhoods, please enter your preferred area manually.
              </p>
            </div>
          )}
          {errors.venueAreas && (
            <span className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.venueAreas}
            </span>
          )}
        </div>
      ) : (
        <div className="p-10 border border-dashed border-accent/30 rounded-2xl bg-secondary/30 text-center space-y-2">
          <MapPin className="h-6 w-6 text-accent mx-auto animate-pulse" />
          <h4 className="font-serif text-sm font-bold text-primary">Open Anywhere Active</h4>
          <p className="text-[10px] text-primary/60 max-w-xs mx-auto">
            We will list all eligible luxury properties across the entire city of <strong className="text-primary">{currentCity || "your destination"}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
