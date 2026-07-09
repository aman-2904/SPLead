"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ChevronLeft, ChevronRight, Check, AlertCircle, ShieldCheck, HelpCircle, Calendar, Clock
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
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        setIsSubmitted(true);
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

  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);
  const [isBookingSaving, setIsBookingSaving] = useState<boolean>(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<Date>(new Date());

  const handleBookSlot = async () => {
    try {
      setIsBookingSaving(true);
      const updatedServices = [...(formData.services || [])];
      const cleanedServices = updatedServices.filter(
        (s: string) => !s.startsWith("consultation_date:") && !s.startsWith("consultation_time:")
      );
      cleanedServices.push(`consultation_date:${bookingDate}`);
      cleanedServices.push(`consultation_time:${bookingTime}`);
      
      setStepData("services", cleanedServices);

      const { savePartialOnboarding } = await import("@/features/wizard/actions");
      const result = await savePartialOnboarding(
        { ...formData, services: cleanedServices },
        formData.requestId || null
      );
      if (result.success) {
        setIsBookingConfirmed(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsBookingSaving(false);
    }
  };

  const TIME_SLOTS = [
    "09:00 AM - 09:30 AM",
    "09:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM",
    "12:30 PM - 01:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
    "03:00 PM - 03:30 PM",
    "03:30 PM - 04:00 PM",
    "04:00 PM - 04:30 PM",
    "04:30 PM - 05:00 PM",
    "05:00 PM - 05:30 PM",
    "05:30 PM - 06:00 PM"
  ];

  if (isSubmitted) {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
      if (year > today.getFullYear() || month > today.getMonth()) {
        setCurrentCalendarMonth(new Date(year, month - 1, 1));
      }
    };

    const handleNextMonth = () => {
      setCurrentCalendarMonth(new Date(year, month + 1, 1));
    };

    return (
      <div className="w-full max-w-4xl mx-auto bg-secondary-light border border-accent/20 rounded-3xl overflow-hidden shadow-2xl elegant-glow p-8 md:p-12 text-center space-y-8 animate-fade-in text-primary">
        <div className="space-y-3">
          <div className="h-14 w-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="h-7 w-7 text-accent fill-accent animate-pulse" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            Thank you, {formData.name || "there"}!
          </h1>
          <p className="text-sm text-primary/80 max-w-md mx-auto leading-relaxed">
            Your wedding preferences have been successfully shared. Let's start crafting your dream celebration!
          </p>
        </div>

        {isBookingConfirmed ? (
          /* Booking Confirmed View */
          <div className="border-t border-b border-accent/15 py-8 my-4 space-y-6">
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-accent/10 border border-accent/30 shadow-sm space-y-3 text-center animate-fade-in">
              <span className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Check className="h-5 w-5 text-accent" />
              </span>
              <h2 className="font-serif text-xl font-bold text-primary">Consultation Confirmed!</h2>
              <div className="space-y-1.5 text-xs font-semibold text-primary/80">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-accent shrink-0" />
                  <span>{new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-accent shrink-0" />
                  <span>{bookingTime}</span>
                </div>
                <div className="pt-2 text-[10px] text-accent block">Assigned Expert: Shivani</div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
              {/* Expert Profile Card */}
              <div className="flex gap-4 p-5 rounded-2xl bg-secondary/40 border border-accent/10 shadow-sm">
                <img 
                  src="/expert-shivani.png" 
                  alt="Shivani - Wedding Expert" 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-accent object-cover shrink-0"
                />
                <div className="space-y-1 md:space-y-1.5 justify-center flex flex-col">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Your Dedicated Expert</span>
                  <h3 className="font-serif text-lg font-bold text-primary leading-tight">Shivani</h3>
                  <p className="text-[10px] text-primary/70 font-semibold leading-relaxed">
                    Senior Wedding Consultant & Destination Planner
                  </p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-accent text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Testimonial Panel */}
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-between h-full relative">
                <span className="absolute -top-3.5 left-4 text-3xl font-serif text-accent/30 font-bold">“</span>
                <p className="text-[11px] text-primary/80 italic leading-relaxed pt-2">
                  Shivani was absolutely amazing! She understood our luxury vision for Udaipur and secured the palace booking at an incredible rate.
                </p>
                <div className="text-[9px] font-bold text-accent mt-3">
                  — Aanya & Rohan (Delhi NCR)
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Calendly-style Interactive Scheduler View */
          <div className="border-t border-accent/15 pt-8 my-4 text-left">
            <h3 className="font-serif text-lg font-bold text-center text-primary mb-1">
              Book Your Consultation with Shivani
            </h3>
            <p className="text-xs text-primary/60 text-center max-w-sm mx-auto mb-8">
              Select a date and a 30-minute time slot for your complimentary introductory consultation call.
            </p>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-secondary/40 border border-accent/10 rounded-2xl p-6 shadow-sm">
              {/* Left Column: Calendar */}
              <div className="w-full">
                <span className="text-[9px] font-bold text-accent uppercase tracking-widest block mb-4">
                  1. Select Date
                </span>
                <div className="p-4 bg-secondary-light rounded-xl border border-accent/10">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      disabled={year <= today.getFullYear() && month <= today.getMonth()}
                      className="p-1 hover:bg-accent/15 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <h4 className="font-serif font-bold text-sm text-primary">
                      {monthNames[month]} {year}
                    </h4>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-accent/15 rounded cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-primary/45 uppercase mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayIndex }).map((_, idx) => (
                      <div key={`empty-${idx}`} />
                    ))}
                    {Array.from({ length: totalDays }, (_, idx) => {
                      const day = idx + 1;
                      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const isPast = dateStr < todayStr;
                      const isSelected = bookingDate === dateStr;
                      
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            setBookingDate(dateStr);
                            setBookingTime(""); // Reset time on date change
                          }}
                          className={cn(
                            "aspect-square rounded-full flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer",
                            isPast && "text-primary/20 border-transparent cursor-not-allowed opacity-30",
                            !isPast && !isSelected && "bg-secondary-light border-accent/10 text-primary/80 hover:border-accent/40",
                            isSelected && "bg-accent border-accent text-primary shadow-sm"
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Time Slot Selector */}
              <div className="w-full flex flex-col h-full justify-between">
                <div>
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest block mb-4">
                    2. Select Time Slot
                  </span>
                  
                  {bookingDate ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-primary/80 mb-3">
                        Available times for {new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}:
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-[190px] overflow-y-auto pr-1">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = bookingTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingTime(slot)}
                              className={cn(
                                "py-2 px-3 border rounded-xl text-center text-xs font-semibold transition-all cursor-pointer",
                                isSelected
                                  ? "bg-primary border-primary text-secondary"
                                  : "border-accent/15 bg-secondary-light text-primary/80 hover:bg-accent/5 hover:border-accent/35"
                              )}
                            >
                              {slot.split(" - ")[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[210px] flex flex-col items-center justify-center border border-dashed border-accent/20 rounded-xl bg-secondary-light/50 text-center p-4">
                      <Calendar className="h-6 w-6 text-accent/40 mb-2 animate-bounce" />
                      <p className="text-xs font-semibold text-primary/50">
                        Please select a date on the calendar first
                      </p>
                    </div>
                  )}
                </div>

                {/* Book Consultation Button */}
                {bookingDate && bookingTime && (
                  <div className="pt-4 mt-4 border-t border-accent/10">
                    <button
                      type="button"
                      onClick={handleBookSlot}
                      disabled={isBookingSaving}
                      className="w-full py-2.5 bg-accent hover:bg-accent-dark text-primary font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] cursor-pointer uppercase tracking-wider"
                    >
                      {isBookingSaving ? "Reserving Slot..." : "Confirm Booking"}
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={
              isBookingConfirmed
                ? `https://wa.me/919990837771?text=Hi%20Shivani%2C%20I%20just%20booked%20a%20consultation%20with%20you%20for%20${bookingDate}%20at%20${bookingTime}%20(Client%3A%20${formData.name || ""}).%20Looking%2520forward%20to%20planning%20my%20wedding!`
                : `https://wa.me/919990837771?text=Hi%20Shivani%2C%20I%20just%20submitted%20my%20wedding%2520details%20(${formData.name || ""})%20on%20ShaadiPlatform.%20I%20would%20like%20to%20book%20a%2520consultation.`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-accent-dark text-primary font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer uppercase tracking-wider"
          >
            {isBookingConfirmed ? "Chat with Shivani on WhatsApp" : "Skip & Chat on WhatsApp"}
          </a>
          <button
            type="button"
            onClick={() => {
              resetWizard();
              router.push("/");
            }}
            className="w-full sm:w-auto px-6 py-3 border border-primary/25 hover:bg-primary/5 text-primary font-semibold text-xs rounded-full transition-all duration-300 cursor-pointer"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

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
