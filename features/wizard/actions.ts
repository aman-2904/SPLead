"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Validation schema for server-side verification
const onboardingSchema = z.object({
  name: z.string().min(2, "Name is required (at least 2 characters)"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(8, "Phone number is required (at least 8 digits)"),
  city: z.string().min(1, "Please select a wedding city"),
  customCity: z.string().optional(),
  weddingMonth: z.string().optional(),
  weddingDay: z.string().optional(),
  isFlexibleDate: z.boolean(),
  duration: z.string().optional(),
  isFlexibleDuration: z.boolean(),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  sameGuestsAllDays: z.boolean(),
  guestCountDetails: z.array(
    z.object({
      lunch: z.string().optional(),
      highTea: z.string().optional(),
      dinner: z.string().optional(),
      breakfast: z.string().optional(),
    })
  ).min(1),
  sameRoomsAllDays: z.boolean(),
  roomsCountDetails: z.array(
    z.object({
      rooms: z.string().optional(),
      guests: z.string().optional(),
    })
  ).min(1),
  openAnywhere: z.boolean(),
  venueAreas: z.array(z.string()).optional(),
  venueTypes: z.array(z.string()).min(1, "Please select at least one venue type"),
  isVegetarianOnly: z.boolean().optional(),
  budget: z.string().min(1, "Please select your target budget tier"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

/**
 * Server Action to store onboarding data in a single planning_requests table in Supabase.
 */
export async function submitOnboarding(input: OnboardingInput) {
  try {
    // 1. Validate input data
    const validation = onboardingSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed: " + validation.error.errors.map(e => e.message).join(", ")
      };
    }

    const data = validation.data;

    // 2. Create Planning Request in single table
    const { data: request, error: requestError } = await supabase
      .from("planning_requests")
      .insert({
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        city: data.city,
        custom_city: data.customCity || null,
        wedding_month: data.weddingMonth || null,
        wedding_day: data.weddingDay || null,
        is_flexible_date: data.isFlexibleDate,
        duration: data.duration || null,
        is_flexible_duration: data.isFlexibleDuration,
        budget: data.budget,
        is_vegetarian_only: data.isVegetarianOnly || false,
        services: data.services,
        guest_counts: data.guestCountDetails,
        rooms: data.roomsCountDetails,
        venue_areas: data.venueAreas || [],
        venue_types: data.venueTypes,
      })
      .select("id")
      .single();

    if (requestError) throw requestError;

    return {
      success: true,
      requestId: request.id,
    };
  } catch (error: any) {
    console.error("Supabase storage error:", error);
    return {
      success: false,
      error: error.message || "An unexpected database error occurred.",
    };
  }
}

/**
 * Server Action to save or update onboarding progress.
 */
export async function savePartialOnboarding(input: any, requestId?: string | null) {
  try {
    // Basic validation for initial insert
    if (!requestId) {
      if (!input.name || input.name.trim().length < 2) {
        return { success: false, error: "Name is required" };
      }
      if (!input.phone || input.phone.trim().length < 8) {
        return { success: false, error: "Phone number is required" };
      }
      if (!input.city) {
        return { success: false, error: "Wedding city is required" };
      }
    }

    const data: any = {
      name: input.name,
      email: input.email || null,
      phone: input.phone,
      city: input.city,
      custom_city: input.customCity || null,
      wedding_month: input.weddingMonth || null,
      wedding_day: input.weddingDay || null,
      is_flexible_date: input.isFlexibleDate ?? false,
      duration: input.duration || null,
      is_flexible_duration: input.isFlexibleDuration ?? false,
      budget: input.budget || null,
      is_vegetarian_only: input.isVegetarianOnly ?? false,
      services: input.services || [],
      guest_counts: input.guestCountDetails || [],
      rooms: input.roomsCountDetails || [],
      venue_areas: input.venueAreas || [],
      venue_types: input.venueTypes || [],
    };

    if (requestId) {
      const { error } = await supabase
        .from("planning_requests")
        .update(data)
        .eq("id", requestId);

      if (error) throw error;
      return { success: true, requestId };
    } else {
      const { data: request, error } = await supabase
        .from("planning_requests")
        .insert(data)
        .select("id")
        .single();

      if (error) throw error;
      return { success: true, requestId: request.id };
    }
  } catch (error: any) {
    console.error("Supabase partial storage error:", error);
    return {
      success: false,
      error: error.message || "An unexpected database error occurred.",
    };
  }
}

