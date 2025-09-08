export interface ContactUs {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}

export interface FranchiseInquiry {
  id: number;
  business_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  location?: string;
  city?: string;
  state?: string;
  investment_capacity?: number;
  experience_years?: number;
  business_background?: string;
  why_franchise?: string;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: Date;
  updated_at: Date;
}

export interface ContactUsFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface FranchiseFormData {
  business_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  location?: string;
  city?: string;
  state?: string;
  investment_capacity?: number;
  experience_years?: number;
  business_background?: string;
  why_franchise?: string;
}
