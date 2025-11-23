export interface ContactUsRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface FranchiseInquiryRecord {
  id: number;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  state: string;
  investment_capacity: number;
  experience_years: number;
  business_background: string;
  why_franchise: string;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface LeadGenerationRecord {
  id: number;
  name: string;
  phone: string;
  message: string;
  preferred_location: string;
  cricket: number;
  fitness: number;
  recovery: number;
  running: number;
  pilates: number;
  personal_training: number;
  physiotherapy: number;
  group_classes: number;
  status: number;
  notes?: string;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FormSubmissionFilters {
  search?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  status: boolean;
  data: T[];
  pagination: PaginationData;
}

export interface StatusUpdateRequest {
  status: number;
  notes?: string;
}

export interface StatusUpdateResponse {
  status: boolean;
  message: string;
  data?: any;
}

export interface DeleteResponse {
  status: boolean;
  message: string;
}

export interface ExportResponse {
  status: boolean;
  data: Blob;
  filename: string;
}
