export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: "bride" | "groom" | "planner" | "vendor";
  weddingDate?: string;
  budgetLimit?: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: "venue" | "photographer" | "decorator" | "catering" | "makeup" | "outfit" | "other";
  rating: number;
  reviewsCount: number;
  startingPrice: number;
  location: string;
  imageUrl: string;
  isVerified: boolean;
  description: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  dueDate?: string;
  isCompleted: boolean;
  notes?: string;
}
