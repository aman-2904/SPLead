import { supabase } from "@/lib/supabase";
import { Vendor, ChecklistItem } from "@/types";

export const dbService = {
  async getVendors(category?: string): Promise<Vendor[]> {
    let query = supabase.from("vendors").select("*");
    if (category) {
      query = query.eq("category", category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getChecklist(userId: string): Promise<ChecklistItem[]> {
    const { data, error } = await supabase
      .from("checklist")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return data || [];
  },
};
